import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function loadProducts() {
  const mod = await import(path.join(ROOT, 'assets/products.js'));
  return { products: mod.PRODUCTS, rate: mod.JPY_TWD_RATE };
}

function fail(errors) {
  console.error(`✗ 驗證失敗，共 ${errors.length} 項問題：`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const VALID_GROUP = new Set(['shopping', 'dryer', 'shoes', 'convenience']);
const VALID_TRACKING = new Set(['buy', 'try']);
const VALID_PRICE_KIND = new Set(['official', 'retailer-reference', 'launch-reference', 'photo-reference', 'pending']);

const { products, rate: JPY_TWD_RATE } = await loadProducts();
if (typeof JPY_TWD_RATE !== 'number' || !(JPY_TWD_RATE > 0)) {
  fail(['assets/products.js 必須匯出正數的 JPY_TWD_RATE']);
}
const errors = [];
const seenIds = new Set();
const mapHtml = readFileSync(path.join(ROOT, 'map.html'), 'utf8');
const indexHtml = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const mapStoreIds = new Set([...mapHtml.matchAll(/id:\s*'([^']+)'/g)].map((match) => match[1]));

if (!Array.isArray(products) || products.length === 0) {
  fail(['PRODUCTS 必須是非空陣列']);
}

for (const p of products) {
  const label = p.id || '(缺 id)';

  if (!p.id || typeof p.id !== 'string') errors.push(`${label}: id 缺漏或非字串`);
  if (seenIds.has(p.id)) errors.push(`${label}: id 重複`);
  seenIds.add(p.id);

  if (!VALID_GROUP.has(p.group)) errors.push(`${label}: group 不合法（${p.group}）`);
  if (!VALID_TRACKING.has(p.tracking)) errors.push(`${label}: tracking 不合法（${p.tracking}）`);

  if (typeof p.name !== 'string' || p.name.length === 0) errors.push(`${label}: name 缺漏`);

  if (p.jaName !== null && typeof p.jaName !== 'string') errors.push(`${label}: jaName 必須是 null 或字串`);
  if (p.model !== null && typeof p.model !== 'string') errors.push(`${label}: model 必須是 null 或字串`);

  if (p.yen !== null && typeof p.yen !== 'number') errors.push(`${label}: yen 必須是 null 或數字`);
  if (p.twdRef !== null && typeof p.twdRef !== 'number') errors.push(`${label}: twdRef 必須是 null 或數字`);
  if (!VALID_PRICE_KIND.has(p.priceKind)) errors.push(`${label}: priceKind 不合法（${p.priceKind}）`);
  if (p.priceSourceUrl !== null && (typeof p.priceSourceUrl !== 'string' || !/^https:\/\//.test(p.priceSourceUrl))) {
    errors.push(`${label}: priceSourceUrl 必須是 null 或 https URL`);
  }
  if (p.priceCheckedAt !== null && !/^\d{4}-\d{2}-\d{2}$/.test(p.priceCheckedAt)) {
    errors.push(`${label}: priceCheckedAt 必須是 null 或 YYYY-MM-DD`);
  }
  if (p.yen === null && p.priceKind !== 'pending') errors.push(`${label}: 未定價商品的 priceKind 必須是 pending`);
  if (p.yen !== null && p.priceKind === 'pending') errors.push(`${label}: 有日圓價格時不得標為 pending`);
  if (p.priceKind === 'pending' && (typeof p.priceNote !== 'string' || p.priceNote.trim().length === 0)) {
    errors.push(`${label}: pending 商品必須提供 priceNote 說明待確認原因`);
  }
  if (['official', 'retailer-reference', 'launch-reference'].includes(p.priceKind) && p.priceSourceUrl === null) {
    errors.push(`${label}: ${p.priceKind} 價格必須附 priceSourceUrl`);
  }
  if (p.priceKind === 'photo-reference' && p.priceSourceUrl !== null) {
    errors.push(`${label}: photo-reference 價格不得偽裝成外部商品頁`);
  }
  if (p.priceKind === 'photo-reference' && (typeof p.priceNote !== 'string' || p.priceNote.trim().length === 0)) {
    errors.push(`${label}: photo-reference 商品必須在 priceNote 記錄照片辨識依據`);
  }

  if (p.tracking === 'buy') {
    if (typeof p.defaultQty !== 'number' || p.defaultQty < 1) errors.push(`${label}: tracking=buy 時 defaultQty 必須 ≥ 1`);
  } else if (p.tracking === 'try') {
    if (p.defaultQty !== null) errors.push(`${label}: tracking=try 時 defaultQty 必須是 null`);
  }

  if (typeof p.image !== 'string' || p.image.length === 0) errors.push(`${label}: image 缺漏`);

  const thumbPath = path.join(ROOT, 'images/thumb', `${p.id}.webp`);
  if (!existsSync(thumbPath)) errors.push(`${label}: 找不到對應的 images/thumb/${p.id}.webp（先跑 npm run build:images）`);

  if (p.yen !== null) {
    if (typeof p.source !== 'string' || p.source.length === 0) {
      errors.push(`${label}: yen 非 null 時 source 不得為空`);
    } else if (!existsSync(path.join(ROOT, p.source))) {
      errors.push(`${label}: source 指向的檔案不存在（${p.source}）`);
    }
  }

  if (!Array.isArray(p.stores)) errors.push(`${label}: stores 必須是陣列（無資料填 []，不得省略欄位）`);
  for (const storeId of p.stores || []) {
    if (!mapStoreIds.has(storeId)) errors.push(`${label}: stores 指向地圖不存在的店家（${storeId}）`);
  }
  if (p.storeCandidates !== undefined && !Array.isArray(p.storeCandidates)) {
    errors.push(`${label}: storeCandidates 必須是陣列`);
  }
  for (const storeId of p.storeCandidates || []) {
    if (!mapStoreIds.has(storeId)) errors.push(`${label}: storeCandidates 指向地圖不存在的店家（${storeId}）`);
    if (p.stores.includes(storeId)) errors.push(`${label}: ${storeId} 不得同時列入 stores 與 storeCandidates`);
  }

  // 簡體字掃描（僅檢查中文欄位，粗略但足以攔截明顯誤植）
  const SIMPLIFIED_MARKERS = ['产', '业', '国', '这', '为', '来', '发', '经', '现', '会', '与', '实', '万', '价'];
  for (const field of ['name', 'note', 'priceNote']) {
    const val = p[field];
    if (typeof val === 'string' && SIMPLIFIED_MARKERS.some((ch) => val.includes(ch))) {
      errors.push(`${label}: ${field} 疑似含簡體字（"${val}"）`);
    }
  }
}

for (const forbiddenText of ['結算', '價格待確認原因']) {
  if (indexHtml.includes(forbiddenText)) errors.push(`index.html: 不得保留「${forbiddenText}」`);
  if (mapHtml.includes(forbiddenText)) errors.push(`map.html: 不得保留「${forbiddenText}」`);
}

/* ──────────────────────────────────────────────────────────────
 * 語意一致性檢查
 *
 * 先前多次出現的錯誤都不是格式問題，而是「同一筆資料的兩個欄位互相矛盾」：
 *   - HOKA 地址寫 B1F、mapsQuery 卻寫 1F
 *   - ne5n 的 note 說 BicCamera、priceSourceUrl 卻是 kakaku.com
 *   - morinaga 的 priceNote 說含稅 ¥194、yen 卻存未稅 180
 *   - ne7n／ne5n 各自用不同匯率手寫 twdRef
 * 這些格式驗證都抓不到，只能靠人工複查，因此在此補上規則。
 * ────────────────────────────────────────────────────────────── */

// 1. note／priceNote 點名的通路，必須與 priceSourceUrl 的網域相符。
const RETAILER_DOMAINS = {
  'BicCamera': 'biccamera.com',
  'ビックカメラ': 'biccamera.com',
  'LOHACO': 'lohaco.yahoo.co.jp',
  'Costco': 'costco.co.jp',
  'コストコ': 'costco.co.jp',
  'Yodobashi': 'yodobashi.com',
  'ヨドバシ': 'yodobashi.com',
  '價格.com': 'kakaku.com',
  '価格.com': 'kakaku.com',
};
for (const p of products) {
  if (!p.priceSourceUrl) continue;
  const host = new URL(p.priceSourceUrl).host;
  // 只看價格敘述欄位；note 可能為了說明鋪貨而提到其他通路名稱。
  const priceText = p.priceNote || '';
  for (const [label, domain] of Object.entries(RETAILER_DOMAINS)) {
    if (priceText.includes(label) && !host.includes(domain)) {
      errors.push(`${p.id}: priceNote 稱價格來自「${label}」，但 priceSourceUrl 網域是 ${host}`);
    }
  }
}

// 2. priceNote 若寫出含稅金額，必須等於 yen（全站一律存含稅價）。
for (const p of products) {
  const match = (p.priceNote || '').match(/含稅\s*¥?([\d,]+)/);
  if (!match) continue;
  const taxIncluded = Number(match[1].replace(/,/g, ''));
  if (p.yen !== taxIncluded) {
    errors.push(`${p.id}: priceNote 記載含稅 ¥${taxIncluded}，但 yen 是 ${p.yen}（yen 一律存含稅價）`);
  }
}

// 3. official／retailer-reference 的來源必須是單品頁，不得是首頁或站內搜尋頁。
for (const p of products) {
  if (!p.priceSourceUrl) continue;
  if (!['official', 'retailer-reference'].includes(p.priceKind)) continue;
  const url = new URL(p.priceSourceUrl);
  if (url.pathname === '/' || url.pathname === '') {
    errors.push(`${p.id}: ${p.priceKind} 的 priceSourceUrl 只指到網站首頁（${p.priceSourceUrl}），必須指向單品頁`);
  }
  if (/[?&]q=/.test(url.search) || /\/search(\/|$)/.test(url.pathname)) {
    errors.push(`${p.id}: ${p.priceKind} 的 priceSourceUrl 是站內搜尋頁（${p.priceSourceUrl}），必須指向單品頁`);
  }
}

// 4. twdRef 一律由單一匯率推導，不得出現各自為政的手寫值。
for (const p of products) {
  const expected = p.yen === null ? null : Math.round(p.yen * JPY_TWD_RATE);
  if (p.twdRef !== expected) {
    errors.push(`${p.id}: twdRef 應為 ${expected}（yen × ${JPY_TWD_RATE}），實際是 ${p.twdRef}`);
  }
}

/* ──────────────────────────────────────────────────────────────
 * 地圖店家檢查
 * ────────────────────────────────────────────────────────────── */

// 5. 地圖上的每家店都必須至少被一項商品指到，否則是畫了卻永遠用不到的標記。
const referencedStoreIds = new Set();
for (const p of products) {
  for (const id of [...(p.stores || []), ...(p.storeCandidates || [])]) referencedStoreIds.add(id);
}
for (const storeId of mapStoreIds) {
  if (!referencedStoreIds.has(storeId)) {
    errors.push(`map.html: 店家 ${storeId} 沒有任何商品連結（請連上商品或移除該店）`);
  }
}

// 6. 營業時間不得只寫「依公告」這類空泛字樣，樓層寫法也不得自我矛盾。
/* 只在店家層級（縮排 6 格）的 `{` 切開。
 * 不能用 /\n\s*\{/，那會連 officialSources 裡縮排 10 格的內層物件一起切，
 * 使 mapsQuery 被分到別的區塊，樓層一致性檢查就永遠比不到。 */
const storeBlocks = mapHtml.slice(mapHtml.indexOf('const STORES = [')).split(/\n {6}\{/).slice(1);
for (const block of storeBlocks) {
  const id = (block.match(/id:\s*'([a-z0-9-]+)'/) || [])[1];
  if (!id || !mapStoreIds.has(id)) continue;
  const hours = (block.match(/hours:\s*'([^']*)'/) || [])[1] || '';
  if (/^依.*公告$|^依商場營業時間$/.test(hours.trim())) {
    errors.push(`map.html: 店家 ${id} 的 hours 只寫「${hours}」，必須填具體時段`);
  }
  const address = (block.match(/address:\s*'([^']*)'/) || [])[1] || '';
  const mapsQuery = (block.match(/mapsQuery:\s*'([^']*)'/) || [])[1] || '';
  const floorOf = (text) => (text.match(/\b(B?\d+)F\b/) || [])[1];
  const addressFloor = floorOf(address);
  const queryFloor = floorOf(mapsQuery);
  if (addressFloor && queryFloor && addressFloor !== queryFloor) {
    errors.push(`map.html: 店家 ${id} 的 address 樓層（${addressFloor}F）與 mapsQuery（${queryFloor}F）不一致`);
  }
}

if (errors.length > 0) fail(errors);

console.log(`✓ 驗證通過：${products.length} 項商品，${seenIds.size} 個唯一 id`);
