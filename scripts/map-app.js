import { STORES } from '../assets/stores.js';
import { PRODUCTS } from '../assets/products.js';
import { createCatalogIndex } from '../assets/catalog-index.js';
import { makeImageFallback, readStoredBool } from '../assets/app-utils.js';
import { AREA_LABELS, createRoutePlanner, haversineMeters } from '../assets/route-planner.js';

const leafletReady = await (window.__leafletReady || Promise.resolve(typeof L !== 'undefined')).catch(() => false);
await (window.__markerClusterReady || Promise.resolve(false));
if (!leafletReady || typeof L === 'undefined') {
  showMapFallback();
} else {
const CATALOG = createCatalogIndex(PRODUCTS);
const STORES_BY_ID = new Map(STORES.map((store) => [store.id, store]));
const ROUTE_PLANNER = createRoutePlanner({ stores: STORES, products: PRODUCTS, readStoredBool });
const CATEGORY_LABELS = { shoe: '鞋款', drug: '藥妝', daily: '生活雜貨', supermarket: '超市', convenience: '便利商店', electronics: '家電', 'gift-food': '食品伴手禮', clothing: '服飾用品' };
const MARKER_HTML = {
  shoe: '<span class="map-pin map-pin--shoe"><span aria-hidden="true"></span></span>',
  drug: '<span class="map-pin map-pin--drug"><span aria-hidden="true"></span></span>',
  daily: '<span class="map-pin map-pin--daily"><span aria-hidden="true"></span></span>',
  supermarket: '<span class="map-pin map-pin--supermarket"><span aria-hidden="true"></span></span>',
  convenience: '<span class="map-pin map-pin--convenience"><span aria-hidden="true"></span></span>',
  electronics: '<span class="map-pin map-pin--electronics"><span aria-hidden="true"></span></span>',
  'gift-food': '<span class="map-pin map-pin--gift-food"><span aria-hidden="true"></span></span>',
  clothing: '<span class="map-pin map-pin--clothing"><span aria-hidden="true"></span></span>'
};

let activeArea = 'all';
let activeCategory = 'all';
let searchTerm = '';           // 已轉小寫的搜尋關鍵字，空字串代表沒在搜尋
let frameAreaOverride = null;  // 使用者按跨區 chip 指定要框哪一區；篩選一變動就清掉
let userPosition = null;       // 按下「我在這」且定位成功後才有值
let userMarker = null;
let sortByDistance = false;
let map = null;
let markerLayer = null;       // 聚合圖層（3 家以上的密集群才進來）
let routeLayer = null;        // 路線模式的編號 marker 與連線
const markers = new Map();
let markerStores = [];        // 目前畫在地圖上的那一批店家（zoomend 重算聚合時要用）
let lastPlacementKey = '';    // 上一次的「店家＋密集群」組合，沒變就不重畫

/* 搜尋比對用的索引：店名、清單頁短名、品牌、店家型態、分類文字、區域文字，
 * 再加上這家店連結到的商品名稱（中文名、日文名、型號，含候選店家）。
 * 有商品名才打得到「行動電源」這種需求——使用者要找的是東西，不是店名。
 * 45 家店的索引在載入時算一次就好，之後每次搜尋只做字串比對。 */
const SEARCH_INDEX = new Map(STORES.map((store) => {
      const productNames = CATALOG.productsForStore(store.id, 'all')
    .flatMap((product) => [product.name, product.jaName, product.model, product.category]);
  return [store.id, [
    store.name, store.listName, store.brand, store.type,
    CATEGORY_LABELS[store.category], AREA_LABELS[store.area], ...productNames
  ].filter(Boolean).join(' ').toLowerCase()];
}));

function matchesSearch(store) {
  if (!searchTerm) return true;
  return (SEARCH_INDEX.get(store.id) || '').includes(searchTerm);
}

function makeMapsUrl(store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
}

/* 區域、分類、搜尋三者是 AND 關係：選了「天神」再搜「行動電源」，
 * 得到的是「天神有賣行動電源的店」，而不是兩者相加。 */
function visibleStores() {
  return STORES.filter(store =>
    (activeArea === 'all' || store.area === activeArea) &&
    (activeCategory === 'all' || store.category === activeCategory) &&
    matchesSearch(store)
  );
}

/* 「我在這」的距離文案：一律用直線距離（Haversine）估算，
 * 步行時間以 80 公尺／分換算。實際要繞路、要等紅燈，所以文案必須寫明是直線估算，
 * 不能讓使用者誤以為這是 Google Maps 那種真實步行路徑。 */
function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters / 10) * 10} 公尺`;
  return `${(meters / 1000).toFixed(1)} 公里`;
}

function distanceText(store) {
  if (!userPosition) return '';
  const meters = haversineMeters(userPosition, store);
  const minutes = Math.max(1, Math.round(meters / 80));
  return `直線約 ${formatDistance(meters)}・步行約 ${minutes} 分（直線估算，非實際路線）`;
}

/* 抽屜收在 peek 時唯一看得到的內容，見 .peek-summary 的樣式註解。 */
function peekSummaryText(stores) {
  if (stores.length === 0) return '這些條件下沒有店家，換個區域或分類再試一次。';
  if (userPosition) {
    const nearest = stores.reduce((best, store) => (
      haversineMeters(userPosition, store) < haversineMeters(userPosition, best) ? store : best
    ));
    const away = formatDistance(haversineMeters(userPosition, nearest));
    const rest = stores.length - 1;
    return `最近的是 ${nearest.name}，直線約 ${away}${rest > 0 ? `・往上滑看其餘 ${rest} 間` : ''}`;
  }
  return `往上滑看這 ${stores.length} 間店的地址、營業時間與你要買的東西`;
}

/* 定位成功且使用者打開「依距離排序」時才重排；否則維持 assets/stores.js 的原始順序。 */
function sortedStores(stores) {
  if (!userPosition || !sortByDistance) return stores;
  return stores.slice().sort((a, b) => haversineMeters(userPosition, a) - haversineMeters(userPosition, b));
}

function makeTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function makeDetail(label, value) {
  const row = document.createElement('div');
  row.append(makeTextElement('dt', '', label), makeTextElement('dd', '', value));
  return row;
}

function makeExternalLink(label, url, className) {
  const link = makeTextElement('a', className, label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.addEventListener('click', event => event.stopPropagation());
  return link;
}

function productsForStore(storeId, relation) {
      return CATALOG.productsForStore(storeId, relation);
}

/* 對齊清單頁的圖片載入失敗 fallback（顯示商品名稱首字色塊）。 */
    function makeImgFallback(letter) { return makeImageFallback(letter); }

/* 清單頁的已購買狀態存在 localStorage，地圖頁只讀不寫：
 * 站在店門口最想知道的是「這家店我還有幾項沒買」。 */
    function isBought(id) { return readStoredBool(`kij_bought_${id}`, false); }

/* 只有 tracking 為 buy 的品項才有「買了沒」的狀態；
 * 鞋款是到店試穿的比較項目，不能算進未購買數。 */
function remainingText(items) {
  const buyItems = items.filter((product) => product.tracking === 'buy');
  if (buyItems.length === 0) return '';
  const remaining = buyItems.filter((product) => !isBought(product.id)).length;
  return remaining === 0 ? '・都買齊了' : `・還沒買 ${remaining} 項`;
}

/* 路線建議的資料與排序已移至行程頁共用模組；地圖只負責把網址指定的路線畫出來。 */
let routeMode = null;

function routeLatLngs(group) {
  const points = group.anchor ? [[group.anchor.lat, group.anchor.lng]] : [];
  return points.concat(group.stores.map((store) => [store.lat, store.lng]));
}

/* 路線模式的地圖畫面：只有這條路線的編號 marker ＋ 連線。
 * 聚合圖層在這裡整個從地圖上移除——編號被聚合圓圈收進去的話，
 * 整條路線就看不出順序了（這正是本階段要解決的問題）。 */
function renderRouteOnMap() {
  if (!map || !routeLayer || !routeMode) return;
  if (map.hasLayer(markerLayer)) map.removeLayer(markerLayer);
  routeLayer.clearLayers();
  markers.clear();
  renderAreaChips([]);   // 路線模式不需要跨區 chip

  const latlngs = routeLatLngs(routeMode);
  L.polyline(latlngs, {
    color: '#2f6d5e',
    weight: 4,
    opacity: .9,
    dashArray: '7 9',
    lineCap: 'round'
  }).addTo(routeLayer);

  if (routeMode.anchor) {
    L.marker([routeMode.anchor.lat, routeMode.anchor.lng], {
      icon: L.divIcon({
        className: '',
        html: '<span class="route-start-pin">起</span>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -17]
      }),
      title: `起點：${routeMode.anchor.label}`,
      zIndexOffset: 900
    })
      .bindPopup(`<div class="popup-content"><strong>起點</strong><span>${routeMode.anchor.label}</span></div>`)
      .addTo(routeLayer);
  }

  routeMode.stores.forEach((store, index) => {
    const marker = L.marker([store.lat, store.lng], {
      icon: L.divIcon({
        className: '',
        html: `<span class="route-pin route-pin--${store.category}">${index + 1}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -16]
      }),
      title: `第 ${index + 1} 站：${store.name}`,
      zIndexOffset: 500 + index
    });
    const popup = createPopup(store);
    popup.prepend(makeTextElement('span', 'popup-step', `第 ${index + 1} 站`));
    marker.bindPopup(popup);
    marker.on('click', () => focusStore(store.id));
    marker.addTo(routeLayer);
    markers.set(store.id, marker);
  });

  map.fitBounds(L.latLngBounds(latlngs), { ...fitPadding(), maxZoom: 17 });
}

