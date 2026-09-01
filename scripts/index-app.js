import { PRODUCTS } from '../assets/products.js?v=20260901';
/* 店家的顯示名稱與分類一律取自 assets/stores.js，本檔不再自行維護副本——
   先前那份手抄的 STORE_SUMMARIES 與地圖的 STORES 已經漂移到 18 家店顯示不同名稱。 */
import { STORE_SUMMARIES } from '../assets/stores.js?v=20260901';
import { createCatalogIndex } from '../assets/catalog-index.js';
import { makeImageFallback, readStoredBool, writeStoredBool } from '../assets/app-utils.js';

/* ────────────────────────────────────────────────────────────────
 * 資料索引
 * ──────────────────────────────────────────────────────────────── */
const CATALOG = createCatalogIndex(PRODUCTS);
const PRODUCTS_BY_ID = CATALOG.byId;
const GROUPS = ['shopping', 'convenience', 'powerbank', 'dryer', 'mouse', 'shoes'];
const GROUP_META = {
  shopping: { label: '藥妝日用', icon: '🛍️' },
  convenience: { label: '便利商店', icon: '🏪' },
  powerbank: { label: '行動電源', icon: '🔋' },
  dryer: { label: '吹風機', icon: '💨' },
  mouse: { label: '滑鼠', icon: '🖱️' },
  shoes: { label: '鞋款試穿', icon: '👟' },
};
let activeGroup = 'shopping';
/* 搜尋字串刻意不持久化：它是「現在站在這個貨架前」的臨時動作，
   下次開頁還帶著上次的關鍵字只會讓人以為清單不見了。
   「只看未完成」相反——那是整趟旅程的檢視偏好，記起來。 */
let searchQuery = '';
let unboughtOnly = false;

/* 這三個群組是「選一／選幾個參考」而非每項都要買，tracking 一律是 'try'
 * （已試穿／已選定），不計入「已買 X / 48」的購買進度。
 * 狀態列與分區計數要跟著這份清單走，否則改了 tracking 卻漏改顯示邏輯，
 * 就會變成滑鼠／行動電源分頁永遠顯示「已買 0 項」。 */
const TRY_ONLY_GROUPS = new Set(['shoes', 'mouse', 'powerbank']);

/* 6 種實際 category → 4 種色票 class 的對應規則。
 * 分類文字本身一律從 PRODUCTS 動態取得（不寫死清單），
 * 這裡只是「文字 → 色票」的樣式對照表，找不到對應時 fallback 到 kij-cat-shoe（中性藍）。 */
const CATEGORY_CHIP_CLASS = {
  '皮膚護理': 'kij-cat-drug',
  '痠痛舒緩': 'kij-cat-drug',
  '旅途常備藥': 'kij-cat-drug',
  '健康食品': 'kij-cat-drug',
  '食品伴手禮': 'kij-cat-food',
  '3C 配件': 'kij-cat-electronics',
  '日用品': 'kij-cat-shoe',
  '晴雨傘': 'kij-cat-shoe',
  '冰品': 'kij-cat-food',
  '麵包甜點': 'kij-cat-food',
  '飲品': 'kij-cat-food',
  '即食湯品': 'kij-cat-food',
  '零食': 'kij-cat-food',
  '廚房用品': 'kij-cat-food',
  '戶外用品': 'kij-cat-shoe',
};
function chipClassForCategory(category) {
  return CATEGORY_CHIP_CLASS[category] || 'kij-cat-shoe';
}

/* ────────────────────────────────────────────────────────────────
 * localStorage 存取（讀不到一律回傳預設值，絕不拋錯中斷頁面）
 * ──────────────────────────────────────────────────────────────── */
function readBool(key, fallback) { return readStoredBool(key, fallback); }
function writeBool(key, val) { writeStoredBool(key, val); }

/* ────────────────────────────────────────────────────────────────
 * 狀態存取
 * ──────────────────────────────────────────────────────────────── */
function isBought(id) { return readBool(`kij_bought_${id}`, false); }
function setBought(id, val) { writeBool(`kij_bought_${id}`, val); }

function isTried(id) { return readBool(`kij_tried_${id}`, false); }
function setTried(id, val) { writeBool(`kij_tried_${id}`, val); }

/* 購買數量已於 2026-08-13 移除：數量只餵給小計一個地方，而總金額試算更早就撤掉了，
   等於整條數量列在店裡沒有作用，卻吃掉窄卡片近三分之一的高度。
   現在每項只有「買了／沒買」兩種狀態。products.js 的 defaultQty 欄位保留但不再讀取。 */

function isSectionCollapsed(group) { return readBool(`kij_section_${group}_collapsed`, false); }
function setSectionCollapsed(group, val) { writeBool(`kij_section_${group}_collapsed`, val); }

/* ────────────────────────────────────────────────────────────────
 * 小工具
 * ──────────────────────────────────────────────────────────────── */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function makeFallback(letter) { return makeImageFallback(letter); }

/* 分類／群組色票 pill：shopping 群組用 6 種 category 對照 4 色，
 * dryer／shoes 群組沒有 category，改用「這個群組本身」對應最貼近的色票，
 * 讓吹風機（家電）落在 kij-cat-electronics、鞋款落在 kij-cat-shoe，維持一致規則。 */
function pillForProduct(product) {
  if (product.group === 'convenience' && product.storeBrand) {
    return { text: product.storeBrand, cls: 'kij-cat-food' };
  }
  if (product.group === 'shopping' && product.category) {
    return { text: product.category, cls: chipClassForCategory(product.category) };
  }
  if (product.group === 'dryer') {
    return { text: 'Panasonic', cls: 'kij-cat-electronics' };
  }
  if (product.group === 'powerbank') {
    return { text: 'CIO', cls: 'kij-cat-electronics' };
  }
  if (product.group === 'shoes') {
    return { text: SHOE_BRANDS[product.id] || '鞋款', cls: 'kij-cat-shoe' };
  }
  if (product.group === 'mouse') {
    return { text: MOUSE_BRANDS[product.id] || '滑鼠', cls: 'kij-cat-electronics' };
  }
  return null;
}

const PRICE_KIND_LABEL = {
  official: '官方定價',
  'retailer-reference': '通路參考價',
  'launch-reference': '上市參考價',
  'photo-reference': '照片標價',
  pending: '價格待確認',
};

const DRYER_SUMMARIES = {
  ne7n: 'W 礦物＋負離子・可折疊',
  ne5n: '負離子・可折疊',
};

/* 行動電源分頁：卡片上那一行「這款的定位是什麼」，
 * 三款規格接近時，光看容量與瓦數分不出該挑哪一個。 */
