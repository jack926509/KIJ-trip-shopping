/* 清單頁挑選邏輯的行為測試。
 *
 * 這支是專案裡第一份「真的執行清單頁邏輯」的測試。
 * test-list-ui.mjs 檢查的是契約與不變條件（HTML 與資料相符、版號一致、
 * 不得重建副本），那些只能對原始碼比對；但「搜尋『松本清』會不會找到東西」
 * 這種問題必須真的跑一遍才知道，而它先前完全沒有被測到——
 * index-app.js 的挑選邏輯保留字面卻改壞行為，是不會有任何測試變紅的。
 */
import assert from 'node:assert/strict';
import { PRODUCTS } from '../assets/products.js';
import { STORE_SUMMARIES } from '../assets/stores.js';
import { createCatalogIndex } from '../assets/catalog-index.js';
import { GROUPS, GROUP_META, TRY_ONLY_GROUPS } from '../assets/groups.js';
import { createListModel, matchesQuery } from '../assets/list-model.js';

const model = createListModel({
  products: PRODUCTS,
  storeSummaries: STORE_SUMMARIES,
  groupMeta: GROUP_META,
  groups: GROUPS,
  catalog: createCatalogIndex(PRODUCTS),
});

const none = () => false;
const search = (query, extra = {}) => model.searchResults({ query, isDone: none, ...extra });

/* ── 關鍵字比對本身 ───────────────────────────────────────────── */
assert.equal(matchesQuery('松本清 精華液', ''), true, '空關鍵字應全部通過');
assert.equal(matchesQuery('松本清 精華液', '松本清'), true);
assert.equal(matchesQuery('松本清 精華液', '松本清 精華'), true, '多關鍵字是 AND，順序不拘');
assert.equal(matchesQuery('松本清 精華液', '松本清 吹風機'), false, '任一關鍵字沒命中就不算命中');
assert.equal(matchesQuery('松本清 精華液', '   松本清   '), true, '前後空白不應影響比對');

/* ── 搜尋涵蓋範圍 ─────────────────────────────────────────────── */
/* 站在店裡最常見的問法是「這家店我還要買什麼」，而店名不在商品欄位裡。
   漏掉店家名時搜尋仍然「有反應」，只是永遠找不到店——沒有錯誤訊息可看。 */
const byStore = search('松本清');
assert.ok(byStore.length > 0, '應能用店家名搜尋到商品');
assert.ok(
  byStore.every((product) => [...(product.stores || []), ...(product.storeCandidates || [])]
    .some((storeId) => STORE_SUMMARIES[storeId]?.name.includes('松本清'))),
  '以店名搜尋的結果必須真的關聯到該店家'
);

const withJapanese = PRODUCTS.find((product) => product.jaName);
assert.ok(search(withJapanese.jaName.toLowerCase()).some((p) => p.id === withJapanese.id), '日文名應可搜尋');

const withModel = PRODUCTS.find((product) => product.model);
assert.ok(search(withModel.model.toLowerCase()).some((p) => p.id === withModel.id), '型號應可搜尋');

assert.deepEqual(search('zzzz-不存在的關鍵字'), [], '查無結果時應回空陣列而非全部商品');
assert.equal(search('').length, PRODUCTS.length, '空關鍵字應涵蓋全部商品');

/* 搜尋結果跨全部分頁，且順序必須與分頁列一致，
   否則「藥妝日用」的命中會夾在鞋款中間，看起來像亂序。 */
const orderProbe = search('');
const groupOrder = orderProbe.map((product) => GROUPS.indexOf(product.group));
assert.deepEqual(groupOrder, [...groupOrder].sort((a, b) => a - b), '搜尋結果必須依分頁順序排列');

/* ── 只看未完成 ───────────────────────────────────────────────── */
const target = PRODUCTS.find((product) => product.tracking === 'buy');
const doneOne = (product) => product.id === target.id;

assert.equal(
  model.visibleItems(target.group, { unboughtOnly: false, isDone: doneOne }).length,
  model.itemsIn(target.group).length,
  '關閉篩選時不得少掉任何商品'
);
assert.equal(
  model.visibleItems(target.group, { unboughtOnly: true, isDone: doneOne }).length,
  model.itemsIn(target.group).length - 1,
  '開啟篩選後已完成的那一項必須被藏起來'
);
assert.ok(
  !model.visibleItems(target.group, { unboughtOnly: true, isDone: doneOne }).some((p) => p.id === target.id),
  '被藏起來的必須正是已完成的那一項'
);

/* 搜尋與「只看未完成」疊加時要同時生效，不能其中一個蓋掉另一個。 */
const both = search('松本清', { unboughtOnly: true, isDone: doneOne });
assert.ok(both.length <= byStore.length, '疊加篩選後結果不應變多');
assert.ok(!both.some((p) => p.id === target.id), '疊加時已完成商品仍須被排除');

/* ── 進度計數 ─────────────────────────────────────────────────── */
/* 鞋款、滑鼠、行動電源是「試穿／選定」而非每項都要買，
   把它們算進「已買 N 項」會讓分母永遠達不到。 */
const progress = model.boughtProgress(none);
assert.equal(progress.done, 0, '沒有任何完成時已買數應為 0');
assert.equal(
  progress.total,
  PRODUCTS.filter((product) => product.tracking === 'buy').length,
  '全站購買分母只能算 tracking=buy 的品項'
);
assert.ok(
  !TRY_ONLY_GROUPS.has('shopping') && progress.total > 0,
  '藥妝日用必須計入購買進度'
);
for (const group of TRY_ONLY_GROUPS) {
  assert.ok(
    model.itemsIn(group).every((product) => product.tracking === 'try'),
    `${group} 內的商品都應是 try，否則進度列的分母會算錯`
  );
}
assert.equal(model.boughtProgress(() => true).done, progress.total, '全部完成時已買數應等於分母');

const shoes = model.triedProgress('shoes', (product) => product.id === model.itemsIn('shoes')[0].id);
assert.equal(shoes.done, 1);
assert.equal(shoes.total, model.itemsIn('shoes').length);

console.log('✓ 清單挑選邏輯行為測試通過');