/* 路線模式的開關另外反映在：地圖上的「結束路線」按鈕、抽屜把手的文字。 */
function updateRouteChrome() {
  const exitBtn = document.getElementById('routeExitMapBtn');
  if (exitBtn) exitBtn.hidden = !routeMode;
  const handleText = document.getElementById('drawerHandleText');
  if (handleText && routeMode) {
    handleText.textContent = `${AREA_LABELS[routeMode.area]}路線 ${routeMode.stores.length} 站`;
  }
}

function enterRouteMode(group) {
  if (!group) return;
  routeMode = group;
  updateRouteChrome();
  renderRouteOnMap();
}

function exitRouteMode() {
  if (!routeMode) return;
  routeMode = null;
  updateRouteChrome();
  if (map && routeLayer) {
    routeLayer.clearLayers();
    if (!map.hasLayer(markerLayer)) markerLayer.addTo(map);
  }
  // 強制重畫：篩選、聚合與框選全部回到進入路線模式之前的狀態
  lastPlacementKey = '';
  renderStores({ force: true });
}

function renderProductGroup(items, label, container, { showRemaining = false } = {}) {
  if (items.length === 0) return;
  const wrap = document.createElement('div');
  wrap.className = 'store-products';
  const labelText = `${label} ${items.length} 項${showRemaining ? remainingText(items) : ''}`;
  wrap.append(makeTextElement('span', 'store-products-label', labelText));

  const shown = items.slice(0, 5);
  const thumbRow = document.createElement('div');
  thumbRow.className = 'store-products-thumbs';
  shown.forEach((p) => {
    const link = document.createElement('a');
    link.href = `index.html#${p.id}`;
    link.className = `store-product-thumb${showRemaining && p.tracking === 'buy' && isBought(p.id) ? ' is-bought' : ''}`;
        const img = document.createElement('img');
        img.alt = p.name;
        img.width = 48;
        img.height = 48;
    /* 45 張卡片一次可以掛到 200 張縮圖，全部 eager 會在開頁瞬間打滿連線；
     * 交給瀏覽器只載捲到的那幾張，解碼也不擋主執行緒。 */
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      img.replaceWith(makeImgFallback(p.name[0]));
    }, { once: true });
    img.src = p.image;
    link.append(img);
    thumbRow.append(link);
  });
  if (items.length > 5) {
    thumbRow.append(makeTextElement('span', 'store-products-more', `+${items.length - 5}`));
  }
  wrap.append(thumbRow);
  container.append(wrap);
}