const POWERBANK_SUMMARIES = {
  'cio-smartcoby-pro-slim-ss-10k': '① 首選・最輕最便宜',
  'cio-smartcoby-slimii-wireless-2-2-pro-ss10k': '② 磁吸貼背・8K 的接班人',
  'cio-smartcoby-slimii-wireless-2-2-8k-special-edition': '③ 最薄最輕・但容量單價最高',
  'cio-smartcoby-pro-slim-cable': '④ 內建線・免帶線最省事',
  'cio-smartcoby-pro-cable-c': '⑤ 同為內建線・更厚更貴',
};

/* 比較表刻意加一列「每 1,000 mAh」：五款容量從 8,000 到 10,000 不等、
 * 價格從 ¥5,980 到 ¥8,980，光看標價分不出誰划算，換算成單價才看得出來。 */
const POWERBANK_COMPARISON_ROWS = {
  'cio-smartcoby-pro-slim-ss-10k': ['10,000 mAh', '35 W', '—', 'USB-C×2＋USB-A×1', '16 mm・187 g', '90 分', '¥6,280', '¥628', '現行', '只充手機的首選；要自己帶線'],
  'cio-smartcoby-slimii-wireless-2-2-pro-ss10k': ['10,000 mAh', '35 W', 'Qi2.2 25 W', 'USB-C×1', '17 mm・225 g', '140 分', '¥8,580', '¥858', '現行', '想貼在手機背後免拉線就選它'],
  'cio-smartcoby-slimii-wireless-2-2-8k-special-edition': ['8,000 mAh', '30 W', 'Qi2.2 25 W', 'USB-C×1', '12 mm・170 g', '—', '¥8,980', '¥1,123', '舊款', '最薄最輕，但容量最小、單價最高'],
  'cio-smartcoby-pro-slim-cable': ['10,000 mAh', '35 W', '—', 'USB-C×2＋內建線', '17.8 mm・189 g', '90 分', '¥5,980', '¥598', '舊款', '自帶 21 cm 可拆線，旅行少帶一條'],
  'cio-smartcoby-pro-cable-c': ['10,000 mAh', '35 W', '—', 'USB-C×2＋內建線', '26.3 mm・198 g', '—', '¥6,578', '¥658', '舊款', '同樣內建線但更厚更貴，出清才考慮'],
};

const SHOE_BRANDS = {
  cloudtilt: 'ON', cloudsurfermax: 'ON', cloudsurfer2: 'ON', cloud6: 'ON', cloudrunner3: 'ON',
  clifton11: 'HOKA', bondi9: 'HOKA', skyflow: 'HOKA', transport2: 'HOKA', gaviota5: 'HOKA', 'mach-remastered': 'HOKA',
};

const MOUSE_BRANDS = {
  'elecom-ex-g': 'ELECOM',
  'elecom-ex-g-pro': 'ELECOM',
  'sanwa-400-ma092': 'Sanwa Supply',
  'sanwa-ma-ergw19': 'Sanwa Supply',
  'sanwa-trackball-400-mawbttb190': 'Sanwa Supply',
  'logicool-ergo-m575-sp': 'Logicool',
  'logicool-mx-ergo-s': 'Logicool',
  'logicool-mx-anywhere-3s': 'Logicool',
  'logicool-pebble-mouse-2-m350s': 'Logicool',
  'buffalo-bsmbw318bk': 'Buffalo',
};

/* 滑鼠分頁卡片上的「這款的定位是什麼」，呼應鞋款／行動電源的一句話定位寫法。
 * 編號依 products.js 的排列分成三組：①～④ 人體工學造型、⑤～⑦ 軌跡球、⑧～⑩ 隨身輕便，
 * 組內由價格低到高。改動順序時這裡的編號要跟著改。 */
const MOUSE_SUMMARIES = {
  'elecom-ex-g': '① 人體工學入門・多尺寸可選',
  'elecom-ex-g-pro': '② 人體工學頂規・8 鍵、3 台切換、充電式',
  'sanwa-400-ma092': '③ 人體工學最便宜・小預算試手感',
  'sanwa-ma-ergw19': '④ 棒狀造型・手腕完全不用扭轉',
  'sanwa-trackball-400-mawbttb190': '⑤ 軌跡球入門・免移動手臂，適合窄桌面',
  'logicool-ergo-m575-sp': '⑥ 軌跡球中階・靜音、大廠手感',
  'logicool-mx-ergo-s': '⑦ 軌跡球旗艦・角度可調、可自訂巨集',
  'logicool-mx-anywhere-3s': '⑧ 高階隨身・玻璃桌面可用、多裝置切換',
  'logicool-pebble-mouse-2-m350s': '⑨ 超薄極輕・包包夾層塞得下',
  'buffalo-bsmbw318bk': '⑩ 最低價備用・堪用就好',
};

const DRYER_COMPARISON_ROWS = {
  ne7n: ['EH-NE7N', '1.6 m³/min', '3.3 m³/min（Panasonic 自家基準）', 'TURBO 90°C／CARE 65°C／COLD', 'W Mineral＋負離子、離子充電面板', '約 550 g・可折疊', 'AC 100 V・1200 W'],
  ne5n: ['EH-NE5N', '1.6 m³/min', '3.0 m³/min（Panasonic 自家基準）', 'TURBO 90°C／CARE／COLD', '外置負離子', '約 545 g・可折疊', 'AC 100 V・1200 W'],
};

const SHOE_COMPARISON_ROWS = {
  cloudtilt: ['On', '¥23,100', '城市步行、日常穿搭', '前掌空間與長時間步行穩定感'],
  cloudsurfermax: ['On', '¥23,100', '厚緩震跑步／長距離步行', '足弓、後跟鎖定與厚底穩定性'],
  cloudsurfer2: ['On', '¥20,900', '日常跑步與步行', '中底回彈、鞋面包覆與轉彎感'],
  cloud6: ['On', '¥19,800', '通勤、日常穿搭', '腳背高度與鞋帶包覆'],
  cloudrunner3: ['On', '¥18,700', '需要支撐的走跑', '內側支撐是否自然、標準與寬楦'],
  clifton11: ['HOKA', '¥19,800', '日常跑步與長時間步行', '鞋楦、後跟與中足支撐'],
  bondi9: ['HOKA', '¥24,200', '最大緩震、長時間站走', '厚底下轉彎時的穩定性'],
  skyflow: ['HOKA', '¥22,000', '平順步行／跑步', '前掌彎折、後跟固定'],
  transport2: ['HOKA', '¥22,000', '旅遊通勤、城市步行', '鞋底抓地與鞋面耐候需求'],
  gaviota5: ['HOKA', '¥27,500', '穩定支撐、足弓需求較高', '內側支撐不會頂腳'],
  'mach-remastered': ['HOKA', '¥17,600', '生活風格、日常穿搭', '尺碼、鞋面包覆與全黑配色實物'],
};

