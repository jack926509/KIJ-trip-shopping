/* 商品資料在頁面載入時建立一次索引；畫面互動只查 Map，不重掃完整 PRODUCTS。 */
export function createCatalogIndex(products) {
  const byId = new Map();
  const byGroup = new Map();
  const byTracking = { buy: [], try: [] };
  const confirmedByStore = new Map();
  const candidateByStore = new Map();

  const addTo = (index, key, product) => {
    if (!index.has(key)) index.set(key, []);
    index.get(key).push(product);
  };

  products.forEach((product) => {
    byId.set(product.id, product);
    addTo(byGroup, product.group, product);
    if (byTracking[product.tracking]) byTracking[product.tracking].push(product);
    (product.stores || []).forEach((storeId) => addTo(confirmedByStore, storeId, product));
    (product.storeCandidates || []).forEach((storeId) => addTo(candidateByStore, storeId, product));
  });

  const empty = [];
  return {
    byId,
    byGroup,
    byTracking,
    confirmedByStore,
    candidateByStore,
    productsForStore(storeId, relation = 'confirmed') {
      if (relation === 'candidate') return candidateByStore.get(storeId) || empty;
      if (relation === 'all') {
        const confirmed = confirmedByStore.get(storeId) || empty;
        const candidates = candidateByStore.get(storeId) || empty;
        return candidates.length === 0 ? confirmed : [...confirmed, ...candidates];
      }
      return confirmedByStore.get(storeId) || empty;
    },
  };
}
