# 北九州購物行程頁設計

## 目標

新增獨立的「行程」頁，呈現 2026-09-03 至 2026-09-06 的固定購物時間表，並把地圖頁目前的「購物路線建議」搬到行程頁。清單、行程、地圖三頁共用商品、店家、購買狀態與路線計算，不維護重複資料。

## 使用者會看到的結果

- 底部導覽改為「清單｜行程｜地圖」。
- 行程頁上半部依日期顯示固定時段與站序。
- 行程頁下半部顯示依尚未購買／尚未試穿商品產生的即時補買路線。
- 固定行程或即時路線都能按「在地圖查看」，前往地圖顯示編號圖釘與連線。
- 地圖頁不再顯示原本的「購物路線建議」面板，但保留路線繪製及結束路線按鈕。

## 資料設計

`assets/itinerary.js` 是固定行程的唯一執行期來源。每段行程包含 `id`、`date`、`startTime`、`endTime`、`title`、`anchor`、`note` 與依序排列的 `stops`。每站只記 `storeId`、`arrivalTime`、`durationMinutes`、`optional`、`productIds` 與行程專用提醒；店名、地址、營業時間、座標與商品名稱仍由 `assets/stores.js`、`assets/products.js` 取得。

`assets/route-planner.js` 提供純函式，負責直線距離、固定順序路段、即時補買路線分組及 Google Maps 分段網址。行程頁與地圖頁透過同一個模組取得相同站序，避免兩頁各自實作。

Cosmos 天神大丸前店加入 `assets/stores.js`，定位為行程選配店家；列入行程不代表指定商品有現貨。

## 頁面與導覽

新增 `itinerary.html`、`scripts/itinerary-app.js`、`assets/itinerary.css`。行程頁以日期分頁顯示 9/3、9/4、9/5、9/6，預設選擇今天；不在旅程日期內時選擇最近的下一個日期，旅程結束後選 9/6。

固定行程卡顯示時段、站序、店家、營業時間、購買目標、選配與提醒。9/5 顯示「不排固定購物站」。即時補買路線保留原地圖頁的區域分頁、站數、直線距離、步行估算及 Google Maps 導航。

固定行程地圖網址使用 `map.html?plan=<segment-id>`；即時路線使用 `map.html?route=<area>`。地圖只接受資料中存在的 segment id 或 `tenjin`、`hakata`、`kokura`，無效參數會忽略並正常顯示一般店家地圖。

## 狀態與錯誤處理

- 仍沿用 `kij_bought_<id>` 與 `kij_tried_<id>`，不遷移既有狀態。
- 固定行程保留全部站點，已完成商品只改變顯示狀態，不改原定順序。
- 即時補買路線只納入未完成商品；候選店家仍標示需到店確認。
- 店家或商品 ID 不存在時由資料驗證阻擋，不讓錯誤資料進入發布流程。
- Leaflet 載入失敗時仍保留 Google Maps 導航連結與店家清單。

## 驗收

- `npm run validate:data` 驗證行程日期、時間、segment id、store id、product id 與站序。
- `npm test` 涵蓋三頁導覽、行程頁 module、地圖不再含路線面板及網址路線模式。
- `node --check` 通過所有新增與修改的 JavaScript。
- 390px 與 1280px 實際瀏覽器檢查三頁導覽、固定行程、即時補買、地圖路線與水平溢位。
- 本次不 push、不部署；完成本機 commit 後交付。
