/* 離線快取。
 *
 * 這個網站的使用情境是「站在日本的藥妝店貨架前單手操作」，
 * 而地下街與大型店內的訊號經常不穩。頁面本身連不上就打不開，
 * 比地圖畫不出來嚴重得多——清單與行程才是現場真正要看的東西。
 *
 * 策略刻意分成三種，因為三類資源的正確性要求不同：
 *
 *   1. HTML：網路優先、離線回退快取。
 *      HTML 是唯一指向「哪個版號」的檔案，必須拿得到新版才會載入新資產。
 *   2. 帶 ?v= 的資產（CSS／JS／自帶的 Leaflet）：快取優先。
 *      版號變了就是新網址、必然 miss，不會拿到過期內容。
 *   3. 圖片與地圖圖磚：快取優先，用到才存。
 *      商品縮圖在安裝時就預先抓好（現場一定會看），
 *      放大圖與圖磚太大，改成看過一次才留。
 *
 * 圖磚快取刻意不跟著版本汰換：圖磚與程式碼無關，
 * 改一行 CSS 就把辛苦存下來的福岡地圖全部丟掉並不合理。
 *
 * 更新流程：改任何資產後更新 CACHE_VERSION（與 HTML 的 ?v= 同步），
 * 並跑 npm run build:sw 重新產生預快取清單。
 */

const CACHE_VERSION = '20260902.1';
const PRECACHE = `kij-precache-${CACHE_VERSION}`;
const RUNTIME = `kij-runtime-${CACHE_VERSION}`;
const TILES = 'kij-tiles';
const TILE_LIMIT = 800;

/* 以下清單由 scripts/build-sw-precache.mjs 產生，請勿手改。
 * 相對路徑是刻意的：它們相對 sw.js 自身的位置解析，
 * 因此部署在 GitHub Pages 的子路徑（/repo-name/）底下也一樣正確。 */