function renderStoreProducts(store, container) {
  renderProductGroup(productsForStore(store.id, 'confirmed'), '你的清單', container, { showRemaining: true });
  renderProductGroup(productsForStore(store.id, 'candidate'), '建議到店確認', container);
}

function createStoreCard(store) {
  const card = document.createElement('article');
  card.className = 'store-card';
  card.dataset.storeId = store.id;
  const focusButton = document.createElement('button');
  focusButton.type = 'button';
  focusButton.className = 'store-focus';
  focusButton.setAttribute('aria-label', `在地圖上聚焦：${store.name}`);
  focusButton.addEventListener('click', () => focusStore(store.id));

  const tagRow = document.createElement('span');
  tagRow.className = 'tag-row';
  tagRow.append(
    makeTextElement('span', 'tag area-tag', AREA_LABELS[store.area]),
    makeTextElement('span', `tag category-tag category-${store.category}`, CATEGORY_LABELS[store.category])
  );

  const title = makeTextElement('span', 'store-name', store.name);
  const brand = makeTextElement('span', 'brand', store.brand);
  const details = document.createElement('dl');
  details.className = 'details';
  details.append(
    makeDetail('地址', store.address),
    makeDetail('營業時間', store.hours)
  );

  const note = makeTextElement('p', 'note', store.note);
  const actions = document.createElement('div');
  actions.className = 'card-actions';
  actions.append(makeExternalLink('Google Maps 導航', makeMapsUrl(store), 'action-link maps-link'));
  const officialSources = store.officialSources || [];
  if (store.officialUrl) {
    const primarySource = officialSources.find((source) => source.url === store.officialUrl);
    actions.append(makeExternalLink(primarySource ? primarySource.label : '官方資料', store.officialUrl, 'action-link'));
  }
  officialSources
    .filter((source) => source.url !== store.officialUrl)
    .forEach((source) => actions.append(makeExternalLink(source.label, source.url, 'action-link')));

  focusButton.append(tagRow, title, brand);
  card.append(focusButton);
  /* 距離列放在聚焦按鈕外面：它是參考資訊，不該被念進「在地圖上聚焦：某某店」的按鈕名稱裡 */
  const distance = distanceText(store);
  if (distance) card.append(makeTextElement('span', 'store-distance', distance));
  card.append(details, note);
  renderStoreProducts(store, card);
  card.append(actions);
  return card;
}

/* 自動框選：只框「店家數最多的那一簇」，其餘的簇交給地圖上的 chip。
 * 小倉離福岡約 40 公里，兩簇一起框會縮到看得見整個九州、店家全擠成一團。
 * 這裡刻意不寫死任何區域名稱（舊版寫死排除 kokura），純粹比大小——
 * 日後多一個區域，或某次篩選後小倉才是最大簇，行為都自動正確。
 * frameAreaOverride 是使用者按 chip 指定的區域；renderStores 一開頭就會清掉，
 * 所以只要篩選或搜尋一變動，就回到「框最大簇」的預設行為。 */
function areaClusters(stores) {
  const clusters = new Map();
  stores.forEach((store) => {
    if (!clusters.has(store.area)) clusters.set(store.area, []);
    clusters.get(store.area).push(store);
  });
  return clusters;
}

function framedSelection(stores) {
  const clusters = areaClusters(stores);
  if (clusters.size <= 1) return { framed: stores, others: [] };

  const byCount = [...clusters.entries()].sort((a, b) => b[1].length - a[1].length);
  const chosen = (frameAreaOverride && clusters.has(frameAreaOverride)) ? frameAreaOverride : byCount[0][0];
  return {
    framed: clusters.get(chosen),
    others: byCount
      .filter(([area]) => area !== chosen)
      .map(([area, list]) => ({ area, count: list.length }))
  };
}

