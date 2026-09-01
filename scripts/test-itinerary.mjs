import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ITINERARY_DAYS, ITINERARY_SEGMENTS } from '../assets/itinerary.js';
import { STORES } from '../assets/stores.js';
import { PRODUCTS } from '../assets/products.js';
import { createRoutePlanner, haversineMeters } from '../assets/route-planner.js';

assert.deepEqual(
  ITINERARY_DAYS.map((day) => day.date),
  ['2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06'],
  '行程日期必須完整涵蓋 9/3–9/6'
);

const segmentIds = ITINERARY_SEGMENTS.map((segment) => segment.id);
assert.equal(new Set(segmentIds).size, segmentIds.length, '行程 segment id 不得重複');
const september3Afternoon = ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-03-tenjin-am');
assert.deepEqual(
  {
    startTime: september3Afternoon.startTime,
    endTime: september3Afternoon.endTime,
    stops: september3Afternoon.stops.map(({ storeId, arrivalTime, durationMinutes, optional }) => ({ storeId, arrivalTime, durationMinutes, optional })),
  },
  {
    startTime: '14:00',
    endTime: '16:15',
    stops: [
      { storeId: 'uniqlo-fukuoka-tenjin', arrivalTime: '14:00', durationMinutes: 35, optional: false },
      { storeId: 'loft-mina-tenjin', arrivalTime: '14:35', durationMinutes: 25, optional: false },
      { storeId: '3coins-plus-mina-tenjin', arrivalTime: '15:00', durationMinutes: 30, optional: false },
      { storeId: 'muji-tenjin-shoppers-fukuoka', arrivalTime: '15:35', durationMinutes: 25, optional: true },
    ],
  },
  '9/3 太宰府後只能排 14:00–16:15 的輕便採買'
);
assert.deepEqual(
  september3Afternoon.stops.map(({ storeId, productIds }) => ({ storeId, productIds })),
  [
    { storeId: 'uniqlo-fukuoka-tenjin', productIds: [] },
    { storeId: 'loft-mina-tenjin', productIds: ['protect-u-folding-umbrella', 'wpc-iza-cool-compact'] },
    { storeId: '3coins-plus-mina-tenjin', productIds: ['3coins-luggage-band', 'belt-fan'] },
    { storeId: 'muji-tenjin-shoppers-fukuoka', productIds: ['muji-3layer-sponge-grey'] },
  ],
  '9/3 白天只排輕便品，解凍盤、折疊椅與調味盒不得被放回固定行程'
);
const september3Evening = ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-03-tenjin-pm');
assert.deepEqual(
  september3Evening.stops.map((stop) => stop.storeId),
  [
    'hoka-fukuoka-tenjin',
    'biccamera-tenjin-1',
    'maxvalu-express-hakata-gion',
  ],
  '9/3 晚間必須依關門時間排成 HOKA、BicCamera、24 小時超市'
);
assert.deepEqual(
  september3Evening.stops.map(({ arrivalTime, durationMinutes }) => ({ arrivalTime, durationMinutes })),
  [
    { arrivalTime: '17:00', durationMinutes: 60 },
    { arrivalTime: '18:10', durationMinutes: 85 },
    { arrivalTime: '21:45', durationMinutes: 60 },
  ],
  '9/3 晚間三個購物站的時間不得漂移'
);
assert.deepEqual(
  september3Evening.stops.at(-1).productIds,
  ['kombu', 'hanamidori-kiwami-spice', 'jojoen-salad-sauce', 'fundokin-ao-yuzu-kosho', 'higashimaru-oyster-dashi-shoyu', 'horinishi-new-lemon', 'jurokucha-630ml', 'calbee-satsumaimo-chips'],
  'MaxValu 應完整涵蓋 8 項一般超市候選品，且不得混入專門店或便利商店限定品'
);
assert.equal(september3Evening.mapTitle, '天神 → 博多祇園・3 個購物站', '地圖標題應反映跨區且只標購物站');
assert.match(september3Evening.mapNote, /中洲晚餐.*訂位地點/, '地圖應說明中洲晚餐依實際訂位地點移動');

const september4 = ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-04-hakata');
assert.deepEqual(
  september4.stops.map(({ storeId, arrivalTime, durationMinutes, optional }) => ({ storeId, arrivalTime, durationMinutes, optional })),
  [
    { storeId: 'murasaki-sports-canal-city-hakata', arrivalTime: '10:00', durationMinutes: 75, optional: false },
    { storeId: 'alpen-fukuoka-canal-city-hakata', arrivalTime: '11:20', durationMinutes: 40, optional: false },
    { storeId: 'kayanoya-hakata-station-daitos', arrivalTime: '12:20', durationMinutes: 30, optional: false },
    { storeId: 'hands-hakata', arrivalTime: '12:50', durationMinutes: 30, optional: true },
  ],
  '9/4 必須依序處理 On、Alpen、茅乃舍與選配 HANDS'
);
assert.deepEqual(
  ITINERARY_DAYS.find((day) => day.date === '2026-09-05').segmentIds,
  ['2026-09-05-kokura-pm'],
  '9/5 回小倉後應顯示藥妝第一輪'
);
const september5Drugstore = ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-05-kokura-pm').stops[0];
assert.equal(september5Drugstore.optional, true, '9/5 藥妝第一輪必須可略過');
assert.deepEqual(september5Drugstore.productIds, [], '9/5 藥妝代表站不得綁商品或暗示庫存');
assert.equal(
  ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-06-kokura').endTime,
  '16:30',
  '9/6 藥妝補漏應在 16:30 收尾'
);
const september6Drugstore = ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-06-kokura').stops[0];
assert.equal(september6Drugstore.optional, true, '9/6 藥妝代表站必須可略過');
assert.deepEqual(september6Drugstore.productIds, [], '9/6 藥妝代表站不得綁商品或暗示庫存');

