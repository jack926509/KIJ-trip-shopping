# 天神 UNIQLO／mont-bell 店家查證報告（2026-08-18）

查證範圍：福岡市中央区天神
背景：這次執行環境的網路政策擋掉了品牌官網、地圖服務、電商網域的直接連線
（`uniqlo.com`、`map.uniqlo.com`、`montbell.jp`、`store.montbell.jp`、`amazon.co.jp`、
`rakuten.co.jp` 等皆回應 403），只能透過搜尋引擎摘要取得資訊，**無法開啟官網頁面
逐一核對，也無法下載商品圖片**。以下欄位標註可信度，供之後補查。

---

## 1. UNIQLO 天神店

| 欄位 | 內容 | 可信度 |
|---|---|---|
| 店名 | UNIQLO 天神店 | 高（多來源一致） |
| 地址 | 福岡県福岡市中央区天神4-3-8 ミーナ天神 1F・2F | 高（與既有店家 `3coins-plus-mina-tenjin` 同棟地址一致） |
| 營業時間 | 10:00–20:00（平日、六日假日皆同） | 中（未能開官網核對，僅搜尋摘要） |
| 座標 | 33.592609, 130.398712 | 中（沿用同棟既有店家 `3coins-plus-mina-tenjin` 的座標，非另外實測） |
| 電話 | 050-3096-6132 | 低（未核對，未寫入資料） |

來源（搜尋引擎摘要，未能實際開啟頁面核對）：
- UNIQLO 官方店舗檢索頁 https://map.uniqlo.com/jp/ja/detail/10101803
- ミーナ天神官方店舗頁 https://www.mina-tenjin.com/shop/detail.php?shopId=074
- UNIQLO 特輯頁（九州最大賣場面積開幕報導）https://www.uniqlo.com/jp/ja/special-feature/store/tenjin

## 2. mont-bell 福岡天神店

| 欄位 | 內容 | 可信度 |
|---|---|---|
| 店名 | mont-bell 福岡天神店 | 高（多來源一致） |
| 地址 | 福岡県福岡市中央区天神2-4-38 NTT-KFビル 1F | 高（多來源一致，含 Yahoo!地圖） |
| 營業時間 | 10:30–21:00 | 中（未能開官網核對，僅搜尋摘要） |
| 座標 | 33.587797, 130.398413 | 低（取自第三方定位服務查詢參數，非官方逐一核對，僅供初步定位） |
| 電話 | 092-718-2402 | 低（未核對，未寫入資料） |

來源（搜尋引擎摘要，未能實際開啟頁面核對）：
- mont-bell 官方店舗檢索頁 https://store.montbell.jp/search/shopinfo/?shop_no=618936
- Yahoo!地図店舗頁 https://map.yahoo.co.jp/v3/place/i8oTOIcWSY2
- CASIO PRO TREK 取扱店舗頁（座標來源）https://locator.casio.com/ja-JP/store/wat/details/1849

---

## 已知未處理

- **兩家店目前都沒有任何商品連結**：`npm run validate:data` 會回報
  `店家 uniqlo-fukuoka-tenjin 沒有任何商品連結`、`店家 montbell-fukuoka-tenjin 沒有任何商品連結`。
  這是使用者明確指示「先加店家、商品之後再補」的結果，非遺漏。
  之後要補商品時，依 `skills/kij-shopping-list` 流程，需要一張使用者提供的實際商品照片
  （目前環境連不到品牌官網／電商圖片，無法補真實縮圖）。
- 兩家店的營業時間、電話、座標精確度都只到「搜尋引擎摘要／第三方定位」層級，
  未能像既有店家一樣逐一開啟官網頁面核對，出發前請務必以官方資訊或店內公告為準。
- 新增分類 `clothing`（服飾用品）目前只有這兩家店使用，尚無任何商品掛在此分類下。