/* PRECACHE_START */
const PRECACHE_URLS = [
  './',
  'index.html',
  'itinerary.html',
  'map.html',
  'favicon.svg',
  'assets/kij.css?v=20260902.1',
  'assets/itinerary.css?v=20260902.1',
  'assets/map.css?v=20260902.1',
  'assets/products.js?v=20260902.1',
  'assets/stores.js?v=20260902.1',
  'assets/itinerary.js?v=20260902.1',
  'assets/route-planner.js?v=20260902.1',
  'assets/catalog-index.js?v=20260902.1',
  'assets/app-utils.js?v=20260902.1',
  'scripts/index-app.js?v=20260902.1',
  'scripts/itinerary-app.js?v=20260902.1',
  'scripts/map-app.js?v=20260902.1',
  'scripts/register-sw.js?v=20260902.1',
  'assets/vendor/leaflet/leaflet.css?v=20260902.1',
  'assets/vendor/leaflet/leaflet.js?v=20260902.1',
  'assets/vendor/leaflet.markercluster/MarkerCluster.css?v=20260902.1',
  'assets/vendor/leaflet.markercluster/MarkerCluster.Default.css?v=20260902.1',
  'assets/vendor/leaflet.markercluster/leaflet.markercluster.js?v=20260902.1',
  'assets/vendor/leaflet/images/layers.png',
  'assets/vendor/leaflet/images/layers-2x.png',
  'assets/vendor/leaflet/images/marker-icon.png',
  'assets/vendor/leaflet/images/marker-icon-2x.png',
  'assets/vendor/leaflet/images/marker-shadow.png',
  'images/thumb/jinmart.webp',
  'images/thumb/roihi.webp',
  'images/thumb/nature.webp',
  'images/thumb/anelon.webp',
  'images/thumb/kombu.webp',
  'images/thumb/findmy.webp',
  'images/thumb/hareno-toothbrush.webp',
  'images/thumb/lion-stain-rescue.webp',
  'images/thumb/golden-seasoning.webp',
  'images/thumb/toothbrush-p61.webp',
  'images/thumb/3coins-luggage-band.webp',
  'images/thumb/kayanoya-dashi.webp',
  'images/thumb/ne7n.webp',
  'images/thumb/ne5n.webp',
  'images/thumb/elecom-ex-g.webp',
  'images/thumb/elecom-ex-g-pro.webp',
  'images/thumb/sanwa-400-ma092.webp',
  'images/thumb/sanwa-ma-ergw19.webp',
  'images/thumb/sanwa-trackball-400-mawbttb190.webp',
  'images/thumb/logicool-ergo-m575-sp.webp',
  'images/thumb/logicool-mx-ergo-s.webp',
  'images/thumb/logicool-mx-anywhere-3s.webp',
  'images/thumb/logicool-pebble-mouse-2-m350s.webp',
  'images/thumb/buffalo-bsmbw318bk.webp',
  'images/thumb/cloudtilt.webp',
  'images/thumb/cloudsurfermax.webp',
  'images/thumb/cloudsurfer2.webp',
  'images/thumb/cloud6.webp',
  'images/thumb/cloudrunner3.webp',
  'images/thumb/clifton11.webp',
  'images/thumb/bondi9.webp',
  'images/thumb/skyflow.webp',
  'images/thumb/transport2.webp',
  'images/thumb/gaviota5.webp',
  'images/thumb/hasameru-sponge.webp',
  'images/thumb/belt-fan.webp',
  'images/thumb/chawanmushi-no-moto.webp',
  'images/thumb/protect-u-folding-umbrella.webp',
  'images/thumb/wpc-iza-cool-compact.webp',
  'images/thumb/coleman-auto-folding-umbrella.webp',
  'images/thumb/pabron-ace-pro-x-36.webp',
  'images/thumb/taisho-kampo-stomach-48.webp',
  'images/thumb/morinaga-caramelic-pudding.webp',
  'images/thumb/strawberry-chocolate-melon-pan.webp',
  'images/thumb/jurokucha-630ml.webp',
  'images/thumb/gogo-no-kocha-ice-milk-tea.webp',
  'images/thumb/asari-miso-soup.webp',
  'images/thumb/hanamidori-kiwami-spice.webp',
  'images/thumb/kobayashi-zukkinon-ointment.webp',
  'images/thumb/jojoen-salad-sauce.webp',
  'images/thumb/fundokin-ao-yuzu-kosho.webp',
  'images/thumb/higashimaru-oyster-dashi-shoyu.webp',
  'images/thumb/3coins-defrosting-plate.webp',
  'images/thumb/3coins-folding-camp-chair.webp',
  'images/thumb/lulu-attack-ex-24.webp',
  'images/thumb/ohta-isan-s-50.webp',
  'images/thumb/daiso-toy-story-pendulum-clock.webp',
  'images/thumb/cp-lip-lip-essence.webp',
  'images/thumb/kinui-calm-7-soothing-serum.webp',
  'images/thumb/salonpas-ae-240.webp',
  'images/thumb/passtime-lx-premium-21.webp',
  'images/thumb/toraku-royal-custard-pudding.webp',
  'images/thumb/seasoning-container-pair.webp',
  'images/thumb/kobayashi-harenurse-spray.webp',
  'images/thumb/kobayashi-harenurse-18.webp',
  'images/thumb/muji-3layer-sponge-grey.webp',
  'images/thumb/daiso-basin-cleaner-cloth.webp',
  'images/thumb/calbee-satsumaimo-chips.webp',
  'images/thumb/cio-smartcoby-pro-slim-ss-10k.webp',
  'images/thumb/cio-smartcoby-slimii-wireless-2-2-pro-ss10k.webp',
  'images/thumb/cio-smartcoby-slimii-wireless-2-2-8k-special-edition.webp',
  'images/thumb/cio-smartcoby-pro-slim-cable.webp',
  'images/thumb/cio-smartcoby-pro-cable-c.webp',
  'images/thumb/horinishi-new-lemon.webp',
  'images/thumb/sato-acess-l.webp',
  'images/thumb/sugar-butter-tree-yaki-ringo-brulee.webp',
  'images/thumb/matsukiyo-lab-lutein-blueberry.webp',
  'images/thumb/orihiro-blueberry-lutein.webp',
  'images/thumb/mach-remastered.webp',
];
/* PRECACHE_END */

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    /* 逐筆而不是 cache.addAll()：addAll 只要有一筆失敗就整批放棄，
     * 於是一張漏掉的縮圖會讓整個離線快取都不存在。
     * 少一張圖只該少一張圖，不該讓清單頁在店裡打不開。 */
    const results = await Promise.allSettled(
      PRECACHE_URLS.map((url) => cache.add(new Request(url, { cache: 'reload' })))
    );
    const failed = results.filter((r) => r.status === 'rejected').length;
    if (failed > 0) console.warn(`[sw] 預快取有 ${failed}/${PRECACHE_URLS.length} 筆失敗，其餘已存下`);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([PRECACHE, RUNTIME, TILES]);
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('kij-') && !keep.has(name)).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

const isTile = (url) => /(^|\.)tile\.openstreetmap\.org$/.test(url.hostname)
  || /(^|\.)basemaps\.cartocdn\.com$/.test(url.hostname);

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  /* 只存成功的回應。把 404 或 5xx 存起來，等於把一次網路故障變成永久故障。 */
  if (response.ok) cache.put(request, response.clone());
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const hit = await cache.match(request);
    if (hit) return hit;
    /* 連快取都沒有：至少回一頁看得懂的說明，而不是瀏覽器的恐龍。 */
    const shell = await cache.match('index.html') || await caches.match('index.html');
    if (shell) return shell;
    throw error;
  }
}

async function cacheTile(request) {
  const cache = await caches.open(TILES);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') {
    cache.put(request, response.clone());
    /* 圖磚沒有上限就會無限長大。超過上限時丟掉最舊的一批，
     * 保留最近看過的區域——那通常就是還會再看的區域。 */
    const keys = await cache.keys();
    if (keys.length > TILE_LIMIT) {
      await Promise.all(keys.slice(0, keys.length - TILE_LIMIT).map((key) => cache.delete(key)));
    }
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (isTile(url)) {
    event.respondWith(cacheTile(request).catch(() => Response.error()));
    return;
  }

  /* 其他跨來源請求一律不插手：Google Maps 導航連結、外部商品頁等等
   * 都不該經過這裡，攔下來只會多一層可能出錯的環節。 */
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(networkFirst(request, RUNTIME));
    return;
  }

  event.respondWith(
    cacheFirst(request, request.destination === 'image' ? RUNTIME : PRECACHE)
      .catch(() => caches.match(request).then((hit) => hit || Response.error()))
  );
});
