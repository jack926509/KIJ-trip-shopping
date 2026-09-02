# 日本旅遊採購總表

北九州旅行使用的日本藥妝、日用品、食品伴手禮、3C 配件與社群推薦採購清單。

本專案為三頁式靜態網站，可直接部署至 Vercel、GitHub Pages、Cloudflare Pages 或其他靜態網站服務。

## 功能

- 商品分類篩選
- 商品名稱與品牌搜尋
- 購買完成勾選
- 數量與價格計算
- 日圓／新臺幣金額顯示（台幣由 `assets/products.js` 的 `JPY_TWD_RATE` 單一匯率換算）
- 社群推薦標示
- 手機與桌面響應式版面
- 使用瀏覽器保存部分操作紀錄
- 商品價格來源與查證日期
- 依日期顯示固定購物行程
- 依未完成商品產生即時補買路線，並可在地圖顯示站序
- 離線可用：三頁與商品縮圖預先快取，店內訊號不穩時仍打得開

## 專案結構

```text
.
├── index.html                  # 採購清單主頁
├── itinerary.html              # 固定行程與即時補買路線
├── map.html                    # 購物地圖（店家資料已抽出，見 assets/stores.js）
├── package.json
├── sw.js                       # 離線快取（預快取清單由 build:sw 產生）
├── assets/
│   ├── kij.css                 # 三頁共用樣式
│   ├── itinerary.css           # 行程頁樣式
│   ├── map.css                 # 地圖頁樣式
│   ├── groups.js               # 商品分頁（group）唯一來源
│   ├── itinerary.js            # 固定行程唯一資料源
│   ├── list-model.js           # 清單挑選邏輯（搜尋、篩選、進度計數）
│   ├── products.js             # 單一商品資料源＋JPY_TWD_RATE 匯率
│   ├── route-planner.js        # 固定／即時路線共用邏輯
│   ├── stores.js               # 單一店家資料源（三頁共用）
│   └── vendor/                 # 自帶的 Leaflet 與圖釘聚合套件（不走 CDN）
├── scripts/
│   ├── index-app.js            # 清單頁互動
│   ├── itinerary-app.js        # 行程頁互動
│   ├── map-app.js              # 地圖頁互動與路線繪製
│   ├── register-sw.js          # 三頁共用的離線快取註冊
│   ├── validate-products.mjs   # 資料驗證器
│   ├── build-images.mjs        # 由原圖產生 thumb／full
│   ├── build-placeholder-images.mjs # 由 placeholder-manifest 產生文字品牌卡
│   ├── build-sw-precache.mjs   # 產生 sw.js 的預快取清單
│   └── extract-embedded-images.mjs
├── skills/kij-shopping-list/   # 新增商品用的 Skill
├── docs/                       # 價格與店家的查證紀錄
├── .github/workflows/          # push／PR 時自動跑驗證
└── images/
    ├── thumb/<id>.webp         # 卡片縮圖，檔名必須等於商品 id
    ├── full/<id>.webp          # 放大圖
    ├── source/                 # 原始圖（不直接使用）
    ├── build-manifest.json     # id → 原圖來源對照（實拍照片走這條）
    ├── placeholder-manifest.json # id → 品牌／型號／主色（無實拍照的文字卡）
    ├── hoka/ · on/ · dryer/    # 品牌官方圖
    └── products/
```

`index.html`、`itinerary.html` 與 `map.html` 都以 ES module 讀取共用資料，**不得各自維護副本**：

- 商品：`assets/products.js`
- 店家：`assets/stores.js`
- 固定行程：`assets/itinerary.js`
- 路線計算：`assets/route-planner.js`
- 商品分頁：`assets/groups.js`
- 清單挑選邏輯：`assets/list-model.js`

店家的兩個名稱刻意並存、且在同一筆記錄裡相鄰擺放，方便一眼核對：

| 欄位 | 用途 |
| --- | --- |
| `name` | 地圖標記與店家卡片，比照招牌的日文正式名稱 |
| `listName` | 清單頁的店家連結，較短的中文慣用名 |

先前店家資料內嵌在 `map.html`，而 `index.html` 另外手抄了一份 `STORE_SUMMARIES`，
兩份副本各自演化到 18 家店在兩頁顯示不同名稱——其中 `sports-depo-canal-city-hakata`
在清單頁是「SPORTS DEPO キャナルシティ博多店」、地圖頁卻是「Alpen FUKUOKA」，
同一個 id 指到兩家不同的店。現已合併為單一來源，該筆也更名為
`alpen-fukuoka-canal-city-hakata`，驗證器並會擋下任何一頁重新自建副本。

## 在本機開啟

因為使用 ES module，直接以 `file://` 開啟 `index.html` 會被瀏覽器的跨來源限制擋下。請起一個本機伺服器：

```bash
python3 -m http.server 8000
```

然後開啟 <http://localhost:8000/index.html>。

## 部署至 Vercel

### 方法一：Vercel 網頁匯入

