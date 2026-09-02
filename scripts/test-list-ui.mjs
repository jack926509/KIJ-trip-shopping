import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
const routePlannerApp = readFileSync(path.join(ROOT, 'assets/route-planner.js'), 'utf8');
const itineraryHtmlPath = path.join(ROOT, 'itinerary.html');
const itineraryAppPath = path.join(ROOT, 'scripts/itinerary-app.js');
const itineraryHtml = existsSync(itineraryHtmlPath) ? readFileSync(itineraryHtmlPath, 'utf8') : '';
const itineraryApp = existsSync(itineraryAppPath) ? readFileSync(itineraryAppPath, 'utf8') : '';
const failures = [];

if (!/<script type="module" src="scripts\/index-app\.js\?v=\d{8}\.\d+"><\/script>/.test(indexHtml)) {
  failures.push('index.html 沒有外部清單 module 引用');
}
if (!/<script type="module" src="scripts\/map-app\.js\?v=\d{8}\.\d+"><\/script>/.test(mapHtml)) {
  failures.push('map.html 沒有外部地圖 module 引用');
}
if (!/<script type="module" src="scripts\/itinerary-app\.js\?v=\d{8}\.\d+"><\/script>/.test(itineraryHtml)) {
  failures.push('itinerary.html 沒有外部行程 module 引用');
}
if (!/<link rel="stylesheet" href="assets\/itinerary\.css\?v=\d{8}\.\d+">/.test(itineraryHtml)) {
  failures.push('itinerary.html 的行程樣式缺少日期與同日修訂號');
}

/* 三個入口與所有會讀取本次行程／店家／商品資料的巢狀 module 必須使用同一版號。
 * 只改 HTML 入口時，瀏覽器仍可能從 module 快取拿到舊資料，畫面就會與檔案不同。 */
