import { readFileSync } from 'node:fs';
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
const failures = [];

if (!/<script type="module" src="scripts\/index-app\.js"><\/script>/.test(indexHtml)) {
  failures.push('index.html 沒有外部清單 module 引用');
}
if (!/<script type="module" src="scripts\/map-app\.js"><\/script>/.test(mapHtml)) {
  failures.push('map.html 沒有外部地圖 module 引用');
}
if (/<script type="module">[\s\S]*?import /.test(indexHtml) || /<script type="module">[\s\S]*?import /.test(mapHtml)) {
  failures.push('HTML 仍保留大型內嵌 module');
}
if (!/data-action="toggle-bought"/.test(indexApp)) {
  failures.push('可購買商品沒有輸出 data-action="toggle-bought" 按鈕');
}

if (indexApp.includes("return '唐吉訶德／松本清／SUNDRUG';")) {
  failures.push('推薦店家仍以品類寫死，會把未確認店家誤標為可購買');
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