1. 將 `index.html` 與 `README.md` 上傳至 GitHub Repository。
2. 登入 Vercel。
3. 選擇 **Add New → Project**。
4. 匯入 GitHub Repository。
5. Framework Preset 選擇 **Other**。
6. Build Command、Output Directory 與 Install Command 保持空白。
7. 點擊 **Deploy**。

### 方法二：Vercel CLI

安裝 Vercel CLI：

```bash
npm install -g vercel
```

在專案資料夾執行：

```bash
vercel
```

正式部署：

```bash
vercel --prod
```

## 更新網站

若已連接 GitHub 與 Vercel：

1. 修改對應頁面或 `assets/` 共用資料。
2. Commit 並 Push 到 GitHub。
3. Vercel 會自動重新部署。

## 快速新增商品

專案內建 `skills/kij-shopping-list`。安裝到 Codex Skills 目錄後，只要說「新增購物清單商品」或貼上商品網址，Skill 就會研究日本價格、來源、圖片與可證實店鋪關聯，寫入共用商品資料並驗證網站。

安裝方式：

```bash
cp -R skills/kij-shopping-list ~/.codex/skills/
```

所有新增商品會寫入 `assets/products.js`，因此部署後會正式出現在清單；有可證實的店鋪關聯時，也會出現在地圖頁。

## 資料驗證

**任何資料變更後都要執行：**

```bash
npm run build:sw      # 商品有增減時，重新產生離線預快取清單
npm run validate:data
npm test
```

`npm test` 會擋下預快取清單過期，所以忘了跑 `build:sw` 不會悄悄溜過去。

`.github/workflows/validate-data.yml` 會在 push 與 PR 時自動執行驗證與測試。

測試分兩種，刻意不混在一起：

- `test-list-ui.mjs`、`test-itinerary.mjs`：**契約與不變條件**（HTML 與資料相符、
  快取版號一致、不得重建副本、自帶套件的雜湊）。這些只能靠比對原始碼。
- `test-list-model.mjs`：**真的執行**清單頁的挑選邏輯（搜尋、篩選、進度計數）。
  這類問題比對原始碼看不出來，必須跑一遍才知道。

驗證器除了檢查欄位格式，也會攔截「同一筆資料的兩個欄位互相矛盾」這類過去只能靠人工複查才找得到的問題：

| 檢查 | 說明 |
| --- | --- |
| 通路名稱 vs 來源網域 | `priceNote` 若點名 BicCamera、LOHACO、Costco 等通路，`priceSourceUrl` 網域必須相符 |
| 含稅金額 vs `yen` | `priceNote` 若寫「含稅 ¥N」，N 必須等於 `yen`（全站一律存含稅價） |
| 來源必須是單品頁 | `official`／`retailer-reference` 不得使用網站首頁或站內搜尋頁 |
| 台幣換算 | `twdRef` 必須等於 `yen × JPY_TWD_RATE`，禁止手寫值 |
| 地圖店家覆蓋 | 每家店都必須至少被一項商品連結，不留只畫在地圖上的標記；刻意只作地點參考的店家要標 `referenceOnly: true`，補上商品後驗證器會提醒把旗標拿掉 |
| 營業時間 | 不得只寫「依…公告」這類空泛字樣 |
| 樓層一致性 | 店家 `address` 與 `mapsQuery` 的樓層寫法不得互相矛盾 |
| 店家資料完整性 | `stores.js` 每筆都必須有 `name`、`listName`、`type` 等欄位與數字座標，id 不得重複 |
| 禁止重建副本 | `map.html` 不得再內嵌 `const STORES` 或 `<style>`，`index.html` 不得再寫死 `STORE_SUMMARIES`；分頁按鈕必須與 `assets/groups.js` 相符 |
| 行程資料 | 日期、時段、segment、店家與商品 id 必須存在且站序時間合法 |

其他既有檢查：id 唯一、`stores` 必須指向地圖上存在的店家、有價格就必須有 `source` 檔案、每項商品都要有 `images/thumb/<id>.webp`、中文欄位不得混入簡體字。

## 離線快取

網站要在日本的店裡用，而地下街與大型店內訊號經常不穩。`sw.js` 會預先快取三個頁面、
全部程式與樣式、自帶的 Leaflet，以及 79 張商品縮圖（約 1.3 MB），斷線時三頁都能完整開啟。

| 資源 | 策略 | 原因 |
| --- | --- | --- |
| HTML | 網路優先、離線回退 | HTML 是唯一指向版號的檔案，要拿得到新版才會載入新資產 |
| 帶 `?v=` 的 CSS／JS | 快取優先 | 版號變了就是新網址，必然 miss，不會拿到過期內容 |
| 商品縮圖 | 安裝時預抓 | 現場一定會看 |
| 放大圖 | 用到才存 | 5.7 MB 且多數不會點開 |
| 地圖圖磚 | 用到才存，上限 800 筆 | 存過的區域離線也看得到；不隨版本汰換 |

