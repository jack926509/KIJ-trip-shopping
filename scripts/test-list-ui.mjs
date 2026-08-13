import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PRODUCTS } from '../assets/products.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexHtml = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const failures = [];

if (!/<button[^>]+data-action="toggle-bought"/.test(indexHtml)) {
  failures.push('可購買商品沒有輸出 data-action="toggle-bought" 按鈕');
}

if (indexHtml.includes("return '唐吉訶德／松本清／SUNDRUG';")) {
  failures.push('推薦店家仍以品類寫死，會把未確認店家誤標為可購買');
}

const summaryBlock = indexHtml.match(/const STORE_SUMMARIES = \{([\s\S]*?)\n\};/);
if (!summaryBlock) {
  failures.push('找不到 STORE_SUMMARIES');
} else {
  /* 涵蓋所有分類，不能只查 shopping。
     只查 shopping 時，便利商店與吹風機的商品即使寫了 stores，
     少了顯示名稱就整條連結不會渲染，畫面上完全看不出漏掉——
     實際發生過：7 項商品的店家連結靜靜消失了一段時間。 */
  const summaryIds = new Set([...summaryBlock[1].matchAll(/'([^']+)'\s*:/g)].map((match) => match[1]));
  const missing = [...new Set(PRODUCTS.flatMap((product) => product.stores ?? []))]
    .filter((storeId) => !summaryIds.has(storeId));
  if (missing.length > 0) failures.push(`已確認推薦店家缺少顯示名稱：${missing.join('、')}`);
}

if (failures.length > 0) {
  console.error(`✗ 清單互動與店家顯示契約失敗：\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('✓ 清單互動與店家顯示契約通過');