function tableHtml(headings, rows) {
  return `<div class="kij-compare-scroll"><table><thead><tr>${headings.map((heading) => `<th>${escapeHtml(heading)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value) => `<td>${escapeHtml(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function comparisonTableHtml(group, items) {
  if (group === 'powerbank') {
    const rowLabels = ['容量', '有線輸出', '無線', '連接埠', '厚度／重量', '本體充飽', '官方／通路參考價', '每 1,000 mAh', 'CIO 陣容', '這款的位置'];
    /* 五欄並排時欄寬只剩約 17%，完整品名會撐破欄位、與隔壁欄互相重疊，
       所以表頭再去掉共通的 SMARTCOBY 前綴，只留辨識得出來的型號部分。 */
    const columnTitle = (product) => product.name.replace('CIO ', '').replace(' 行動電源', '').replace('SMARTCOBY ', '');
    // 對照表缺列（POWERBANK_COMPARISON_ROWS 沒有這個商品 id）時跳過該款，
    // 不要整頁炸掉——scripts/validate-products.mjs 另有檢查攔截「忘了補列」。
    const columns = items
      .filter((product) => Array.isArray(POWERBANK_COMPARISON_ROWS[product.id]))
      .map((product) => [columnTitle(product), ...POWERBANK_COMPARISON_ROWS[product.id]]);
    const rows = rowLabels.map((label, index) => [label, ...columns.map((column) => column[index + 1])]);
    return `<section class="kij-compare kij-powerbank-compare" aria-label="行動電源完整比較表">
      <p class="kij-compare-note"><strong>選法（一個人、只充手機）：</strong>手機最多吃到 20–27 W，35 W 以上的輸出差異用不到，真正有差的只有容量、要不要帶線、以及價格。五款實際可充出的電量都在 5,000–6,200 mAh 之譜，iPhone 約 1–1.5 次。<br><strong>上機提醒（2026-04-24 起新規）：</strong>行動電源不可託運，必須放隨身行李且不可收進頭頂行李櫃；每人最多 2 個（160 Wh 以下，本頁五款都在 40 Wh 以內）；機內不可對行動電源充電，也不可用它充手機。</p>
      ${tableHtml(['項目', ...columns.map((column) => column[0])], rows)}
    </section>`;
  }
  if (group === 'dryer') {
    const [ne7n, ne5n] = items.map((product) => DRYER_COMPARISON_ROWS[product.id]);
    const rowLabels = ['JIS 風量', '髮絲受風量', '模式', '離子／礦物', '重量／收納', '電壓／功率'];
    const rows = rowLabels.map((label, index) => [label, ne7n[index + 1], ne5n[index + 1]]);
    return `<section class="kij-compare kij-dryer-compare" aria-label="吹風機完整比較表">
      <p class="kij-compare-note"><strong>電壓提醒：</strong>兩款皆為 AC 100 V，不可因插頭相同就視為可直插台灣 110 V。</p>
      ${tableHtml(['項目', ne7n[0], ne5n[0]], rows)}
    </section>`;
  }
  const onRows = items.filter((product) => SHOE_COMPARISON_ROWS[product.id]?.[0] === 'On').map((product) => [product.name, ...SHOE_COMPARISON_ROWS[product.id].slice(1)]);
  const hokaRows = items.filter((product) => SHOE_COMPARISON_ROWS[product.id]?.[0] === 'HOKA').map((product) => [product.name, ...SHOE_COMPARISON_ROWS[product.id].slice(1)]);
  const headings = ['鞋款', '日本參考價', '官方定位', '試穿時確認重點'];
  return `<section class="kij-compare kij-shoe-compare" aria-label="鞋款完整比較表">
    <p class="kij-compare-note">鞋楦、腳型與腳感因人而異；穿著旅行豆子同時試左右腳，走直線與轉彎各至少一分鐘。</p>
    <section class="kij-shoe-brand kij-shoe-brand-on" aria-label="ON 鞋款">
      <h3 class="kij-compare-title">ON <span>城市步行與輕量緩震</span></h3>${tableHtml(headings, onRows)}
    </section>
    <section class="kij-shoe-brand kij-shoe-brand-hoka" aria-label="HOKA 鞋款">
      <h3 class="kij-compare-title">HOKA <span>厚底緩震與穩定支撐</span></h3>${tableHtml(headings, hokaRows)}
    </section>
  </section>`;
}

/* 原本只有藥妝日用會顯示店家，但便利商店、吹風機與鞋款的 stores 資料一直都在，
   只是沒有被讀出來——站在博多站要找「哪一家 LAWSON／鞋店」時反而查不到。 */
function recommendedStores(product) {
  return (product.stores ?? [])
    .map((id) => (STORE_SUMMARIES[id] ? { id, ...STORE_SUMMARIES[id] } : null))
    .filter(Boolean);
}

/* 推薦店家：點下去跳到地圖並自動選中那家店，對應「到店前想確認這東西在哪買」的情境。
   用文字超連結而非標籤卡片——手機卡片右欄只有 172px，兩家店的膠囊標籤會各佔一整列。
   前面的小圖釘表示「這會開地圖」，與品名的 ↗（外部商品頁）區隔開。 */
function storeLinksHtml(product) {
  const stores = recommendedStores(product);
  if (stores.length === 0) return '';
  const links = stores
    .map((store) => `<a href="map.html?store=${encodeURIComponent(store.id)}">${escapeHtml(store.name)}</a>`)
    .join('');
  return `<div class="kij-store-links">${links}</div>`;
}

/* 候選店沒有指定分店 SKU／在庫證據，不可和主要店家混在一起顯示。
 * 一般卡片把候選店收進可展開的查證區；滑鼠與行動電源在原分區已有共用 banner，
 * 不在每張卡重複，但搜尋結果沒有 banner，必須把候選店補回卡片。 */
function candidateStoreLinksHtml(product, { includeSharedGroups = false } = {}) {
  if (!includeSharedGroups && (product.group === 'mouse' || product.group === 'powerbank')) return '';
  const confirmedIds = new Set(product.stores ?? []);
  const links = (product.storeCandidates ?? [])
    .filter((id) => !confirmedIds.has(id))
    .map((id) => (STORE_SUMMARIES[id]
      ? `<a href="map.html?store=${encodeURIComponent(id)}">${escapeHtml(STORE_SUMMARIES[id].name)}</a>`
      : ''))
    .filter(Boolean)
    .join('');
  if (!links) return '';
  return `<div class="kij-candidate-stores"><strong>候選店（到店確認）</strong><div class="kij-store-links">${links}</div></div>`;
}

/* 行動電源五款的購買地點完全重疊，每張卡都印一次只是同樣的字重複五遍。
 * 改成在分區頂端寫一次；清單仍從商品資料推導，不寫死店名，
 * 之後任何一款改了 stores，這一行就會跟著變。 */
function powerbankStoreBannerHtml(items) {
  const confirmed = [...new Set(items.flatMap((product) => product.stores ?? []))];
  const fallback = [...new Set(items.flatMap((product) => product.storeCandidates ?? []))]
    .filter((id) => !confirmed.includes(id));
  const linkFor = (id) => (STORE_SUMMARIES[id]
    ? `<a href="map.html?store=${encodeURIComponent(id)}">${escapeHtml(STORE_SUMMARIES[id].name)}</a>`
    : '');
  const render = (ids) => ids.map(linkFor).filter(Boolean).join('');
  /* 判斷「有沒有東西可顯示」一定要看渲染後的連結字串，不能只看 id 陣列長度——
     id 若查不到對應店家（render 回傳空字串），陣列長度仍 > 0，
     會印出一個只有標籤、沒有內容的空「購買地點」列。 */
  const confirmedLinks = render(confirmed);
  const fallbackLinks = render(fallback);
  if (!confirmedLinks && !fallbackLinks) return '';
  /* 五款的店家目前完全相同，只有一列時不必叫「主要」——沒有第二列可對照。 */
  const confirmedLabel = fallbackLinks ? '主要購買地點' : '購買地點';
  const confirmedHtml = confirmedLinks
    ? `<div class="kij-store-banner-row"><span>${confirmedLabel}</span><div class="kij-store-links">${confirmedLinks}</div></div>`
    : '';
  /* 目前五款的 stores 皆留空、只有 storeCandidates，此時只會印出這一列，
     標籤改用「可詢問門市」——不是「找不到型號時的備案」（那個語氣預設還有一列「主要購買地點」可對照）。 */
  const fallbackLabel = confirmedLinks ? '找不到型號時的備案' : '可詢問門市';
  const fallbackHtml = fallbackLinks
    ? `<div class="kij-store-banner-row"><span>${fallbackLabel}</span><div class="kij-store-links">${fallbackLinks}</div></div>`
    : '';
  return `<section class="kij-store-banner" aria-label="行動電源購買地點">${confirmedHtml}${fallbackHtml}</section>`;
}

/* 滑鼠分頁頂端的研究說明：四款目前是依品牌口碑與官方規格整理出的建議，
 * 尚未實地走訪天神／博多店面核對現貨與售價，因此每張卡都只有 storeCandidates（可詢問門市），
 * 沒有 stores（實地確認鋪貨）。這裡統一寫一次提醒，卡片內不重複。 */
function mouseNoteHtml(items) {
  const candidateIds = [...new Set(items.flatMap((product) => product.storeCandidates ?? []))];
  const linkFor = (id) => (STORE_SUMMARIES[id]
    ? `<a href="map.html?store=${encodeURIComponent(id)}">${escapeHtml(STORE_SUMMARIES[id].name)}</a>`
    : '');
  const candidateHtml = candidateIds.map(linkFor).filter(Boolean).join('');
  return `<section class="kij-store-banner" aria-label="滑鼠品牌卡片說明">
    <p class="kij-compare-note">以下為依品牌口碑與官方規格整理的<strong>研究建議</strong>，尚未實地到店核對現貨與售價，圖片部分為品牌官方商品照、部分為文字版品牌卡（該款尚無實拍照片）；購買前請以店內標示與庫存為準。</p>
    ${candidateHtml ? `<div class="kij-store-banner-row"><span>可詢問門市</span><div class="kij-store-links">${candidateHtml}</div></div>` : ''}
  </section>`;
}

/* 勾選框樣式的狀態按鈕：方框由 CSS 畫，切換時只改 class，
   不重寫按鈕內容，避免把方框元素洗掉。 */
function purchaseToggleHtml(product) {
  const bought = isBought(product.id);
  return `<button type="button" class="kij-status-btn${bought ? ' on' : ''}" data-action="toggle-bought" aria-pressed="${bought}"><span class="kij-check" aria-hidden="true"></span>已購買</button>`;
}

/* 「已試穿」字面上只適合鞋款；滑鼠與行動電源是「幾選一」的參考清單，
 * 不會真的試穿，改用「已選定」較符合實際情境，但仍是同一套 kij_tried_ 狀態。 */
function triedToggleHtml(product) {
  const tried = isTried(product.id);
  const label = product.group === 'shoes' ? '已試穿' : '已選定';
  return `<button type="button" class="kij-status-btn${tried ? ' on' : ''}" data-action="toggle-tried" aria-pressed="${tried}"><span class="kij-check" aria-hidden="true"></span>${label}</button>`;
}

/* ────────────────────────────────────────────────────────────────
 * 搜尋與篩選
 * ──────────────────────────────────────────────────────────────── */

/* 「完成」在兩種 tracking 下是不同動作：要買的看買了沒，參考清單看試穿／選定了沒。
 * 「只看未完成」與分區計數都走這一支，避免兩邊各判斷一次而漂移。 */
function isDone(product) {
  return product.tracking === 'buy' ? isBought(product.id) : isTried(product.id);
}

/* 每項商品的可搜尋文字建一次索引：中文品名、日文名、型號、分類、分頁名稱，
 * 外加店家的顯示名稱——站在店裡最常問的其實是「松本清有什麼」。
 * 75 項 × 每次輸入都重掃字串很浪費，所以在載入時算好。 */
const SEARCH_TEXT = new Map(PRODUCTS.map((product) => {
  const storeNames = [...(product.stores || []), ...(product.storeCandidates || [])]
    .map((storeId) => STORE_SUMMARIES[storeId]?.name || '');
  return [product.id, [
    product.name,
    product.jaName,
    product.model,
    product.category,
    GROUP_META[product.group]?.label,
    ...storeNames,
  ].filter(Boolean).join(' ').toLowerCase()];
}));

function matchesSearch(product) {
  if (!searchQuery) return true;
  const haystack = SEARCH_TEXT.get(product.id) || '';
  /* 以空白拆成多個關鍵字並全部要命中（AND）：「松本清 精華」找得到
     「在松本清買得到的精華液」，而不是把整串當成一個詞比對。 */
  return searchQuery.split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}

function passesFilters(product) {
  if (unboughtOnly && isDone(product)) return false;
  return matchesSearch(product);
}

function visibleItems(group) {
  return (CATALOG.byGroup.get(group) || []).filter(passesFilters);
}

function searchResults() {
  return GROUPS.flatMap((group) => visibleItems(group));
}

/* ────────────────────────────────────────────────────────────────
 * 卡片渲染
 * ──────────────────────────────────────────────────────────────── */
/* showPill：藥妝日用分區的商品已經被分類小標題分好組了，卡片右上再重複一次
   同樣的分類膠囊只是把 172px 的右欄再切掉一截。分區外（搜尋結果）沒有小標題，
   分類膠囊就變回有用的資訊，所以由呼叫端決定。
   groupBadge：搜尋結果跨全部分頁，卡片要說明自己原本住在哪一頁。 */
function buildCardHtml(product, { showPill = true, groupBadge = false } = {}) {
  const pill = showPill ? pillForProduct(product) : null;
  const pillHtml = pill ? `<span class="kij-pill ${pill.cls}">${escapeHtml(pill.text)}</span>` : '';
  const badgeHtml = groupBadge
    ? `<span class="kij-group-badge">${escapeHtml(GROUP_META[product.group]?.label || product.group)}</span>`
    : '';
  /* 日文名與型號併成一行（用「・」分隔），省下窄卡片的一整列。
     吹風機的型號本身就是品名，不重複顯示。 */
  const subParts = [];
  /* 行動電源的 jaName 與中文品名幾乎逐字相同（「CIO SMARTCOBY Pro SLIM SS 行動電源」
     對「SMARTCOBY Pro SLIM SS」），印出來只是同一個名字說兩遍，故略過。
     型號保留：在日本家電量販要跟店員報的就是型號，而且 SS 與非 SS 版只差在型號。 */
  if (product.jaName && product.group !== 'powerbank') subParts.push(escapeHtml(product.jaName));
  if (product.model && product.group !== 'dryer') subParts.push(escapeHtml(product.model));
  const subCls = product.group === 'powerbank' ? 'ja kij-sub-muted' : 'ja';
  const jaHtml = subParts.length > 0 ? `<div class="${subCls}">${subParts.join('・')}</div>` : '';
  const modelHtml = '';
  const fullImage = product.image.replace('/thumb/', '/full/');
  const dryerSummaryHtml = product.group === 'dryer' ? `<div class="kij-dryer-summary">${escapeHtml(DRYER_SUMMARIES[product.id] || '')}</div>` : '';
  const powerbankSummaryHtml = product.group === 'powerbank' ? `<div class="kij-powerbank-summary">${escapeHtml(POWERBANK_SUMMARIES[product.id] || '')}</div>` : '';
  const mouseSummaryHtml = product.group === 'mouse' ? `<div class="kij-powerbank-summary">${escapeHtml(MOUSE_SUMMARIES[product.id] || '')}</div>` : '';

  let priceHtml = '';
  let controlsHtml = '';
  const priceKindText = PRICE_KIND_LABEL[product.priceKind] || '參考價';

  if (product.group === 'convenience') {
    /* 超商品項多是隨手拿的小東西，原本刻意不顯示價格；
       但站在冷藏櫃前還是會想知道大概多少錢，所以查得到價的就顯示，查不到的維持留白。 */
    priceHtml = product.yen != null
      ? `<div class="price-row"><span class="yen">¥${product.yen.toLocaleString()}</span><span class="kij-price-kind">${priceKindText}</span></div>`
      : '';
    priceHtml += storeLinksHtml(product);
    controlsHtml = purchaseToggleHtml(product);
  } else if (product.group === 'powerbank') {
    /* 行動電源單價高，台幣換算與價格佐證強度都要看得到；
       店家連結沿用藥妝日用那套，站在天神時才知道往哪家電量販走。 */
    const yenText = product.yen != null ? `¥${product.yen.toLocaleString()}` : '價格待確認';
    const twdText = product.twdRef != null ? `（約 NT$${product.twdRef.toLocaleString()}）` : '';
    // 店家改由分區頂端的 powerbankStoreBannerHtml 統一顯示，卡片內不重複。
    priceHtml = `<div class="price-row"><span class="yen">${yenText}</span><span class="twd">${twdText}</span><span class="kij-price-kind">${priceKindText}</span></div>`;
    // 行動電源是五選一的參考清單（tracking: 'try'），按鈕要跟著切換成「已選定」，
    // 否則畫面顯示「已購買」卻不計入購買進度，使用者會搞不清楚勾了到底算不算。
    controlsHtml = product.tracking === 'buy' ? purchaseToggleHtml(product) : triedToggleHtml(product);
  } else if (product.group === 'dryer') {
    const yenText = product.yen != null ? `¥${product.yen.toLocaleString()}` : '價格待確認';
    priceHtml = `<div class="price-row"><span class="yen">${yenText}</span><span class="kij-price-kind">通路參考價</span></div>`;
    priceHtml += storeLinksHtml(product);
    controlsHtml = purchaseToggleHtml(product);
  } else if (product.tracking === 'buy') {
    const yenText = product.yen != null ? `¥${product.yen.toLocaleString()}` : '價格待確認';
    const twdText = product.twdRef != null ? `<span class="kij-twd">（約 NT$${product.twdRef.toLocaleString()}）</span>` : '';
    /* 沒有價格時不要寫成「約 價格待確認」；有價格才加「約」。
       欄位標籤（參考價格／推薦店家）已拿掉——手機右欄只剩 172px，
       標籤欄要吃掉三分之一，而 ¥ 開頭就是價格、圖釘後面就是店家，看得出來。 */
    const priceText = product.yen != null ? `約 ${yenText} ${twdText}` : yenText;
    priceHtml = product.group === 'shopping'
      ? `<div class="kij-shopping-details">
          <div class="kij-price-line">${priceText}</div>
          ${storeLinksHtml(product)}
        </div>`
      : `<div class="price-row"><span class="yen">${yenText}</span><span class="twd">${product.twdRef != null ? `（約 NT$${product.twdRef.toLocaleString()}）` : ''}</span><span class="kij-price-kind">${priceKindText}</span></div>`;
    controlsHtml = purchaseToggleHtml(product);
  } else {
    const yenText = product.yen != null ? `¥${product.yen.toLocaleString()}` : '價格待確認';
    priceHtml = `
      <div class="price-row">
        <span class="yen">${yenText}</span>
        <span class="kij-price-kind">${priceKindText}</span>
      </div>${product.group === 'shoes' ? storeLinksHtml(product) : ''}`;
    controlsHtml = triedToggleHtml(product);
  }

  // 品名本身就是商品頁連結，不再另外放按鈕；沒有來源網址的品項維持純文字
  const nameHtml = product.priceSourceUrl
    ? `<h5><a class="kij-name-link" href="${escapeHtml(product.priceSourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(product.name)}<span class="kij-ext" aria-hidden="true">↗</span></a></h5>`
    : `<h5>${escapeHtml(product.name)}</h5>`;

  /* note 與 priceNote 目前都是「資料來源與查證狀態」的說明：PRICE_OVERRIDES 在
     2026-08-22 的商品刷新時，把原本的購買提醒（「建議帶 1 條」）覆寫成了
     「照片確認為 … 官方希望零售含稅價 ¥1,320。實體藥妝的售價與庫存未確認」這類查證紀錄。
     兩段攤開後在手機上常比價格區塊還高，站在貨架前是雜訊，因此收進同一個可展開區塊。
     不是刪掉——要查價格怎麼來的，點一下就看得到。 */
  const notes = [product.note, product.priceNote].filter(Boolean);
  const candidateStoreHtml = candidateStoreLinksHtml(product, { includeSharedGroups: groupBadge });
  const noteSummary = candidateStoreHtml ? '商品、價格與候選店家' : '商品與價格說明';
  const noteHtml = notes.length > 0 || candidateStoreHtml
    ? `<details class="kij-card-source"><summary>${noteSummary}</summary>${
        notes.map((text) => `<p class="kij-card-note">${escapeHtml(text)}</p>`).join('')
      }${candidateStoreHtml}</details>`
    : '';

  return `
    <div class="kij-card kij-card-${escapeHtml(product.group)}${product.tracking === 'buy' && isBought(product.id) ? ' is-bought' : ''}" id="${escapeHtml(product.id)}" data-id="${escapeHtml(product.id)}">
      <div class="thumb">
        <a class="kij-image-link" href="${escapeHtml(fullImage)}" target="_blank" rel="noopener noreferrer" aria-label="放大查看 ${escapeHtml(product.name)} 圖片"><img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" width="156" height="156" loading="lazy" decoding="async"></a>
      </div>
      <div class="kij-card-head">
        ${badgeHtml}${pillHtml}${badgeHtml || pillHtml ? '' : '<span></span>'}
        ${controlsHtml}
      </div>
      <div class="mid">
        ${nameHtml}
        ${jaHtml}
        ${modelHtml}
        ${dryerSummaryHtml}
        ${powerbankSummaryHtml}
        ${mouseSummaryHtml}
      </div>
      <div class="kij-card-detail">
        ${priceHtml}
        ${noteHtml}
      </div>
    </div>`;
}