**更新網站時**：改任何資產後把三頁的 `?v=` 與 `sw.js` 的 `CACHE_VERSION` 一起推進，
再跑 `npm run build:sw`。三者對不上時 `npm test` 會擋下來。

## 第三方套件

Leaflet 1.9.4 與 leaflet.markercluster 1.5.3 **自帶在 `assets/vendor/`，不走 CDN**。
CDN 是境外連線、訊號差時最先斷的一環，而 service worker 只能快取同源資產——
掛在 CDN 上等於地圖永遠離線不了。自帶之後也不需要 SRI：檔案同源、跟著本站部署。

檔案內容由 `npm test` 以 sha256 釘住（`VENDOR_HASHES`）。升級方式：

```bash
npm pack leaflet@<版本>
# 解開後覆蓋 assets/vendor/，更新測試裡的雜湊與 sw.js 的 CACHE_VERSION
```

授權條款隨檔案保留：Leaflet 為 BSD-2-Clause、markercluster 為 MIT。

## 匯率

台幣金額由 `assets/products.js` 的單一常數換算，各商品**不得自帶手寫的 `twdRef`**：

```js
export const JPY_TWD_RATE = 0.2032;
export const JPY_TWD_RATE_CHECKED_AT = '2026-08-21';
```

更新匯率只需改這兩個值再跑一次驗證。（先前兩筆手寫值曾各用 0.311 與 0.322 兩套匯率而互相矛盾，改為單一來源即為此。）

## 價格慣例

- `yen` 一律存**含稅價**。
- `priceKind` 表示佐證強度：`official`（品牌官方）、`retailer-reference`（通路標價）、`launch-reference`（上市報導）、`photo-reference`（現場照片，此時 `priceSourceUrl` 必須為 `null`）、`pending`（未定價）。
- 屬**開放價格**（廠商不定價）而無法給出單一數字的商品，維持 `pending` 並在 `priceNote` 寫明原因；這是最終判定，不是待補資料。

## 圖片

縮圖與放大圖由原圖自動產生：

```bash
npm run build:images
```

原圖放在 `images/source/`（或 `images/products/`、品牌資料夾），並在 `images/build-manifest.json` 登記 `商品 id → 原圖路徑`，產出 `images/thumb/<id>.webp` 與 `images/full/<id>.webp`。**縮圖檔名必須等於商品 id**，驗證器會檢查。

有些商品目前找不到可用的實拍照（例如部分滑鼠），但卡片仍需要一張圖檔。這類改用文字版品牌卡：

```bash
npm run build:placeholders
```

它讀 `images/placeholder-manifest.json` 的 `商品 id → 品牌／型號／主色`，產出同樣的 `thumb`／`full`。
兩份 manifest 是互斥的：一個商品的圖只會由其中一條管線產生，日後補到實拍照就從
`placeholder-manifest.json` 移到 `build-manifest.json`。

商品下架時，記得一併刪除 `thumb`／`full`／原圖與 manifest 項目，避免留下無人引用的孤兒圖片。

建議：

- 優先使用 WebP 格式。
- 單張圖片建議控制在 100–300 KB。
- 避免將大量高解析度圖片全部轉成 Base64 嵌入 HTML。
- 使用相對路徑，不要使用電腦本機絕對路徑。
- 商品圖片建議確認授權與來源。

## 圖片來源

- CIO 行動電源與**部分**滑鼠的卡片圖為**品牌官方商品照**（2026-08-20 由規格示意圖／文字版品牌卡換成實品照，共 8 項）；原圖存於 `images/source/`，如需更換照片，覆蓋原圖後再跑 `npm run build:images` 即可。舊的 `.svg` 規格示意圖仍留在 `images/source/`，已不被 `images/build-manifest.json` 引用。
- 滑鼠分頁其餘 6 款（`elecom-ex-g-pro`、`sanwa-400-ma092`、`logicool-ergo-m575-sp`、`logicool-mx-ergo-s`、`logicool-pebble-mouse-2-m350s`、`buffalo-bsmbw318bk`）**仍是文字版品牌卡，不是實拍照片**，由 `npm run build:placeholders` 依 `images/placeholder-manifest.json` 產生。找到可用的官方商品照後，把它登記到 `images/build-manifest.json`、從 `placeholder-manifest.json` 移除，再跑 `npm run build:images`。
- ON 鞋款圖片取自 [ON 官方網站](https://www.on.com/)，頁面內均標註來源並連回對應官方商品頁。
- HOKA 鞋款圖片取自台灣經銷商 [ISPO+ 官方網站](https://www.ispo.com.tw/)，頁面內均標註實際圖片來源；商品資訊連結仍指向 HOKA 日本官方網站。
- 圖片僅供個人旅遊採購規劃使用；公開或商業使用仍應依品牌授權條款辦理。

## 注意事項

- 商品價格、庫存、匯率與社群推薦可能隨時間改變。
- 實際購買前，請再次確認官方資訊與店內標示。
- 網站資料主要供個人旅遊採購規劃使用。