/* 沒被框進畫面的區域，用地圖上一顆可點的 chip 呈現（例：「小倉還有 12 家 ›」），
 * 取代舊版那句「地圖先對焦博多・天神；小倉請按上方『小倉』」的純文字提示。
 * 按下去把框選切過去，chip 自然換成回原本那一區——因為切換後重算最大簇時，
 * 原本那一簇變成「其他」。 */
    let lastAreaChipsKey = '';

    function renderAreaChips(others) {
      const host = document.getElementById('mapAreaChips');
      if (!host) return;
      const key = others.map(({ area, count }) => `${area}:${count}`).join('|');
      if (key === lastAreaChipsKey) return;
      lastAreaChipsKey = key;

  const makeChip = (area, count) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'map-area-chip';
    chip.textContent = `${AREA_LABELS[area]}還有 ${count} 家 ›`;
    chip.setAttribute('aria-label', `把地圖移到${AREA_LABELS[area]}，那裡還有 ${count} 家店`);
    chip.addEventListener('click', () => {
      frameAreaOverride = area;
      renderMarkers(visibleStores());
    });
    return chip;
  };

  if (others.length === 0) {
    host.replaceChildren();
    return;
  }
  if (others.length === 1) {
    host.replaceChildren(makeChip(others[0].area, others[0].count));
    return;
  }

  /* 兩區以上時先收成一顆「其他區域 N 區 M 家 ›」，點開才展開個別區域。
   * 直接並排會在手機上疊掉一大塊地圖，也跟「我在這」搶位置。 */
  const total = others.reduce((sum, item) => sum + item.count, 0);
  const summary = document.createElement('button');
  summary.type = 'button';
  summary.className = 'map-area-chip map-area-chip--summary';
  summary.textContent = `其他區域 ${others.length} 區 ${total} 家 ›`;
  summary.setAttribute('aria-expanded', 'false');
  summary.setAttribute('aria-label', `展開其他 ${others.length} 個區域，共 ${total} 家店`);

  const group = document.createElement('div');
  group.className = 'map-area-chip-group';
  group.hidden = true;
  others.forEach(({ area, count }) => group.append(makeChip(area, count)));

  summary.addEventListener('click', () => {
    group.hidden = !group.hidden;
    summary.setAttribute('aria-expanded', String(!group.hidden));
  });

  host.replaceChildren(summary, group);
}

/* 框選時要讓開浮動控制列與抽屜佔掉的空間，否則圖釘會被框到它們底下看不見。
 * 高度用實測值而不是寫死：控制列在窄螢幕會換行、桌機版整個被搬進左側面板。 */
function fitPadding() {
  const stage = document.getElementById('mapStage');
  const topbar = document.getElementById('mapTopbar');
  if (!stage) return { paddingTopLeft: [40, 40], paddingBottomRight: [40, 40] };
  const topbarInStage = topbar && stage.contains(topbar);
  const stageHeight = stage.getBoundingClientRect().height;
  let top = topbarInStage
    ? Math.round(topbar.getBoundingClientRect().bottom - stage.getBoundingClientRect().top) + 20
    : 28;
  // 抽屜實際遮住多少就讓開多少（--drawer-visible 由抽屜狀態同步），再加浮動 chip 的高度
  const drawerVisible = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--drawer-visible')) || 110;
  let bottom = topbarInStage ? Math.round(drawerVisible) + 48 : 28;
  /* 上下留白合計不得吃掉超過地圖高度的七成，否則抽屜拉到 full 時
   * Leaflet 會拿到幾乎為零的可視區，框選結果變成毫無意義的極端縮放。 */
  const maxSum = stageHeight * 0.7;
  if (stageHeight > 0 && top + bottom > maxSum) {
    const ratio = maxSum / (top + bottom);
    top = Math.round(top * ratio);
    bottom = Math.round(bottom * ratio);
  }
  return { paddingTopLeft: [28, top], paddingBottomRight: [28, bottom] };
}

    let lastStoreRenderKey = '';
    let lastStoreFilterKey = '';

    function boughtStateKey() {
      return CATALOG.byTracking.buy.map((product) => `${product.id}:${isBought(product.id)}`).join('|');
    }

    function renderStores({ force = false } = {}) {
      // 篩選／搜尋只要重跑，使用者先前用 chip 指定的框選區域就失效
      const filterKey = `${activeArea}|${activeCategory}|${searchTerm}`;
      if (filterKey !== lastStoreFilterKey) frameAreaOverride = null;
      const stores = sortedStores(visibleStores());
      const renderKey = [filterKey, sortByDistance, userPosition?.lat || '', userPosition?.lng || '', boughtStateKey(), ...stores.map((store) => store.id)].join('|');
      if (!force && renderKey === lastStoreRenderKey) return false;
      lastStoreFilterKey = filterKey;
      lastStoreRenderKey = renderKey;
  const list = document.getElementById('storeList');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');
  const fragment = document.createDocumentFragment();

  stores.forEach(store => fragment.append(createStoreCard(store)));
  list.replaceChildren(fragment);
  emptyState.hidden = stores.length !== 0;
  resultCount.replaceChildren(
    document.createTextNode('目前顯示 '),
    makeTextElement('strong', '', String(stores.length)),
    document.createTextNode(` 間店家（共 ${STORES.length} 間）`)
  );

  /* 抽屜收合成 peek 時只看得到把手這一行，摘要要直接寫在把手上，
     使用者才知道下面還有幾家店可以拉開來看。 */
  const handleText = document.getElementById('drawerHandleText');
  if (handleText) {
    const filtered = Boolean(searchTerm) || activeArea !== 'all' || activeCategory !== 'all';
    handleText.textContent = `${filtered ? '符合條件 ' : ''}${stores.length} 間店家`;
  }

  /* 把手底下那一行：有定位就直接報最近的一家（收著抽屜也知道往哪走），
     沒定位就講清楚往上滑會看到什麼，不要留一行空白。 */
  const peek = document.getElementById('peekSummary');
  if (peek) peek.textContent = peekSummaryText(stores);

      if (map && markerLayer) renderMarkers(stores);
      return true;
}