/* 鞋款／滑鼠／行動電源都是「try」群組（試穿或選定，不是每項都要買），
 * 分區標題的計數文字統一由這支函式產生，鞋款維持「已試穿…雙」，
 * 其餘兩個群組用「已選定…項」，措辭跟卡片上的按鈕文字（triedToggleHtml）一致。 */
function triedCountText(group) {
  const items = CATALOG.byGroup.get(group) || [];
  const triedCount = items.filter((p) => isTried(p.id)).length;
  return group === 'shoes'
    ? `已試穿 ${triedCount} / ${items.length}`
    : `已選定 ${triedCount} / ${items.length} 項`;
}

/* 搜尋結果：跨全部分頁的扁平卡片清單，不分區、不帶比較表。
 * 比較表是「決定要買哪一款」的行前工具，跟「現在要找某一項」的搜尋不同情境。 */
function buildSearchResultsHtml(items) {
  return `
    <section class="kij-section" data-group="search">
      <div class="kij-section-body">
        ${items.map((product) => buildCardHtml(product, { showPill: false, groupBadge: true })).join('')}
      </div>
    </section>`;
}

function buildSectionHtml(group) {
  const meta = GROUP_META[group];
  const allItems = CATALOG.byGroup.get(group) || [];
  /* 「只看未完成」只藏卡片，不動比較表與店家橫幅——那些是整個分區的參考資料，
     跟「這一項買了沒」無關；買完最後一款吹風機時把比較表一起藏掉並不合理。 */
  const items = allItems.filter(passesFilters);
  const collapsed = isSectionCollapsed(group);
  let bodyInner;

  if (group === 'shopping') {
    // 分類清單只從實際出現在 PRODUCTS 裡的 category 動態推算，不寫死清單。
    const categories = [...new Set(items.map((p) => p.category))];
    bodyInner = categories.map((category) => {
      const catItems = items.filter((p) => p.category === category);
      const chipCls = chipClassForCategory(category);
      // 分類已寫在這個小標題上，卡片內不再重複同一顆膠囊。
      return `
        <div class="kij-subcat" data-category="${escapeHtml(category)}">
          <div class="kij-subcat-heading" style="padding:6px 4px;">
            <span class="kij-pill ${chipCls}">${escapeHtml(category)}</span>
            <span style="font-size:11px;color:var(--muted);margin-left:6px;">${catItems.length} 項</span>
          </div>
          ${catItems.map((product) => buildCardHtml(product, { showPill: false })).join('')}
        </div>`;
    }).join('');
  } else if (group === 'shoes') {
    bodyInner = ['ON', 'HOKA'].map((brand) => {
      const brandItems = items.filter((product) => SHOE_BRANDS[product.id] === brand);
      if (brandItems.length === 0) return '';
      return `<div class="kij-shoe-card-group kij-shoe-card-group-${brand.toLowerCase()}">
        <h3>${brand}</h3>
        <div class="kij-shoe-card-grid">${brandItems.map((product) => buildCardHtml(product)).join('')}</div>
      </div>`;
    }).join('');
  } else {
    bodyInner = items.map((product) => buildCardHtml(product)).join('');
  }

  if (group === 'dryer' || group === 'shoes' || group === 'powerbank') bodyInner = comparisonTableHtml(group, allItems) + bodyInner;
  if (group === 'powerbank') bodyInner = powerbankStoreBannerHtml(allItems) + bodyInner;
  if (group === 'mouse') bodyInner = mouseNoteHtml(allItems) + bodyInner;

  /* 開了「只看未完成」時，分區計數要講眼前看得到的數字（剩 N 項），
     不然標題寫「41 項」、底下卻只有 3 張卡片，會以為畫面壞了。 */
  const countText = unboughtOnly
    ? `剩 ${items.length} / ${allItems.length} 項`
    : (TRY_ONLY_GROUPS.has(group) ? triedCountText(group) : `${items.length} 項`);

  return `
    <section class="kij-section" data-group="${group}">
      <div class="kij-section-header" data-action="toggle-section" role="button" tabindex="0" aria-expanded="${!collapsed}">
        <b>${meta.icon} ${meta.label}</b>
        <span class="count">${countText}</span>
      </div>
      <div class="kij-section-body"${collapsed ? ' hidden' : ''}>
        ${bodyInner}
      </div>
    </section>`;
}

