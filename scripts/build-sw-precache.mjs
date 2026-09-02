/* 產生 sw.js 的預快取清單。
 *
 * 手維護這份清單一定會漂移：新增一項商品就要記得補一張縮圖路徑，
 * 而漏掉的後果是「那張卡片在店裡沒有圖」——不會有任何錯誤訊息。
 * 因此改由商品資料推導，並用 npm test 檢查 sw.js 裡的清單是否為最新。
 *
 * 用法：npm run build:sw
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PRODUCTS } from '../assets/products.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/* 版號取自 index.html，確保預快取的網址與頁面實際請求的網址逐字相同。
 * 對不上的話會變成「存了一份、又去抓一份」，離線時反而拿不到。 */
export function assetVersion() {
  const indexHtml = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const version = indexHtml.match(/\?v=(\d{8}\.\d+)/)?.[1];
  if (!version) throw new Error('index.html 找不到 ?v= 版號');
  return version;
}

export function precacheUrls() {
  const v = assetVersion();
  const core = [
    './',
    'index.html',
    'itinerary.html',
    'map.html',
    'favicon.svg',
    `assets/kij.css?v=${v}`,
    `assets/itinerary.css?v=${v}`,
    `assets/map.css?v=${v}`,
    `assets/products.js?v=${v}`,
    `assets/stores.js?v=${v}`,
    `assets/itinerary.js?v=${v}`,
    `assets/route-planner.js?v=${v}`,
    `assets/catalog-index.js?v=${v}`,
    `assets/app-utils.js?v=${v}`,
    `scripts/index-app.js?v=${v}`,
    `scripts/itinerary-app.js?v=${v}`,
    `scripts/map-app.js?v=${v}`,
    `scripts/register-sw.js?v=${v}`,
    `assets/vendor/leaflet/leaflet.css?v=${v}`,
    `assets/vendor/leaflet/leaflet.js?v=${v}`,
    `assets/vendor/leaflet.markercluster/MarkerCluster.css?v=${v}`,
    `assets/vendor/leaflet.markercluster/MarkerCluster.Default.css?v=${v}`,
    `assets/vendor/leaflet.markercluster/leaflet.markercluster.js?v=${v}`,
  ];

  /* Leaflet 的 CSS 以相對路徑引用這幾張圖（圖層切換鈕、預設圖釘）。
   * 少了它們，離線時地圖控制項會變成破圖。 */
  const leafletImages = [
    'layers.png', 'layers-2x.png', 'marker-icon.png', 'marker-icon-2x.png', 'marker-shadow.png',
  ].map((name) => `assets/vendor/leaflet/images/${name}`);

  /* 商品縮圖：現場一定會看，全部預先抓好（79 張約 1.3 MB）。
   * 放大圖不預抓——5.7 MB 而且多數不會點開，改成看過一次才留在 runtime 快取。 */
  const thumbs = PRODUCTS
    .map((product) => `images/thumb/${product.id}.webp`)
    .filter((relative) => existsSync(path.join(ROOT, relative)));

  return [...core, ...leafletImages, ...thumbs];
}

export function renderBlock(urls) {
  return `const PRECACHE_URLS = [\n${urls.map((url) => `  '${url}',`).join('\n')}\n];`;
}

const START = '/* PRECACHE_START */';
const END = '/* PRECACHE_END */';

export function currentBlock(swSource) {
  const start = swSource.indexOf(START);
  const end = swSource.indexOf(END);
  if (start === -1 || end === -1) throw new Error('sw.js 缺少 PRECACHE_START／PRECACHE_END 標記');
  return swSource.slice(start + START.length, end).trim();
}

export function writePrecache() {
  const swPath = path.join(ROOT, 'sw.js');
  const source = readFileSync(swPath, 'utf8');
  const block = renderBlock(precacheUrls());
  const start = source.indexOf(START);
  const end = source.indexOf(END);
  const next = `${source.slice(0, start + START.length)}\n${block}\n${source.slice(end)}`;
  writeFileSync(swPath, next);
  return block;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const block = writePrecache();
  console.log(`✓ sw.js 預快取清單已更新：${block.split('\n').length - 2} 筆`);
}
