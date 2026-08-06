import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function loadProducts() {
  const mod = await import(path.join(ROOT, 'assets/products.js'));
  return mod.PRODUCTS;
}

function fail(errors) {
  console.error(`✗ 驗證失敗，共 ${errors.length} 項問題：`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const VALID_GROUP = new Set(['shopping', 'dryer', 'shoes']);
const VALID_TRACKING = new Set(['buy', 'try']);

const products = await loadProducts();
const errors = [];
const seenIds = new Set();

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

  if (p.tracking === 'buy') {
    if (typeof p.defaultQty !== 'number' || p.defaultQty < 1) errors.push(`${label}: tracking=buy 時 defaultQty 必須 ≥ 1`);
  } else if (p.tracking === 'try') {
    if (p.defaultQty !== null) errors.push(`${label}: tracking=try 時 defaultQty 必須是 null`);
  }

  if (typeof p.image !== 'string' || p.image.length === 0) errors.push(`${label}: image 缺漏`);

  if (p.yen !== null) {
    if (typeof p.source !== 'string' || p.source.length === 0) {
      errors.push(`${label}: yen 非 null 時 source 不得為空`);
    } else if (!existsSync(path.join(ROOT, p.source))) {
      errors.push(`${label}: source 指向的檔案不存在（${p.source}）`);
    }
  }

  if (!Array.isArray(p.stores)) errors.push(`${label}: stores 必須是陣列（無資料填 []，不得省略欄位）`);

  // 簡體字掃描（僅檢查中文欄位，粗略但足以攔截明顯誤植）
  const SIMPLIFIED_MARKERS = ['产', '业', '国', '这', '为', '来', '发', '经', '现', '会', '与', '实', '万', '价'];
  for (const field of ['name', 'note']) {
    const val = p[field];
    if (typeof val === 'string' && SIMPLIFIED_MARKERS.some((ch) => val.includes(ch))) {
      errors.push(`${label}: ${field} 疑似含簡體字（"${val}"）`);
    }
  }
}

if (errors.length > 0) fail(errors);

console.log(`✓ 驗證通過：${products.length} 項商品，${seenIds.size} 個唯一 id`);