function attachImageFallbacks() {
  document.querySelectorAll('#kijSections .kij-card .thumb img').forEach((img) => {
    const card = img.closest('[data-id]');
    const product = PRODUCTS_BY_ID.get(card.dataset.id);
    img.addEventListener('error', () => {
      img.replaceWith(makeFallback(product.name[0]));
    }, { once: true });
  });
}

let lastSectionsKey = '';

function sectionRenderKey() {
  const items = searchQuery ? PRODUCTS : (CATALOG.byGroup.get(activeGroup) || []);
  return [
    searchQuery,
    unboughtOnly,
    activeGroup,
    isSectionCollapsed(activeGroup),
    ...items.map((product) => `${product.id}:${product.tracking === 'buy' ? isBought(product.id) : isTried(product.id)}`),
  ].join('|');
}

/* 結果行與空狀態：搜尋或篩選之後畫面上可能一張卡片都沒有，
   這時要寫清楚是「找不到」還是「都完成了」，而不是給一片空白。 */
function renderResultState(count) {
  const resultLine = document.getElementById('kijResultLine');
  const empty = document.getElementById('kijEmpty');

  if (searchQuery) {
    resultLine.hidden = false;
    resultLine.textContent = count > 0
      ? `「${searchQuery}」找到 ${count} 項${unboughtOnly ? '未完成商品' : '商品'}`
      : `「${searchQuery}」沒有符合的商品`;
  } else {
    resultLine.hidden = true;
    resultLine.textContent = '';
  }

  if (count > 0) {
    empty.hidden = true;
    return;
  }
  empty.hidden = false;
  if (searchQuery) {
    empty.textContent = '換個關鍵字試試：可以找中文品名、日文名、型號、分類或店家名。';
  } else if (unboughtOnly) {
    empty.textContent = `${GROUP_META[activeGroup].label}都完成了 🎉　關掉「只看未完成」可以回頭看已完成的品項。`;
  } else {
    empty.textContent = '這個分頁目前沒有商品。';
  }
}

