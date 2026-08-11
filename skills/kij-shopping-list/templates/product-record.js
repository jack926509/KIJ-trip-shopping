{
  id: 'brand-product-name',
  group: 'shopping',
  tracking: 'buy',
  category: '日用品',
  name: '中文商品名',
  jaName: '日本商品名',
  model: null,
  yen: 0,              // 一律填含稅價
  twdRef: null,        // 固定 null：台幣由 JPY_TWD_RATE 自動換算，手寫值會被驗證器擋下
  defaultQty: 1,
  image: 'images/thumb/brand-product-name.webp',
  note: '商品用途、包裝與必要的價格說明。',
  source: 'docs/product-price-sources-YYYY-MM-DD.md',
  priceKind: 'official',
  // 必須是單品頁；首頁與站內搜尋頁會被驗證器擋下。
  priceSourceUrl: 'https://example.jp/product',
  priceCheckedAt: 'YYYY-MM-DD',
  // 若在此寫出「含稅 ¥N」，N 必須等於 yen；提到通路名稱時須與上方網域相符。
  priceNote: null,
  stores: []
}
