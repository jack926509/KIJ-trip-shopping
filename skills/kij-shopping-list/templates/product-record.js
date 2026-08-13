{
  // 英文小寫連字號，格式 品牌-商品名。寫入後不可更改——
  // 使用者的已購買狀態以此為 localStorage key，改了等於清空他勾好的紀錄。
  id: 'brand-product-name',
  group: 'shopping',        // shopping | convenience | dryer | shoes
  tracking: 'buy',          // shoes 用 'try'，其餘用 'buy'
  category: '日用品',
  // 中文品名。手機右欄只有 172px：17 字以內一行、25 字以上會佔三行。
  // 盡量壓在 20 字以內，冗長型號往 model 放。
  name: '中文商品名',
  jaName: '日本商品名',
  // jaName 與 model 會併成同一行（用「・」分隔），不要重複 jaName 已有的內容。
  model: null,
  yen: 0,                   // 一律填含稅價
  twdRef: null,             // 固定 null：台幣由 JPY_TWD_RATE 自動換算，手寫值會被驗證器擋下
  // 遺留欄位，介面已無數量控制、程式不再讀取。buy 填 1、try 填 null，不用研究買幾個。
  defaultQty: 1,
  // 固定寫 thumb 路徑。實體檔案由 npm run build:images 產生，不要手工轉檔：
  // 原圖放 images/source/<id>.<副檔名> → 在 images/build-manifest.json 加一行 → 跑腳本
  image: 'images/thumb/brand-product-name.webp',
  note: '商品用途、包裝與必要的價格說明。',
  source: 'docs/product-price-sources-YYYY-MM-DD.md',
  priceKind: 'official',    // official | retailer-reference | launch-reference | photo-reference | pending
  // 必須是單品頁；首頁與站內搜尋頁會被驗證器擋下。priceKind 為 photo-reference 時填 null。
  priceSourceUrl: 'https://example.jp/product',
  priceCheckedAt: 'YYYY-MM-DD',
  // 有可靠價格時填 null。若在此寫出「含稅 ¥N」，N 必須等於 yen；
  // 提到通路名稱時須與上方網域相符。priceKind 為 pending 時必填。
  priceNote: null,
  // 每個 id 必須同時存在於 map.html 的 STORES 與 index.html 的 STORE_SUMMARIES，
  // 少了後者連結會靜靜消失（npm test 會擋）。無法證實就留空陣列。
  stores: []
}
