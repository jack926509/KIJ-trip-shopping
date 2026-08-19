import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PRODUCTS } from '../assets/products.js';
import { STORE_SUMMARIES } from '../assets/stores.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const indexHtml = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const failures = [];

if (!/<button[^>]+data-action="toggle-bought"/.test(indexHtml)) {
  failures.push('可購買商品沒有輸出 data-action="toggle-bought" 按鈕');
}

if (indexHtml.includes("return '唐吉訶德／松本清／SUNDRUG';")) {
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
if (!/import \{ STORE_SUMMARIES \} from '\.\/assets\/stores\.js'/.test(indexHtml)) {
  failures.push('index.html 沒有從 assets/stores.js 匯入 STORE_SUMMARIES');
}

if (failures.length > 0) {
  console.error(`✗ 清單互動與店家顯示契約失敗：\n${failures.map((failure) => `  - ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('✓ 清單互動與店家顯示契約通過');