/* 搜尋結果跨全部分頁，此時再讓某一顆分頁亮著「選中」，會讓人以為只搜了那一頁。 */
function syncTabsForSearch() {
  document.querySelectorAll('.kij-tab').forEach((tab) => {
    const active = !searchQuery && tab.dataset.group === activeGroup;
    tab.classList.toggle('active', active);
    if (active) tab.setAttribute('aria-current', 'true');
    else tab.removeAttribute('aria-current');
  });
}

function renderSections({ force = false } = {}) {
  syncTabsForSearch();
  const key = sectionRenderKey();
  if (!force && key === lastSectionsKey) return false;
  const container = document.getElementById('kijSections');
  const items = searchQuery ? searchResults() : visibleItems(activeGroup);
  /* 搜尋時整個分區結構（比較表、分類小標題、收合）都不適用，換成扁平結果清單。 */
  container.innerHTML = searchQuery
    ? (items.length > 0 ? buildSearchResultsHtml(items) : '')
    : buildSectionHtml(activeGroup);
  renderResultState(items.length);
  lastSectionsKey = key;
  attachImageFallbacks();
  return true;
}

/* ────────────────────────────────────────────────────────────────
 * 局部更新（狀態變動後只補該卡片／該區塊，不整頁重繪，避免打斷目前的頁籤篩選視圖）
 * ──────────────────────────────────────────────────────────────── */
