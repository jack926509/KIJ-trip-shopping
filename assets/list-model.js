/* 清單頁的挑選邏輯：搜尋比對、未完成篩選、進度計數。
 *
 * 這些先前寫在 scripts/index-app.js 裡，與 DOM 操作纏在一起，
 * 結果是 959 行的檔案完全沒有可執行的測試——測試只能對原始碼跑正則，
 * 既擋不住「保留字面卻改壞行為」的改動，也會被無害的重構誤判成紅燈。
 *
 * 抽出來的都是純函式：輸入商品資料與當下的篩選狀態，輸出要顯示哪些商品。
 * 沒有 DOM、沒有 localStorage，因此可以在 node 裡直接跑真的斷言。
 * 「已買／已試穿」由呼叫端以 isDone 傳入，模型本身不碰儲存。 */

/* 每項商品攤平成一條可搜尋字串，建立一次後重複使用。
 * 店家名稱一併收進來，因為在店裡最常見的問法是「這家店我還要買什麼」。 */
export function buildSearchText({ products, storeSummaries, groupMeta }) {
  return new Map(products.map((product) => {
    const storeNames = [...(product.stores || []), ...(product.storeCandidates || [])]
      .map((storeId) => storeSummaries[storeId]?.name || '');
    return [product.id, [
      product.name,
      product.jaName,
      product.model,
      product.category,
      groupMeta[product.group]?.label,
      ...storeNames,
    ].filter(Boolean).join(' ').toLowerCase()];
  }));
}

/* 以空白拆成多個關鍵字並全部要命中（AND）：「松本清 精華」找得到
   「在松本清買得到的精華液」，而不是把整串當成一個詞比對。 */
export function matchesQuery(haystack, query) {
  if (!query) return true;
  return query.split(/\s+/).filter(Boolean).every((term) => haystack.includes(term));
}

export function createListModel({ products, storeSummaries, groupMeta, groups, catalog }) {
  const searchText = buildSearchText({ products, storeSummaries, groupMeta });

  const matchesSearch = (product, query) => matchesQuery(searchText.get(product.id) || '', query);

  const passesFilters = (product, { query = '', unboughtOnly = false, isDone = () => false } = {}) => {
    if (unboughtOnly && isDone(product)) return false;
    return matchesSearch(product, query);
  };

  const itemsIn = (group) => catalog.byGroup.get(group) || [];

  const visibleItems = (group, state) => itemsIn(group).filter((product) => passesFilters(product, state));

  /* 搜尋結果跨全部分頁，並依 groups 的順序攤平，
     讓「藥妝日用」的命中永遠排在「鞋款」前面，順序與分頁列一致。 */
  const searchResults = (state) => groups.flatMap((group) => visibleItems(group, state));

  /* 全站購買進度只算 tracking === 'buy' 的品項：
     鞋款與滑鼠是「試穿／選定」，把它們算進「已買 N 項」會讓分母永遠達不到。 */
  const buyItems = () => products.filter((product) => product.tracking === 'buy');

  return {
    searchText,
    matchesSearch,
    passesFilters,
    itemsIn,
    visibleItems,
    searchResults,
    buyItems,
    boughtProgress(isDone) {
      const items = buyItems();
      return { done: items.filter(isDone).length, total: items.length };
    },
    triedProgress(group, isDone) {
      const items = itemsIn(group);
      return { done: items.filter(isDone).length, total: items.length };
    },
  };
}