function createPopup(store) {
  const popup = document.createElement('div');
  popup.className = 'popup-content';
  popup.append(
    makeTextElement('strong', '', store.name),
    makeTextElement('span', '', `${AREA_LABELS[store.area]}｜${CATEGORY_LABELS[store.category]}｜${store.address}`)
  );

  // 點地圖圖釘先看到「這家店我還有幾項沒買」，不必再往下找店家卡片
  const linked = productsForStore(store.id, 'confirmed');
  if (linked.length > 0) {
    popup.append(makeTextElement('span', 'popup-count', `你的清單 ${linked.length} 項${remainingText(linked)}`));
  }

  const distance = distanceText(store);
  if (distance) popup.append(makeTextElement('span', 'popup-distance', distance));
  return popup;
}

    function renderMarkers(stores, { animate = true, force = false } = {}) {
      const { framed, others } = framedSelection(stores);
      const placementKey = [
        ...stores.map((store) => store.id).sort(),
        `frame:${frameAreaOverride || ''}`,
        `framed:${framed.map((store) => store.id).sort().join(',')}`,
        `others:${others.map(({ area, count }) => `${area}:${count}`).join(',')}`,
        `cluster:${typeof L.markerClusterGroup === 'function'}`,
        `state:${boughtStateKey()}`,
      ].join('|');
      if (!force && placementKey === lastPlacementKey) return false;
      markerLayer.clearLayers();
      markers.clear();

  stores.forEach(store => {
    const icon = L.divIcon({
      className: '',
      html: MARKER_HTML[store.category],
      iconSize: [32, 38],
      iconAnchor: [16, 34],
      popupAnchor: [0, -33]
    });
    const marker = L.marker([store.lat, store.lng], { icon, title: store.name });
    marker.bindPopup(createPopup(store));
    marker.on('click', () => focusStore(store.id, { scrollCard: true }));
    marker.addTo(markerLayer);
    markers.set(store.id, marker);
  });

      lastPlacementKey = placementKey;
      renderAreaChips(others);

  if (framed.length > 1) {
    map.fitBounds(L.latLngBounds(framed.map(store => [store.lat, store.lng])), {
      ...fitPadding(),
      maxZoom: 16,
      animate
    });
  } else if (framed.length === 1) {
    map.setView([framed[0].lat, framed[0].lng], 16, { animate });
  } else {
        map.setView([33.591, 130.405], 13, { animate });
      }
      return true;
}

