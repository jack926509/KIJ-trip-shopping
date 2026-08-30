import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PRODUCTS } from '../assets/products.js';
import { STORE_SUMMARIES } from '../assets/stores.js';
import { createCatalogIndex } from '../assets/catalog-index.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexHtml = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const mapHtml = readFileSync(path.join(ROOT, 'map.html'), 'utf8');
const indexApp = readFileSync(path.join(ROOT, 'scripts/index-app.js'), 'utf8');
const mapApp = readFileSync(path.join(ROOT, 'scripts/map-app.js'), 'utf8');
const itineraryHtmlPath = path.join(ROOT, 'itinerary.html');
const itineraryAppPath = path.join(ROOT, 'scripts/itinerary-app.js');
const itineraryHtml = existsSync(itineraryHtmlPath) ? readFileSync(itineraryHtmlPath, 'utf8') : '';
const itineraryApp = existsSync(itineraryAppPath) ? readFileSync(itineraryAppPath, 'utf8') : '';
const failures = [];

if (!/<script type="module" src="scripts\/index-app\.js"><\/script>/.test(indexHtml)) {
  failures.push('index.html 沒有外部清單 module 引用');
}
if (!/<script type="module" src="scripts\/map-app\.js"><\/script>/.test(mapHtml)) {
  failures.push('map.html 沒有外部地圖 module 引用');
}
if (!/<script type="module" src="scripts\/itinerary-app\.js"><\/script>/.test(itineraryHtml)) {
  failures.push('itinerary.html 沒有外部行程 module 引用');
}
for (const [page, html] of [['清單', indexHtml], ['行程', itineraryHtml], ['地圖', mapHtml]]) {
  for (const href of ['index.html', 'itinerary.html', 'map.html']) {
    if (!html.includes(`href="${href}"`)) failures.push(`${page}頁底部導覽缺少 ${href}`);
  }
}
if (!/id="itineraryDayTabs"/.test(itineraryHtml) || !/id="remainingRouteGroups"/.test(itineraryHtml)) {
  failures.push('行程頁缺少日期分頁或即時補買路線容器');
}
if (!/ITINERARY_DAYS/.test(itineraryApp) || !/remainingGroups\(\)/.test(itineraryApp)) {
  failures.push('行程頁沒有使用固定行程與即時補買共用資料');
}
if (/id="routePanel"/.test(mapHtml)) failures.push('地圖頁仍保留舊購物路線建議面板');
if (!/createRoutePlanner/.test(mapApp) || !/searchParams\.get\('plan'\)/.test(mapApp) || !/searchParams\.get\('route'\)/.test(mapApp)) {
  failures.push('地圖頁尚未使用共用路線模組解析 plan／route 網址參數');
}
if (!/candidateProducts/.test(itineraryApp) || !/到店確認/.test(itineraryApp)) {
  failures.push('即時補買路線沒有標示候選店家的商品需到店確認');
}
if (!/renderStores\(\{ force: true \}\)/.test(mapApp)) {
  failures.push('地圖結束路線後沒有強制復原店家清單狀態');
}
if (!/import \{ AREA_LABELS, createRoutePlanner, haversineMeters \}/.test(mapApp)) {
  failures.push('地圖頁沒有使用共用距離函式');
}
if (/\.route-panel\s*\{/.test(mapHtml) || /\.route-stop-main\s*\{/.test(mapHtml)) {
  failures.push('地圖頁仍殘留已搬移路線面板的未使用樣式');
}
if (/<script type="module">[\s\S]*?import /.test(indexHtml) || /<script type="module">[\s\S]*?import /.test(mapHtml)) {
  failures.push('HTML 仍保留大型內嵌 module');
}
if (!/data-action="toggle-bought"/.test(indexApp)) {
  failures.push('可購買商品沒有輸出 data-action="toggle-bought" 按鈕');
}

/* 清單頁的搜尋與「只看未完成」是站在店裡最常用的兩個控制項；
 * 少了任何一半（HTML 有欄位但 JS 沒接、或反過來）畫面上都看不出來，
 * 只會變成「打字沒反應」，所以兩邊都釘住。 */
for (const id of ['kijSearch', 'kijSearchClear', 'kijUnboughtToggle', 'kijResultLine', 'kijEmpty']) {
  if (!indexHtml.includes(`id="${id}"`)) failures.push(`清單頁缺少 #${id}`);
  if (!indexApp.includes(`'${id}'`)) failures.push(`清單 module 沒有接上 #${id}`);
}
/* 搜尋要涵蓋店家名：「松本清有什麼」是實際會用的問法，
   而店家名不在商品欄位裡，漏掉時搜尋仍然「有反應」，只是永遠找不到店。 */
if (!/STORE_SUMMARIES\[storeId\]\?\.name/.test(indexApp)) {
  failures.push('商品搜尋索引沒有納入店家顯示名稱');
}
/* 地圖頁在 Leaflet 載不到時，店家清單／搜尋／篩選仍須運作。
 * 這曾經是把整支模組包在 `} else {` 裡而整段被跳過——畫面上卻寫著「仍可正常使用」。
 * 釘住兩件事：不再有那層 else，且 initMap 只在 hasLeaflet 時才呼叫。 */
if (/if \(!leafletReady \|\| typeof L === 'undefined'\) \{[\s\S]{0,400}\} else \{/.test(mapApp)) {
  failures.push('地圖模組又把主體包在 leafletReady 的 else 裡，Leaflet 失敗時清單會整個消失');
}
if (!/const hasLeaflet =/.test(mapApp) || !/if \(hasLeaflet\) \{[\s\S]{0,120}initMap\(\);/.test(mapApp)) {
  failures.push('地圖模組沒有以 hasLeaflet 收斂 initMap 的呼叫');
}
/* 降級訊息說「下方店家清單…仍可正常使用」，這句話只有在上面兩條成立時才是真的 */
if (!/下方店家清單、搜尋與篩選仍可正常使用/.test(mapHtml)) {
  failures.push('地圖降級訊息被改動，請同步確認清單在無 Leaflet 時是否真的可用');
}

/* 手機的店家連結用「內距＋等量負外距」撐大可點範圍，這只有在
 * 行距 ≥ 內距的兩倍時才安全；小於這個值，下一行的命中區會蓋住上一行的文字，
 * 變成點「唐吉訶德中洲店」卻開到「松本清博多站地下街店」——按錯會走到別家店。
 * 這是一組數字之間的約束，看 CSS 看不出來，所以在這裡釘住。 */
const kijCss = readFileSync(path.join(ROOT, 'assets/kij.css'), 'utf8');

/* 桌機底部導覽是三頁共用元件；若再次限定在 body.kij，沒有該 class 的地圖頁
 * 就會退回滿版導覽列，與清單／行程頁的置中膠囊不一致。 */
if (/body\.kij \.kij-bottombar/.test(kijCss)) {
  failures.push('桌機底部導覽仍只套用在 body.kij，地圖頁會維持滿版樣式');
}
if (!/@media \(min-width: 821px\) \{[\s\S]*?\.kij-bottombar \{[\s\S]*?width: min\(460px,[\s\S]*?bottom: 18px;/.test(kijCss)) {
  failures.push('共用桌機底部導覽缺少 460px 置中膠囊或 18px 底部距離');
}

const storeLinkPad = kijCss.match(/\.kij-store-links a \{[^}]*padding:\s*(\d+)px 0/);
const storeLinkGap = kijCss.match(/\.kij-store-links \{ gap:\s*(\d+)px/);
if (!storeLinkPad || !storeLinkGap) {
  failures.push('找不到手機店家連結的內距／行距宣告，無法驗證命中區是否重疊');
} else if (Number(storeLinkGap[1]) < Number(storeLinkPad[1]) * 2) {
  failures.push(`店家連結行距 ${storeLinkGap[1]}px 小於內距 ${storeLinkPad[1]}px 的兩倍，相鄰連結的命中區會重疊`);
}

/* 「只看未完成」是整趟旅程的檢視偏好，必須持久化 */
if (!/kij_unbought_only/.test(indexApp)) {
  failures.push('「只看未完成」沒有寫入 localStorage');
}

if (indexApp.includes("return '唐吉訶德／松本清／SUNDRUG';")) {
  failures.push('推薦店家仍以品類寫死，會把未確認店家誤標為可購買');
}

/* 候選店不能只存在資料層：一般商品卡必須有可展開的「到店確認」連結，
   否則把未證實店家從 stores 降級後，畫面會完全看不到可詢問地點。 */
const candidateStoreRendererUses = indexApp.match(/candidateStoreLinksHtml\(product/g) || [];
if (!/function candidateStoreLinksHtml\(product/.test(indexApp)
  || !/候選店（到店確認）/.test(indexApp)
  || candidateStoreRendererUses.length < 2
  || !/includeSharedGroups:\s*groupBadge/.test(indexApp)) {
  failures.push('一般商品卡沒有顯示候選店的到店確認連結');
}

/* 搜尋結果沒有滑鼠／行動電源的分區橫幅，卡片必須改由 groupBadge 情境補回候選店；
   鞋款則要在卡片直接顯示已確認的試穿店，不能只存在資料層。 */
if (/function candidateStoreLinksHtml[\s\S]*?if \(product\.group === 'mouse' \|\| product\.group === 'powerbank'\) return ''/.test(indexApp)) {
  failures.push('搜尋結果仍會隱藏滑鼠或行動電源的候選店');
}
if (/function recommendedStores[\s\S]*?product\.group === 'shoes'[^\n]*return \[\]/.test(indexApp)
  || !/product\.group === 'shoes' \? storeLinksHtml\(product\) : ''/.test(indexApp)) {
  failures.push('鞋款卡片沒有顯示已確認的試穿店家');
}

/* 涵蓋所有分類，不能只查 shopping。
   只查 shopping 時，便利商店與吹風機的商品即使寫了 stores，
   少了顯示名稱就整條連結不會渲染，畫面上完全看不出漏掉——
   實際發生過：7 項商品的店家連結靜靜消失了一段時間。

   顯示名稱現在來自 assets/stores.js（先前是 index.html 裡手抄的副本），
   因此這裡直接查那份資料；候選店家也一併檢查，避免日後把某家店從
   storeCandidates 升級成 stores 時，連結才無聲消失。 */
const missing = [...new Set(PRODUCTS.flatMap((product) => [...(product.stores ?? []), ...(product.storeCandidates ?? [])]))]
  .filter((storeId) => !STORE_SUMMARIES[storeId]);
if (missing.length > 0) failures.push(`商品指到的店家缺少顯示名稱：${missing.join('、')}`);

/* index.html 必須真的從 stores.js 取用，不能又退回自己維護一份。 */
if (!/import \{ STORE_SUMMARIES \} from '\.\.\/assets\/stores\.js'/.test(indexApp)) {
  failures.push('index.html 沒有從 assets/stores.js 匯入 STORE_SUMMARIES');
}

const catalog = createCatalogIndex(PRODUCTS);
if (catalog.byId.size !== PRODUCTS.length || catalog.byTracking.buy.length + catalog.byTracking.try.length !== PRODUCTS.length) {
  failures.push('共用商品索引未完整涵蓋 id 與 buy／try tracking');
}
for (const product of PRODUCTS) {
  if (!catalog.byGroup.get(product.group)?.includes(product)) failures.push(`${product.id} 未被共用 group 索引涵蓋`);
  for (const storeId of product.stores || []) {
    if (!catalog.productsForStore(storeId, 'confirmed').includes(product)) failures.push(`${product.id} 未被 confirmed 店家索引涵蓋`);
  }
  for (const storeId of product.storeCandidates || []) {
    if (!catalog.productsForStore(storeId, 'candidate').includes(product)) failures.push(`${product.id} 未被 candidate 店家索引涵蓋`);
  }
}
if (!/width="156" height="156" loading="lazy" decoding="async"/.test(indexApp) || !/img\.width = 48;[\s\S]*img\.height = 48;[\s\S]*img\.decoding = 'async';/.test(mapApp)) {
  failures.push('商品卡片或地圖縮圖缺少固定尺寸與非同步解碼');
}
for (const url of [
  'https://unpkg.com/leaflet@1.9.4/',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/',
  'https://unpkg.com/leaflet.markercluster@1.5.3/',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/',
]) {
  if (!mapHtml.includes(url)) failures.push(`地圖 CDN 備援缺少 ${url}`);
}
if (!/lastPlacementKey/.test(mapApp) || !/placementKey === lastPlacementKey\) return false/.test(mapApp) || !/renderKey === lastStoreRenderKey\) return false/.test(mapApp)) {
  failures.push('地圖 marker 或店家清單缺少 lastPlacementKey／no-op 契約');
}

if (failures.length > 0) {
  console.error(`✗ 清單互動與店家顯示契約失敗：\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('✓ 清單互動與店家顯示契約通過');
