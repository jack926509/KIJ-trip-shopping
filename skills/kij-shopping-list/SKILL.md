---
name: kij-shopping-list
description: 新增或更新北九州購物清單商品。當使用者說「新增購物清單商品」、「把這個商品加到北九州清單」、「便利商店新增這個」或提供商品名稱、日本商品網址、商品照片時必須使用。負責研究日本價格、官方商品資料、圖片、分類與可證實的店鋪關聯，安全寫入 KIJ-trip-shopping 網站並完成資料與瀏覽器驗證。
---

# 北九州購物清單商品管理

## 目標

讓使用者只需提供商品名稱或網址，即可把資料完整且可追溯地加入網站。網站的唯一資料來源是 `assets/products.js`；不要建立第二份商品清單。

## 工作流程

1. 先讀 `assets/products.js`、`scripts/validate-products.mjs`、`references/source-policy.md` 與 `templates/product-record.js`。
2. 確認商品的日本名稱、規格、包裝數與型號。名稱或型號不清楚時先問使用者，不能用相似商品代替。
3. 研究價格：官方日本網站優先；官方未公開可讀價格時，使用可信日本通路並標記 `retailer-reference`；已停產舊款只能使用可追溯的上市價格並標記 `launch-reference`。只有使用者提供的原始照片清楚拍到商品與價格標籤時，才可使用 `photo-reference`。
4. 找到可合理使用的商品圖片，新增 `images/full/<id>.<ext>`，再執行 `npm run build:images` 產生縮圖。圖片來源與限制寫入本次來源紀錄。
5. 以英文小寫連字號建立不可變更的 `id`。只在 `BASE_PRODUCTS` 最後追加資料；不要重排、改名或刪除現有商品 id。
6. 填入完整資料。`priceKind`、`priceSourceUrl`、`priceCheckedAt` 必須和價格一起提供；沒有可靠價格時，使用 `yen: null`、`priceKind: 'pending'` 與非空白的 `priceNote`，在 `priceNote` 清楚寫明待確認原因。
7. `stores` 只有在品牌或店家官方資料可以證實時才加入。沒有可靠證據必須為空陣列，不能以距離、搜尋結果或推測填入。
8. 新增或更新 `docs/product-price-sources-YYYY-MM-DD.md`，列出商品、價格、價格種類、直接來源網址與查證日期。
9. 執行 `npm run validate:data`。啟動本機網站，以桌面 1280 px 和手機 390 px 檢查商品可見、價格種類正確、圖片可載入、清單沒有水平溢出；若新增 `stores`，也檢查 `map.html` 的商品連結。
10. 報告新增了什麼、使用何種價格、哪些資訊仍待確認，以及驗證結果。

## 商品欄位

請使用 `templates/product-record.js`。`group` 只能是 `shopping`、`convenience`、`dryer`、`shoes`。藥妝、日用品與一般伴手禮使用 `shopping`；Lawson、7-ELEVEN、FamilyMart 等便利商店食品與飲品使用 `convenience`；吹風機使用 `dryer`；鞋款使用 `shoes`。一般採買商品的 `tracking` 是 `buy`，鞋款試穿用 `try`。`tracking: 'buy'` 必須有正整數 `defaultQty`；`tracking: 'try'` 的 `defaultQty` 必須是 `null`。

便利商店商品的 `category` 使用網站既有分類，例如 `冰品`、`麵包甜點`、`飲品`、`即食湯品`；新分類只有在確有必要且頁面色票對照已一併補齊時才新增。

價格種類：

- `official`：日本官方定價。
- `retailer-reference`：可信日本通路的參考價，可能與門市不同。
- `launch-reference`：已停產或舊款的上市參考價。
- `photo-reference`：使用者提供的原始照片可同時辨識商品與標價；`priceSourceUrl` 必須是 `null`，並在 `priceNote` 註明照片中的型號或包裝資訊。這不是官方定價。
- `pending`：尚無可靠價格，`yen` 必須是 `null`，且 `priceNote` 必填、說明無法確認的具體原因；有可靠價格時 `priceNote` 為 `null`。

## 禁止事項

- 不使用「官方目前無定價，現場請直接詢問門市」作為商品價格說明。
- 不擅自刪除舊商品、圖片、來源紀錄或 localStorage 資料。
- 不以台灣價格、跨境代購價或未驗證社群貼文當作日本售價。
- 不把無法證實的店家寫入地圖關聯。