function syncCardVisual(card, product) {
  if (product.tracking === 'buy') {
    const boughtBtn = card.querySelector('[data-action="toggle-bought"]');
    const bought = isBought(product.id);
    if (boughtBtn) {
      boughtBtn.classList.toggle('on', bought);
      boughtBtn.setAttribute('aria-pressed', String(bought));
    }
    // 整張卡片反映已購買狀態，讓使用者在店裡一眼掃出還沒買的品項
    card.classList.toggle('is-bought', bought);
  } else {
    const triedBtn = card.querySelector('[data-action="toggle-tried"]');
    const tried = isTried(product.id);
    triedBtn.classList.toggle('on', tried);
    triedBtn.setAttribute('aria-pressed', String(tried));
  }
}

/* 頁首只留一行狀態文字：使用者要的是「還剩幾項沒買」，不要進度條也不要金額試算。
   分母跟著目前分頁走——畫面上只顯示一個分類，卻寫全站的 45 項，
   站在藥妝店裡會對不上眼前的清單（實際只有 37 項）。
   後半保留全站進度，才知道整趟還剩多少沒買。
   鞋款是到店試穿、沒有「買了沒」，所以那一頁改講試穿雙數。 */
function updateProgressBar() {
  const groupItems = CATALOG.byGroup.get(activeGroup) || [];
  const allBuyItems = CATALOG.byTracking.buy;
  const allBoughtCount = allBuyItems.filter((p) => isBought(p.id)).length;

  let headText;
  if (activeGroup === 'shoes') {
    const triedCount = groupItems.filter((p) => isTried(p.id)).length;
    headText = `已試穿 ${triedCount} / ${groupItems.length} 雙`;
  } else if (TRY_ONLY_GROUPS.has(activeGroup)) {
    // 滑鼠／行動電源同為「選一／選幾個參考」，不是每項都要買，
    // 分母跟著 tracking='try' 走，否則會永遠卡在「已買 0 項」。
    const triedCount = groupItems.filter((p) => isTried(p.id)).length;
    headText = `${GROUP_META[activeGroup].label}　已選定 ${triedCount} / ${groupItems.length} 項`;
  } else {
    const boughtCount = groupItems.filter((p) => isBought(p.id)).length;
    headText = `${GROUP_META[activeGroup].label}　已買 ${boughtCount} / ${groupItems.length} 項`;
  }

  /* 搜尋時結果跨全部分頁、分頁也不再亮選中狀態，這時再講「藥妝日用 已買 1 / 41」
     等於在說一個畫面上不存在的範圍，只留全站進度。 */
  document.getElementById('kijStatusLine').textContent = searchQuery
    ? `全站已買 ${allBoughtCount} / ${allBuyItems.length} 項`
    : `${headText}　·　全站已買 ${allBoughtCount} / ${allBuyItems.length} 項`;
}

function updateTriedSectionCount(group) {
  if (!TRY_ONLY_GROUPS.has(group)) return;
  const header = document.querySelector(`.kij-section[data-group="${group}"] .kij-section-header .count`);
  if (header) header.textContent = triedCountText(group);
}

function syncKijState() {
  window.__kijState = {
    bought: Object.fromEntries(CATALOG.byTracking.buy.map((p) => [p.id, isBought(p.id)])),
    tried: Object.fromEntries(CATALOG.byTracking.try.map((p) => [p.id, isTried(p.id)])),
  };
}

/* ────────────────────────────────────────────────────────────────
 * 分類頁籤「跳轉＋聚焦」（brief 給定的確切邏輯）
 * ──────────────────────────────────────────────────────────────── */