const versionedModuleRefs = [
  ['清單入口', indexHtml, /scripts\/index-app\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程入口', itineraryHtml, /scripts\/itinerary-app\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程樣式', itineraryHtml, /assets\/itinerary\.css\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖入口', mapHtml, /scripts\/map-app\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['清單商品資料', indexApp, /assets\/products\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['清單店家資料', indexApp, /assets\/stores\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程商品資料', itineraryApp, /assets\/products\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程店家資料', itineraryApp, /assets\/stores\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程時段資料', itineraryApp, /assets\/itinerary\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程路線模組', itineraryApp, /assets\/route-planner\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖商品資料', mapApp, /assets\/products\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖店家資料', mapApp, /assets\/stores\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖路線模組', mapApp, /assets\/route-planner\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['路線時段資料', routePlannerApp, /itinerary\.js\?v=(\d{8}\.\d+)(?=['"])/],
  /* 共用樣式與共用小模組先前完全沒有版號，而 kij.css 是三頁都吃的那一支——
     改樣式是最頻繁的改動，卻剛好是唯一不會被快取版號保護的檔案，
     結果就是新 DOM 配舊 CSS。這三支必須跟著其他資產一起帶版號。 */
  ['清單共用樣式', indexHtml, /assets\/kij\.css\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程共用樣式', itineraryHtml, /assets\/kij\.css\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖共用樣式', mapHtml, /assets\/kij\.css\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖頁樣式', mapHtml, /assets\/map\.css\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖套件樣式', mapHtml, /assets\/vendor\/leaflet\/leaflet\.css\?v=(\d{8}\.\d+)(?=['"])/],
  ['清單商品索引', indexApp, /assets\/catalog-index\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['清單共用工具', indexApp, /assets\/app-utils\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖商品索引', mapApp, /assets\/catalog-index\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['地圖共用工具', mapApp, /assets\/app-utils\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['行程共用工具', itineraryApp, /assets\/app-utils\.js\?v=(\d{8}\.\d+)(?=['"])/],
  ['路線商品索引', routePlannerApp, /catalog-index\.js\?v=(\d{8}\.\d+)(?=['"])/],
];
const moduleVersions = versionedModuleRefs.map(([label, source, pattern]) => {
  const match = source.match(pattern);
  if (!match) failures.push(`${label}缺少日期與同日修訂號`);
  return match?.[1];
}).filter(Boolean);
if (new Set(moduleVersions).size > 1) failures.push('清單、行程、地圖與巢狀資料 module 的快取版號不一致');
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
/* Leaflet 自帶：這個網站要在日本的店裡用，境外 CDN 是訊號差時最先斷的一環，
   而 service worker 只能快取同源資產。把地圖套件掛回 CDN 等於同時放棄離線能力，
   也把「檔案內容由第三方決定」這件事重新引進來。 */
/* 地圖頁樣式不得再內嵌回 map.html：內嵌樣式拿不到 ?v= 版號、無法獨立快取，
   也讓頁面結構被 1,100 行樣式淹沒。另外兩頁本來就走外部樣式表。 */
if (/<style[\s>]/.test(mapHtml)) failures.push('map.html 不得再內嵌 <style>，地圖樣式屬於 assets/map.css');
if (!existsSync(path.join(ROOT, 'assets/map.css'))) failures.push('缺少 assets/map.css');

for (const cdn of ['unpkg.com', 'cdnjs.cloudflare.com']) {
  if (mapHtml.split('\n').some((line) => line.includes(cdn) && (line.includes('src=') || line.includes('href=')))) {
    failures.push(`地圖頁不得再從 ${cdn} 載入資產，Leaflet 已自帶於 assets/vendor/`);
  }
}
for (const vendored of [
  'assets/vendor/leaflet/leaflet.js',
  'assets/vendor/leaflet/leaflet.css',
  'assets/vendor/leaflet.markercluster/leaflet.markercluster.js',
]) {
  if (!mapHtml.includes(vendored)) failures.push(`地圖頁缺少自帶資產 ${vendored}`);
  if (!existsSync(path.join(ROOT, vendored))) failures.push(`自帶資產檔案不存在：${vendored}`);
}
/* 沒有 Leaflet 就只畫店家清單的降級路徑，是自帶之後唯一還會用到旗標的地方，
   自帶檔案一樣可能因部署漏檔而載不到，這兩個旗標不能跟著 CDN 一起被拿掉。 */
if (!/window\.__leafletReady/.test(mapHtml) || !/window\.__markerClusterReady/.test(mapHtml)) {
  failures.push('地圖頁移除了 Leaflet 載入結果旗標，map-app.js 的降級路徑會失效');
}

if (/id="routePanel"/.test(mapHtml)) failures.push('地圖頁仍保留舊購物路線建議面板');
if (!/createRoutePlanner/.test(mapApp) || !/searchParams\.get\('plan'\)/.test(mapApp) || !/searchParams\.get\('route'\)/.test(mapApp)) {
  failures.push('地圖頁尚未使用共用路線模組解析 plan／route 網址參數');
}
if (!/candidateProducts/.test(itineraryApp) || !/到店確認/.test(itineraryApp)) {
  failures.push('即時補買路線沒有標示候選店家的商品需到店確認');
}
const fixedStopRenderer = itineraryApp.match(/function renderFixedStop[\s\S]*?(?=function renderSegment)/)?.[0] || '';
if (!/stop\.candidateProducts/.test(fixedStopRenderer) || !/到店確認/.test(fixedStopRenderer)) {
  failures.push('固定行程沒有把候選商品明確渲染為到店確認');
}
if (!/if \(!routeMode\) \{[\s\S]{0,500}handleText\.textContent/.test(mapApp)) {
  failures.push('地圖重畫店家清單時會覆蓋固定路線標題');
}
if (!/if \(map && markerLayer && !routeMode\) renderMarkers\(stores\);/.test(mapApp)) {
  failures.push('路線模式仍會重畫一般店家圖釘，導致編號路線失焦');
}
const pageShowHandler = mapApp.match(/window\.addEventListener\('pageshow'[\s\S]*?\n\s*\}\);/)?.[0] || '';
if (!/if \(routeMode\) \{\s*updateRouteChrome\(\);\s*renderRouteOnMap\(\);\s*\}/.test(pageShowHandler)) {
  failures.push('地圖從 BFCache 返回後沒有重套路線標題並重新繪製路線');
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
if (!/import \{ STORE_SUMMARIES \} from '\.\.\/assets\/stores\.js\?v=\d{8}\.\d+'/.test(indexApp)) {
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
/* 這裡原本釘的是「unpkg 與 cdnjs 兩條備援都要在」。
   Leaflet 改為自帶之後，那個契約已由上方「不得再引用 CDN」的檢查取代——
   版本改釘在自帶檔案本身，避免升級時 map.html 與 assets/vendor/ 內容脫節。 */
/* 自帶檔案改用內容雜湊釘住，而不是找檔案裡的版本字串——
   markercluster 的壓縮檔裡根本沒有版本號，而雜湊連「同版本但被改過一個位元組」都擋得住。
   這等於把原本掛在 CDN URL 上的 SRI 搬進版控裡：檔案由本站部署，但仍然驗得出內容。
   leaflet.css 的雜湊與先前釘在 map.html 的 unpkg SRI 完全相同，
   證明自帶的位元組就是原本從 CDN 載到的那一份。
   升級套件時這裡的雜湊要跟著更新，這是刻意的：換掉第三方程式應該是明確的動作。 */
const VENDOR_HASHES = {
  'assets/vendor/leaflet/leaflet.js': 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=',
  'assets/vendor/leaflet/leaflet.css': 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=',
  'assets/vendor/leaflet.markercluster/leaflet.markercluster.js': 'sha256-Hk4dIpcqOSb0hZjgyvFOP+cEmDXUKKNE/tT542ZbNQg=',
  'assets/vendor/leaflet.markercluster/MarkerCluster.css': 'sha256-YU3qCpj/P06tdPBJGPax0bm6Q1wltfwjsho5TR4+TYc=',
  'assets/vendor/leaflet.markercluster/MarkerCluster.Default.css': 'sha256-YSWCMtmNZNwqex4CEw1nQhvFub2lmU7vcCKP+XVwwXA=',
};
for (const [file, expected] of Object.entries(VENDOR_HASHES)) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) { failures.push(`自帶套件檔案不存在：${file}`); continue; }
  const actual = `sha256-${createHash('sha256').update(readFileSync(full)).digest('base64')}`;
  if (actual !== expected) failures.push(`${file} 內容與釘住的雜湊不符（實際 ${actual}）`);
}
/* 自帶第三方程式就有義務保留授權條款（Leaflet BSD-2-Clause、markercluster MIT）。 */
for (const licence of ['assets/vendor/leaflet/LICENSE', 'assets/vendor/leaflet.markercluster/MIT-LICENCE.txt']) {
  if (!existsSync(path.join(ROOT, licence))) failures.push(`自帶套件缺少授權檔 ${licence}`);
}
if (!/lastPlacementKey/.test(mapApp) || !/placementKey === lastPlacementKey\) return false/.test(mapApp) || !/renderKey === lastStoreRenderKey\) return false/.test(mapApp)) {
  failures.push('地圖 marker 或店家清單缺少 lastPlacementKey／no-op 契約');
}

if (failures.length > 0) {
  console.error(`✗ 清單互動與店家顯示契約失敗：\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('✓ 清單互動與店家顯示契約通過');