function applyFilters(filterType, value) {
  if (filterType === 'area') activeArea = value;
  if (filterType === 'category') activeCategory = value;

  document.querySelectorAll(`[data-${filterType}]`).forEach(button => {
    const isActive = button.dataset[filterType] === value;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
  renderStores();
  // 分類收起時，選了哪一類只看得到按鈕上的字，這裡要跟著更新
  if (filterType === 'category') syncCategoryFilter();
  // 點路線站點會一次套用 area＋category 兩個篩選，結果可能從 45 家掉到 1 家，
  // 選中的 pill 若在畫面外（分類共 8 個，手機一行放不下）使用者會看不出發生了什麼事。
  revealActiveFilter(`[data-${filterType}]`);
}

function focusStore(id, { scrollCard = false } = {}) {
      const store = STORES_BY_ID.get(id);
  if (!store) return;

  document.querySelectorAll('.store-card').forEach(card => {
    card.classList.toggle('is-focused', card.dataset.storeId === id);
  });

  if (scrollCard) {
    // 手機版卡片在抽屜裡，抽屜還收著就先拉到 half，不然按了看起來像沒反應
    expandDrawerAtLeast('half');
    document.querySelector(`.store-card[data-store-id="${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  if (!map || !markers.has(id)) return;
  const marker = markers.get(id);
  map.setView([store.lat, store.lng], Math.max(map.getZoom(), 16), { animate: true });
  /* 目標圖釘可能正被聚合圓圈收著，直接 openPopup 不會有任何反應；
   * zoomToShowLayer 會先拉到該圖釘展開的層級再開 popup。
   * 聚合套件沒載到時 markerLayer 是純 layerGroup，沒有這個方法，照舊直接開。 */
  if (typeof markerLayer.zoomToShowLayer === 'function') {
    markerLayer.zoomToShowLayer(marker, () => marker.openPopup());
  } else {
    marker.openPopup();
  }
}

function bindFilterButtons() {
  document.querySelectorAll('[data-area]').forEach(button => {
    button.addEventListener('click', () => applyFilters('area', button.dataset.area));
  });
  document.querySelectorAll('[data-category]').forEach(button => {
    button.addEventListener('click', () => applyFilters('category', button.dataset.category));
  });

  const toggle = document.getElementById('categoryToggle');
  toggle?.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
    syncCategoryFilter();
  });
}

/* 分類那一排在手機上預設收起（八顆 chip 會讓控制列多佔 144px，蓋掉半張地圖），
 * 由「分類 ▾」按鈕展開；桌機控制列在左側面板裡，空間夠，永遠攤開並藏掉切換鈕。
 * 收起時把目前選的分類寫在按鈕上，使用者才看得出篩選狀態。 */
function syncCategoryFilter() {
  const toggle = document.getElementById('categoryToggle');
  const group = document.getElementById('storeTypeFilter');
  if (!toggle || !group) return;

  const desktop = desktopQuery.matches;
  const expanded = desktop || toggle.getAttribute('aria-expanded') === 'true';
  toggle.hidden = desktop;
  group.hidden = !expanded;
  if (!desktop) {
    const label = activeCategory === 'all' ? '分類' : `分類：${CATEGORY_LABELS[activeCategory]}`;
    toggle.textContent = `${label} ${expanded ? '▴' : '▾'}`;
  }

  syncDrawerTopGap();
  markScrollableRows();
}

/* 被選中的篩選 pill 捲進可視範圍：分類共 8 個，手機上一列放不下，
 * 從網址參數進來時選中的那顆可能在畫面外。 */
function revealActiveFilter(selector) {
  document.querySelector(`${selector}.active`)?.scrollIntoView({ block: 'nearest', inline: 'center' });
  markScrollableRows();
}

/* 從清單頁的「推薦店家」標籤進來時，必須在建立地圖「之前」就把篩選設好。
 * 若等地圖建好再改篩選：initMap 的第一次 fitBounds 會把縮放動畫排到下一個 frame，
 * 同一個 tick 內後續的 setView 會被那個動畫覆蓋回博多預設視野，
 * 圖釘就落在畫面外（實測 ?store=kayanoya-kokura-izutsuya 完全看不到店）。 */
function readStoreUrlParam() {
  const storeId = new URLSearchParams(location.search).get('store');
  if (!storeId) return null;
      const store = STORES_BY_ID.get(storeId);
  if (!store) return null;
  activeArea = store.area;
  activeCategory = store.category;
  [['area', store.area], ['category', store.category]].forEach(([type, value]) => {
    document.querySelectorAll(`[data-${type}]`).forEach(button => {
      const isActive = button.dataset[type] === value;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  });
  return store;
}

function readRouteUrlParam() {
  const searchParams = new URLSearchParams(location.search);
  const planId = searchParams.get('plan');
  const routeArea = searchParams.get('route');
  const group = planId
    ? ROUTE_PLANNER.fixedSegment(planId)
    : (['tenjin', 'hakata', 'kokura'].includes(routeArea) ? ROUTE_PLANNER.remainingGroup(routeArea) : null);
  if (!group) return null;
  return { ...group, stores: group.stops.map((stop) => stop.store) };
}

function initMap() {
  if (window.__mapFallbackRequested || typeof L === 'undefined') {
    throw new Error('Leaflet 無法載入');
  }

  /* maxZoom 必須在 map 這一層明講：leaflet.markercluster 在 onAdd 時會呼叫
   * map.getMaxZoom()，若當下地圖上還沒有任何帶 maxZoom 的圖層，它會直接丟
   * 「Map has no maxZoom specified」，整個 initMap 掉進 catch、頁面誤判成
   * 地圖載不到而顯示降級畫面。值與下方圖磚的 maxZoom 一致。 */
  map = L.map('map', { attributionControl: false, zoomControl: false, maxZoom: 19 })
    .setView([33.591, 130.405], 13);
  // 縮放控制改掛右上角：左上角留給「小倉還有 13 家 ›」這類跨區 chip
  L.control.zoom({ position: 'topright', zoomInTitle: '放大', zoomOutTitle: '縮小' }).addTo(map);

  /* 圖釘聚合：天神一帶原本 20 幾根圖釘疊成一坨，站在現場根本點不到想要的那家。
   * disableClusteringAtZoom 18＝放到最大時全部散開；spiderfy 則處理同一棟樓的重疊店家。
   * 半徑取 30（不是套件預設的 80）：這個套件沒有「至少 N 家才聚合」的選項，
   * 只能靠縮半徑讓「真的快疊在一起」的才合併，避免整片地圖都是沒必要的「2」。
   * 硬性降級：CDN 沒把 leaflet.markercluster 送到時退回原本的 L.layerGroup()，
   * 地圖與所有互動照常運作，只是圖釘回到會疊在一起的舊行為，頁面不會整個壞掉。 */
  markerLayer = typeof L.markerClusterGroup === 'function'
    ? L.markerClusterGroup({
        maxClusterRadius: 30,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        disableClusteringAtZoom: 18,
        /* 套件預設是藍色圓圈，跟本站的綠色系對不起來，換成自訂的綠色圓＋數字 */
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          const size = count < 10 ? 36 : count < 25 ? 42 : 48;
          return L.divIcon({
            className: '',
            html: `<span class="map-cluster${count >= 25 ? ' map-cluster--lg' : ''}">${count}</span>`,
            iconSize: [size, size]
          });
        }
      })
    : L.layerGroup();
  // 圖磚先上，聚合圖層後上：聚合圖層加入地圖時就需要一個確定的最大縮放層級
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  })
    .on('tileerror', showMapFallback)
    .addTo(map);
  markerLayer.addTo(map);
  // 路線模式的編號 marker 與連線畫在這一層，跟聚合圖層分開才能整層開關
  routeLayer = L.layerGroup().addTo(map);
  /* 先讓 Leaflet 重量一次容器：syncLayout() 剛把控制列搬進左側面板，
   * 地圖容器的尺寸才剛定案。 */
  map.invalidateSize();
  /* 初始框選不帶動畫：帶動畫的 fitBounds 要跑完才會更新 zoom，
   * 期間任何一次重畫都會把它打斷，地圖就停在初始的 setView 上不動。 */
  renderMarkers(visibleStores(), { animate: false });
}

/* 只有「右邊還有沒露出來的東西」時才掛右緣淡出。
 * 只看 scrollWidth > clientWidth 的話，捲到底最後一顆 pill 仍是淡的——
 * 而 revealActiveFilter 正好常把選中的那顆送到最右邊。 */
function markScrollableRows() {
  document.querySelectorAll('.filter-group, .legend').forEach((row) => {
    row.classList.toggle('is-scrollable', row.scrollWidth - row.clientWidth - row.scrollLeft > 1);
  });
}

/* ── 抽屜（手機版）─────────────────────────────────────────
 * 三段吸附點：peek（只露把手與「N 間店家」摘要）／half（約半屏）／full。
 * 把手是 <button>：點一下依序切換，鍵盤 Enter／Space 同樣有效、aria-expanded 會跟著更新；
 * 拖曳只是額外的手勢捷徑，不是唯一操作路徑。
 * 桌機版（>820px）抽屜變成左側固定面板，這一整段的狀態切換都不作用。 */
const DRAWER_STATES = ['peek', 'half', 'full'];
const drawer = document.getElementById('drawer');
const drawerHandle = document.getElementById('drawerHandle');
const desktopQuery = window.matchMedia('(min-width: 821px)');

/* 三段各自「露出多少高度」。half 用 46vh，但不能超過抽屜本身的高度，
 * 否則在矮螢幕上 half 會跟 full 重疊、吸附點少一個。 */
function drawerVisibleHeights() {
  const height = drawer.offsetHeight;
  return {
    peek: Math.min(110, height),
    half: Math.min(Math.round(window.innerHeight * 0.46), height),
    full: height
  };
}

/* 讓地圖上的浮動元件知道抽屜現在遮住多少高度（見 :root 的 --drawer-visible） */
function syncDrawerVisible(visible) {
  document.documentElement.style.setProperty('--drawer-visible', `${Math.round(visible)}px`);
}

function setDrawerState(state) {
  drawer.dataset.state = state;
  drawerHandle.setAttribute('aria-expanded', String(state !== 'peek'));
  drawer.style.transform = '';   // 清掉拖曳過程留下的行內 transform，交還給 CSS 的吸附值
  syncDrawerVisible(drawerVisibleHeights()[state] ?? 110);
}

function expandDrawerAtLeast(minState) {
  if (desktopQuery.matches) return;
  if (DRAWER_STATES.indexOf(drawer.dataset.state) < DRAWER_STATES.indexOf(minState)) {
    setDrawerState(minState);
  }
}

let dragStartY = null;
let dragStartVisible = 0;
let dragMoved = false;

drawerHandle.addEventListener('pointerdown', (event) => {
  if (desktopQuery.matches) return;
  dragStartY = event.clientY;
  dragStartVisible = drawerVisibleHeights()[drawer.dataset.state] ?? 110;
  dragMoved = false;
  drawer.classList.add('is-dragging');
  drawerHandle.setPointerCapture(event.pointerId);
});

drawerHandle.addEventListener('pointermove', (event) => {
  if (dragStartY === null) return;
  const delta = dragStartY - event.clientY;   // 往上拖為正
  if (Math.abs(delta) > 4) dragMoved = true;
  const height = drawer.offsetHeight;
  const visible = Math.max(56, Math.min(height, dragStartVisible + delta));
  drawer.style.transform = `translateY(${height - visible}px)`;
  syncDrawerVisible(visible);
});

function endDrawerDrag(event) {
  if (dragStartY === null) return;
  const target = dragStartVisible + (dragStartY - event.clientY);
  dragStartY = null;
  drawer.classList.remove('is-dragging');
  drawer.style.transform = '';
  // 幾乎沒動＝使用者只是點了一下，讓後面的 click 事件去做循環切換
  if (!dragMoved) return;
  const heights = drawerVisibleHeights();
  setDrawerState(DRAWER_STATES.reduce((best, state) =>
    Math.abs(heights[state] - target) < Math.abs(heights[best] - target) ? state : best, DRAWER_STATES[0]));
}

drawerHandle.addEventListener('pointerup', endDrawerDrag);
drawerHandle.addEventListener('pointercancel', endDrawerDrag);

drawerHandle.addEventListener('click', () => {
  if (desktopQuery.matches) return;
  if (dragMoved) { dragMoved = false; return; }   // 剛剛是拖曳，不要又切一格
  setDrawerState(DRAWER_STATES[(DRAWER_STATES.indexOf(drawer.dataset.state) + 1) % DRAWER_STATES.length]);
});

/* 抽屜完全展開時不該蓋掉浮動控制列，上方留白依控制列的實測高度算，不寫死——
 * 搜尋框與兩排 chip 在窄螢幕會換行，高度不是固定值。 */
function syncDrawerTopGap() {
  const topbar = document.getElementById('mapTopbar');
  const stage = document.getElementById('mapStage');
  if (!topbar || !stage || !stage.contains(topbar)) return;
  const gap = Math.round(topbar.getBoundingClientRect().bottom - stage.getBoundingClientRect().top) + 12;
  document.documentElement.style.setProperty('--drawer-top-gap', `${gap}px`);
}

/* 桌機版把浮動控制列搬進左側面板（順序：標題→搜尋→篩選→結果數→店家卡），
 * 手機版再搬回地圖上浮著。同一份 DOM 搬移，不維護兩套 markup、不會兩邊漂移。 */
function syncLayout() {
  const topbar = document.getElementById('mapTopbar');
  const dock = document.getElementById('drawerDock');
  const stage = document.getElementById('mapStage');
  if (!topbar || !dock || !stage) return;
  if (desktopQuery.matches) {
    if (!dock.contains(topbar)) dock.append(topbar);
  } else if (!stage.contains(topbar)) {
    stage.append(topbar);
  }
  // 分類列的收合規則兩邊不同，搬完控制列要立刻重算，--drawer-top-gap 才量得到正確高度
  syncCategoryFilter();
  syncDrawerTopGap();
  // half 是 46vh，轉向或改視窗大小後要重算，浮動元件才不會停在舊高度
  syncDrawerVisible(drawerVisibleHeights()[drawer.dataset.state] ?? 110);
  markScrollableRows();
  if (map) map.invalidateSize();
}

/* ── 搜尋 ────────────────────────────────────────────────
 * 比對範圍見 SEARCH_INDEX：店名、品牌、分類、區域，以及該店連結到的商品名稱。 */
const searchInput = document.getElementById('storeSearch');
const searchClear = document.getElementById('storeSearchClear');
let searchTimer = null;

function commitSearch(value) {
  searchTerm = value.trim().toLowerCase();
  searchClear.hidden = value.length === 0;
  renderStores();
}

searchInput.addEventListener('input', () => {
  // 每打一個字就重跑 45 家店的比對＋整份卡片重繪太吵，等手指停 120ms 再跑
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => commitSearch(searchInput.value), 120);
});

// type="search" 在鍵盤按 Enter 或用瀏覽器自帶清除鈕時會發 search 事件，立即反應不等 debounce
searchInput.addEventListener('search', () => {
  window.clearTimeout(searchTimer);
  commitSearch(searchInput.value);
});

searchClear.addEventListener('click', () => {
  window.clearTimeout(searchTimer);
  searchInput.value = '';
  commitSearch('');
  searchInput.focus();
});

/* ── 「我在這」定位 ───────────────────────────────────────
 * 只有使用者按下按鈕才呼叫 getCurrentPosition，載入時絕不要權限。
 * 失敗只顯示一句白話說明（不用 alert、不自動重試），使用者仍可用區域與搜尋找店。 */
const locateBtn = document.getElementById('locateBtn');
const geoNotice = document.getElementById('geoNotice');
const sortDistanceBtn = document.getElementById('sortDistanceBtn');

function showGeoNotice(text) {
  geoNotice.textContent = text;
  geoNotice.hidden = !text;
}

function renderUserMarker() {
  if (!map || !userPosition) return;
  if (userMarker) {
    userMarker.setLatLng([userPosition.lat, userPosition.lng]);
    return;
  }
  // 自訂 divIcon，不用 Leaflet 預設的圖片標記（那組圖檔在本站根本沒放）
  userMarker = L.marker([userPosition.lat, userPosition.lng], {
    icon: L.divIcon({ className: '', html: '<span class="user-dot"></span>', iconSize: [18, 18], iconAnchor: [9, 9] }),
    title: '我的位置',
    keyboard: false,
    zIndexOffset: 1000
  }).addTo(map);
}

function resetLocateBtn() {
  locateBtn.disabled = false;
  locateBtn.textContent = '◎ 我在這';
}

locateBtn.addEventListener('click', () => {
  if (!('geolocation' in navigator)) {
    showGeoNotice('這個瀏覽器沒有定位功能；還是可以用區域和搜尋找店。');
    expandDrawerAtLeast('half');
    return;
  }
  locateBtn.disabled = true;
  locateBtn.textContent = '◎ 定位中…';
  navigator.geolocation.getCurrentPosition(
    (position) => {
      resetLocateBtn();
      userPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
      showGeoNotice('');
      sortDistanceBtn.hidden = false;
      renderUserMarker();
      renderStores();
      if (map) map.setView([userPosition.lat, userPosition.lng], Math.max(map.getZoom(), 15), { animate: true });
    },
    () => {
      resetLocateBtn();
      showGeoNotice('拿不到定位，可能是瀏覽器沒給權限；還是可以用區域和搜尋找店。');
      expandDrawerAtLeast('half');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
});

sortDistanceBtn.addEventListener('click', () => {
  sortByDistance = !sortByDistance;
  sortDistanceBtn.setAttribute('aria-pressed', String(sortByDistance));
  sortDistanceBtn.textContent = sortByDistance ? '依距離排序中' : '依距離排序';
  renderStores();
});

syncLayout();
bindFilterButtons();
markScrollableRows();
window.addEventListener('resize', () => { syncLayout(); markScrollableRows(); });
desktopQuery.addEventListener('change', syncLayout);
document.querySelectorAll('.filter-group, .legend').forEach((row) => {
  row.addEventListener('scroll', markScrollableRows, { passive: true });
});
document.getElementById('resetFiltersBtn').addEventListener('click', () => {
  // 「重設篩選」要連搜尋框一起清，不然清單看起來還是被過濾過的
  window.clearTimeout(searchTimer);
  searchInput.value = '';
  searchClear.hidden = true;
  searchTerm = '';
  applyFilters('area', 'all');
  applyFilters('category', 'all');
});
// 地圖上的「結束路線」：抽屜收起時，這是離開路線模式唯一看得到的出口
document.getElementById('routeExitMapBtn').addEventListener('click', exitRouteMode);
// 先讀網址參數設好篩選，initMap 的第一次框選才會直接對焦到指定店家
const urlStore = readStoreUrlParam();
const urlRoute = readRouteUrlParam();
renderStores();

try {
  initMap();
} catch (error) {
  showMapFallback();
}

if (urlRoute) {
  enterRouteMode(urlRoute);
} else if (urlStore) {
  revealActiveFilter('[data-category]');
  focusStore(urlStore.id);
}

/* iOS Safari 按「上一頁」回來走 bfcache，script 不會重跑。
 * 使用者在清單頁勾了幾項再回地圖，「還沒買 N 項」與購物路線都必須跟著更新。 */
    window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    renderStores();
    if (routeMode?.kind === 'remaining') {
      const refreshed = ROUTE_PLANNER.remainingGroup(routeMode.area);
      if (refreshed) {
        routeMode = { ...refreshed, stores: refreshed.stops.map((stop) => stop.store) };
        updateRouteChrome();
        renderRouteOnMap();
      } else {
        exitRouteMode();
      }
    }
      }
    });
}