function focusSection(group) {
  activeGroup = group;
  /* 點分頁＝「我要看這一類」，與「我要找某一項」是互斥的兩個動作。
     不清掉搜尋的話，點了分頁畫面卻還停在搜尋結果，會以為分頁壞了。 */
  if (searchQuery) clearSearch();
  // 分頁選中狀態一律由 syncTabsForSearch() 統一設定（renderSections 內會呼叫），
  // 不在這裡再寫一份，否則兩處判斷條件日後會漂移。
  syncTabsForSearch();
  // 6 顆分頁在手機寬度放不下一行，選中的那顆可能在可視範圍外（例如從網址錨點
  // 直接跳到「鞋款」），切換時把它捲進視野；block:'nearest' 避免多餘的垂直捲動。
  // inline 必須是 'center'：分頁列有 scroll-snap-type: x proximity，'nearest' 只會挪到
  // 剛好貼邊就被吸附點拉回去，中間那幾顆（滑鼠）實測只露出 31px。
  document.querySelector('.kij-tab.active')?.scrollIntoView({ inline: 'center', block: 'nearest' });
  renderSections();
  updateProgressBar(); // 分母跟著分頁走，切頁後必須重算
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* map.html 商品縮圖連到 index.html#<id> 時，載入應能展開該商品所屬分區並捲動聚焦；
 * 沿用 focusSection 的展開邏輯，但只展開單一分區、不影響其他分區的顯示／收合狀態。 */
function focusProductById(id) {
  const product = PRODUCTS_BY_ID.get(id);
  if (!product) return false;
  /* 從地圖點某項商品跳過來，但那項已完成、又開著「只看未完成」時，卡片根本不在畫面上，
     捲動會靜靜失敗。使用者明確指名了這一項，這時關掉篩選才是他要的。 */
  if (unboughtOnly && isDone(product)) applyUnboughtOnly(false);
  if (activeGroup !== product.group) focusSection(product.group);
  const card = document.getElementById(id);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }
  return false;
}

/* 讀取 map.html 帶過來的商品錨點，展開對應分區並定位。 */
function applyUrlParams() {
  if (location.hash.length > 1) {
    const id = decodeURIComponent(location.hash.slice(1));
    focusProductById(id);
  }
}

function toggleSectionCollapse(section) {
  if (!section) return;
  const body = section.querySelector('.kij-section-body');
  const header = section.querySelector('.kij-section-header');
  if (!body || !header) return;
  const collapsedNext = !body.hidden;
  body.hidden = collapsedNext;
  header.setAttribute('aria-expanded', String(!collapsedNext));
  setSectionCollapsed(section.dataset.group, collapsedNext);
}

function resetView() {
  focusSection('shopping');
}

/* ────────────────────────────────────────────────────────────────
 * 搜尋與篩選的介面接線
 * ──────────────────────────────────────────────────────────────── */
const searchInput = document.getElementById('kijSearch');
const searchClearBtn = document.getElementById('kijSearchClear');
const unboughtToggle = document.getElementById('kijUnboughtToggle');

function applySearch(raw) {
  searchQuery = raw.trim().toLowerCase();
  searchClearBtn.hidden = raw.length === 0;
  renderSections();
  updateProgressBar(); // 狀態列在搜尋中／不搜尋時講的範圍不同，兩邊切換都要重算
}

function clearSearch() {
  searchInput.value = '';
  applySearch('');
}

/* 輸入即篩選，但用 rAF 併掉同一幀內的連續輸入：75 張卡片全重繪，
   逐字元同步重排在手機上會卡住輸入法。 */
let searchFrame = 0;
searchInput.addEventListener('input', () => {
  const value = searchInput.value;
  cancelAnimationFrame(searchFrame);
  searchFrame = requestAnimationFrame(() => applySearch(value));
});

/* Esc 清空是搜尋框的通用預期；type="search" 的原生 Esc 只清值不觸發 input。 */
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchInput.value) {
    e.preventDefault();
    clearSearch();
  }
});

searchClearBtn.addEventListener('click', () => {
  clearSearch();
  searchInput.focus();
});

function applyUnboughtOnly(next) {
  unboughtOnly = next;
  writeBool('kij_unbought_only', next);
  unboughtToggle.setAttribute('aria-pressed', String(next));
  renderSections();
  updateProgressBar();
}

unboughtToggle.addEventListener('click', () => applyUnboughtOnly(!unboughtOnly));

/* ────────────────────────────────────────────────────────────────
 * 事件委派
 * ──────────────────────────────────────────────────────────────── */
const appEl = document.getElementById('app');

appEl.addEventListener('click', (e) => {
  const actionEl = e.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const card = actionEl.closest('.kij-card');
  const id = card?.dataset.id;
  const product = id ? PRODUCTS_BY_ID.get(id) : null;

  switch (action) {
    case 'tab': {
      e.preventDefault();
      document.querySelectorAll('.kij-tab').forEach((t) => t.classList.toggle('active', t === actionEl));
      focusSection(actionEl.dataset.group);
      break;
    }
    case 'toggle-section': {
      toggleSectionCollapse(actionEl.closest('.kij-section'));
      break;
    }
    case 'toggle-bought': {
      if (!product) return;
      setBought(id, !isBought(id));
      // 開著「只看未完成」時，勾完的品項就該從畫面消失——這正是那顆開關的意思。
      if (unboughtOnly) renderSections();
      else syncCardVisual(card, product);
      updateProgressBar();
      syncKijState();
      break;
    }
    case 'toggle-tried': {
      if (!product) return;
      setTried(id, !isTried(id));
      if (unboughtOnly) renderSections();
      else {
        syncCardVisual(card, product);
        updateTriedSectionCount(product.group);
      }
      updateProgressBar(); // 鞋款／滑鼠／行動電源頁的狀態文字講的是試穿或選定數，勾了要同步
      syncKijState();
      break;
    }
    case 'nav-list': {
      e.preventDefault();
      resetView();
      break;
    }
    default:
      break;
  }
});

appEl.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const header = e.target.closest('.kij-section-header');
  if (header) {
    e.preventDefault();
    toggleSectionCollapse(header.closest('.kij-section'));
  }
});

/* ────────────────────────────────────────────────────────────────
 * 初始化
 * ──────────────────────────────────────────────────────────────── */
document.getElementById('kijItemCount').textContent = `共 ${PRODUCTS.length} 項商品`;

/* 「只看未完成」是整趟旅程的檢視偏好，重開頁面要還在（搜尋字串則刻意不留）。 */
unboughtOnly = readBool('kij_unbought_only', false);
unboughtToggle.setAttribute('aria-pressed', String(unboughtOnly));

/* 捲動後收合頁首，把螢幕還給商品。用 rAF 節流，避免捲動時反覆觸發版面計算。 */
(() => {
  const headerEl = document.querySelector('.kij-header');
  let ticking = false;
  const sync = () => {
    headerEl.classList.toggle('is-compact', window.scrollY > 72);
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(sync);
  }, { passive: true });
  sync();
})();

/* 分頁在手機寬度放不下一行時可橫向捲動，右緣淡出提示「還可以往右滑」，
 * 只在真的捲得動時顯示——比照 map.html 的 filter-group／legend 做法。 */
(() => {
  const tabsEl = document.getElementById('kijTabs');
  if (!tabsEl) return;
  const sync = () => {
    tabsEl.classList.toggle('is-scrollable', tabsEl.scrollWidth - tabsEl.clientWidth - tabsEl.scrollLeft > 1);
  };
  window.addEventListener('resize', sync);
  tabsEl.addEventListener('scroll', sync, { passive: true });
  sync();
})();

renderSections();
updateProgressBar();
syncKijState();
applyUrlParams();