const itineraryHtml = await readFile(new URL('../itinerary.html', import.meta.url), 'utf8');
assert.ok(itineraryHtml.includes('藥妝不綁單一門市或庫存'), '頁面導言應說明藥妝只使用代表站');
assert.ok(!itineraryHtml.includes('藥妝與便利商店刻意不排'), '頁面導言不得殘留舊版藥妝完全不排行程的說法');
assert.ok(itineraryHtml.includes('itinerary-app.js?v=20260901'), '行程入口應更新快取版本，避免瀏覽器沿用舊資料模組');

const state = new Map();
const planner = createRoutePlanner({
  stores: STORES,
  products: PRODUCTS,
  readStoredBool: (key, fallback) => state.has(key) ? state.get(key) : fallback,
});

const fixed = planner.fixedSegment('2026-09-03-tenjin-pm');
assert.equal(fixed.stops.length, 3, '9/3 晚間固定行程應只保留 HOKA、電器與超市');
assert.equal(fixed.stops.at(-1).store.hours, '24 小時營業', '最後一站必須是 24 小時超市');
assert.equal(fixed.endTime, '22:45', 'MaxValu 21:45 抵達並停留 60 分，晚間行程應到 22:45');
assert.equal(fixed.stops.at(-1).confirmedProducts?.length, 0, 'MaxValu 的 8 項不得誤標為已確認通路');
assert.deepEqual(
  fixed.stops.at(-1).candidateProducts?.map((product) => product.id),
  september3Evening.stops.at(-1).productIds,
  'MaxValu 的 8 項必須全部保留為到店確認候選品'
);
assert.ok(
  fixed.stops.at(-1).products.some((product) => product.id === 'jurokucha-630ml'),
  '十六茶應排入 MaxValu 到店確認'
);
assert.ok(planner.routeLegs(fixed).every((leg) => Number.isFinite(leg.meters)), '每段固定路線都應可計算距離');
assert.ok(planner.routeDirectionsSegments(fixed).length > 0, '固定路線應可產生 Google Maps 導航');

const groups = planner.remainingGroups();
assert.deepEqual(groups.map((group) => group.area), ['tenjin', 'hakata', 'kokura'], '即時路線區域順序固定');
assert.ok(groups.every((group) => group.stops.length > 0), '每個即時路線區域都應有站點');
const welciaStop = groups.find((group) => group.area === 'tenjin').stops
  .find((stop) => stop.store.id === 'welcia-one-fukuoka-tenjin');
assert.ok(welciaStop.candidateProducts.some((product) => product.id === 'hareno-toothbrush'), '候選店家商品必須保留到店確認關係');
assert.ok(!welciaStop.confirmedProducts.some((product) => product.id === 'hareno-toothbrush'), '候選商品不得誤列為已確認通路');

assert.equal(Math.round(haversineMeters({ lat: 33.586903, lng: 130.401108 }, { lat: 33.587925, lng: 130.400894 })), 115);

/* 行程的每個停靠點只能列出「那家店真的有登記」的商品。
 * 實際發生過：9/4 的 HANDS 站列了 Sanwa 400-MA092，但那是 Sanwa Direct 網路限定商品，
 * stores 與 storeCandidates 都是空的——照著行程走會在店裡白找一輪，
 * 而且畫面上完全看不出來（商品名照樣印出來）。 */
const productsById = new Map(PRODUCTS.map((product) => [product.id, product]));
const mismatched = [];
for (const segment of ITINERARY_SEGMENTS) {
  for (const stop of segment.stops) {
    for (const productId of stop.productIds) {
      const product = productsById.get(productId);
      if (!product) { mismatched.push(`${segment.id} / ${stop.storeId}：查無商品 ${productId}`); continue; }
      const known = [...(product.stores ?? []), ...(product.storeCandidates ?? [])];
      if (!known.includes(stop.storeId)) {
        mismatched.push(`${segment.id} / ${stop.storeId}：${product.name}${known.length === 0 ? '（沒登記任何店家）' : ''}`);
      }
    }
  }
}
assert.deepEqual(mismatched, [], `行程停靠點列出了該店沒有登記的商品：\n  ${mismatched.join('\n  ')}`);

/* 藥妝固定行程只放「彈性進店」的代表站，不綁任何商品；便利商店也沿途遇到才買。
 * 因此這兩類「完全」倚賴即時補買路線。哪天有人從 STORES 拿掉一家 LAWSON，
 * 或把某項商品的 stores 清空，這些品項就會變成兩邊都查不到、卻沒有任何錯誤訊息。 */
const reachable = new Set();
for (const group of planner.remainingGroups()) {
  for (const stop of group.stops) {
    for (const product of [...stop.confirmedProducts, ...stop.candidateProducts]) reachable.add(product.id);
  }
}
const stranded = PRODUCTS
  .filter((product) => ['shopping', 'convenience'].includes(product.group))
  .filter((product) => !reachable.has(product.id))
  .map((product) => `${product.name}（${product.group}）`);
assert.deepEqual(stranded, [], `不排進固定行程的品項必須有即時補買路線可去，以下無處可買：\n  ${stranded.join('\n  ')}`);

console.log('✓ 行程資料與路線規劃契約通過');
