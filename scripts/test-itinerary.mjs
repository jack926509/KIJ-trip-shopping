import assert from 'node:assert/strict';
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
assert.deepEqual(
  ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-03-tenjin-pm').stops.map((stop) => stop.storeId),
  [
    'biccamera-tenjin-1',
    'daiso-lachic-fukuoka-tenjin',
    'hoka-fukuoka-tenjin',
    'aeon-shoppers-fukuoka-tenjin',
    'reganet-tenjin',
    'cosmos-tenjin-daimaru-mae',
  ],
  '天神晚間固定順序不得被距離排序改寫'
);

const state = new Map();
const planner = createRoutePlanner({
  stores: STORES,
  products: PRODUCTS,
  readStoredBool: (key, fallback) => state.has(key) ? state.get(key) : fallback,
});

const fixed = planner.fixedSegment('2026-09-03-tenjin-pm');
assert.equal(fixed.stops.length, 6, '固定行程應包含 Cosmos 選配站');
assert.equal(fixed.stops.at(-1).optional, true, 'Cosmos 必須標成選配');
assert.equal(fixed.endTime, '20:50', 'Cosmos 20:30 抵達並停留 20 分，晚間行程應到 20:50');
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

console.log('✓ 行程資料與路線規劃契約通過');
