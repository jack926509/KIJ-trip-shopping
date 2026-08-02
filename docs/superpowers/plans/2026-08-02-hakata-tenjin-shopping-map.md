# 博多・天神購物地圖 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立可從購物清單進入的獨立博多・天神互動購物地圖，讓旅途中可依區域與品類尋找最順路的店家並開啟導航。

**Architecture:** 維持靜態網站架構；`index.html` 只增加地圖入口及 HOKA 提醒文案，新增的 `map.html` 自行包含版面、店家資料、Leaflet 地圖與篩選程式。店家資料以一個 `STORES` 陣列為單一來源，同時渲染地圖標記與清單卡片，避免資料不一致；當外部地圖載入失敗時，清單仍能顯示並可開啟導航。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Leaflet 1.9.4 CDN、OpenStreetMap 圖磚、Google Maps 搜尋連結。

## Global Constraints

- 只收錄博多／天神最順路、可由品牌或商場官方頁確認的 1–2 間分店；不要以一般經銷商冒充直營店。
- 不使用 API key、後端、資料庫、即時庫存或 Google My Maps。
- 店家資料必須包含名稱、品牌、區域、地址、營業時間、品類、座標與官方來源 URL。
- 所有外部連結均使用 `target="_blank" rel="noopener noreferrer"`。
- HOKA Fukuoka Tenjin 顯示 11:00–20:00，不出現「非博多／小倉」文字。
- 維持既有米白、墨綠、圓角卡片視覺；手機寬度不可產生橫向捲動。
- 外部地圖失敗時，店家清單與 Google Maps 導航必須可用。
- 完成後先留在本機；只有使用者另行要求時才推送或合併 GitHub。

---

## File Structure

- Modify: `index.html` — 在首頁工具列加入地圖入口；更新 HOKA 直營店提示。
- Create: `map.html` — 地圖頁的 HTML、樣式、店家資料、篩選、Leaflet 標記與降級處理。
- Modify: `docs/on-hoka-stores-hakata-kokura-2026-08-02.md` — 補充本次實際採用的 HOKA／On 店家來源與查核日期（若資料已有則只保留原始研究結果，不重複改寫）。
- Create: `docs/hakata-tenjin-map-store-sources-2026-08-02.md` — 記錄地圖採用的每個店家、查核來源、地址、營業時間與座標取得方式。

## Store Data Contract

`map.html` 內的 `STORES` 每筆資料使用下列形狀：

```js
{
  id: 'hoka-fukuoka-tenjin',
  name: 'HOKA Fukuoka Tenjin',
  brand: 'HOKA',
  category: 'shoe',
  area: 'tenjin',
  address: '福岡県福岡市中央区天神2-8-49 HULIC SQUARE FUKUOKA TENJIN 1F',
  hours: '11:00–20:00',
  note: 'HOKA 直營店；試穿前先確認目標款式與尺寸。',
  lat: 33.5926,
  lng: 130.3988,
  officialUrl: 'https://www.locally.com/store/417342/hoka-fukuoka-tenjin',
  mapsQuery: 'HOKA Fukuoka Tenjin'
}
```

`category` 只允許 `shoe`、`drug`、`daily`、`supermarket`；`area` 只允許 `hakata`、`tenjin`。所有 Google Maps 導航網址由 `mapsQuery` 組成：

```js
`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`
```

## Task 1: 查核並固定地圖店家資料

**Files:**
- Create: `docs/hakata-tenjin-map-store-sources-2026-08-02.md`
- Modify: `map.html`（在 Task 2 建立時填入 `STORES`）

**Interfaces:**
- Produces: 符合 `STORES` 資料契約的 8–12 筆已查核店家資料。
- Consumes: `docs/on-hoka-stores-hakata-kokura-2026-08-02.md` 內的 HOKA／On 查核結果。

- [ ] **Step 1: 建立店家候選清單**

以購物清單實際出現的品牌建立候選：HOKA Fukuoka Tenjin、Alpen FUKUOKA、On 的博多授權通路、唐吉訶德、松本清、SUNDRUG、大國藥妝、3COINS、DAISO，以及一間博多或天神的超市。每個品牌最多保留兩間最順路分店。

- [ ] **Step 2: 對每筆資料查官方來源**

對品牌官方定位器、商場官方店鋪頁或連鎖店官方門市頁逐筆記錄店名、地址、營業時間與官方 URL。不能由官方確認的店家不寫入地圖資料。

- [ ] **Step 3: 產生並檢查來源文件**

以表格記錄 `id`、店名、分類、區域、地址、營業時間、座標、官方來源與查核備註。對 HOKA 確認店名、地址、`11:00–20:00` 和 `092-401-2211`；對一般連鎖店不要宣稱有指定鞋款或庫存。

- [ ] **Step 4: 驗收來源資料**

Run: `rg -n "HOKA Fukuoka Tenjin|11:00–20:00|官方來源" docs/hakata-tenjin-map-store-sources-2026-08-02.md`

Expected: HOKA 資訊、每筆店家來源及查核備註皆存在。

## Task 2: 建立可降級的互動地圖頁

**Files:**
- Create: `map.html`

**Interfaces:**
- Consumes: `const STORES: Store[]`，每筆符合上述 Store Data Contract。
- Produces: `renderStores()`、`applyFilters()`、`focusStore(id)`、`showMapFallback()` 四個頁面內函式。

- [ ] **Step 1: 寫入靜態結構檢查命令**

使用下列命令先確認檔案尚不存在，讓頁面建立後的檢查具體可比對：

```bash
test ! -f map.html
```

Expected: PASS（建立前 `map.html` 不存在）。

- [ ] **Step 2: 建立頁首、篩選列、地圖容器與清單容器**

`map.html` 必須包含：返回 `index.html` 的連結、`#map`、`#mapFallback`、`#storeList`、`#emptyState`，以及區域篩選 `data-area` 和類別篩選 `data-category` 的按鈕。篩選預設皆為 `all`。

- [ ] **Step 3: 加入店家資料與渲染函式**

建立 `STORES`、以 `makeMapsUrl(store)` 產生導航 URL、以 `renderStores()` 產生店家卡片。卡片必須顯示區域、分類、地址、營業時間、備註、官方資料與導航按鈕；所有內容以 `textContent` 或固定字串建立，不使用來自資料欄位的 `innerHTML`。

```js
function makeMapsUrl(store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
}

function visibleStores() {
  return STORES.filter(store =>
    (activeArea === 'all' || store.area === activeArea) &&
    (activeCategory === 'all' || store.category === activeCategory)
  );
}
```

- [ ] **Step 4: 加入 Leaflet 與標記同步**

載入 Leaflet 1.9.4 的 CSS 與 JavaScript。初始化時將地圖置中於 `[33.591, 130.405]`、縮放等級 `13`；使用 OpenStreetMap 圖磚與署名。每筆可見店家生成依類別分色的 `L.divIcon` 標記；卡片與標記皆呼叫 `focusStore(id)`，使地圖聚焦並開啟 popup。

- [ ] **Step 5: 加入外部地圖失敗降級**

在 `window` 的 `error` 事件與 Leaflet 初始化 `catch` 中呼叫 `showMapFallback()`：隱藏 `#map`、顯示 `#mapFallback`，但永遠執行 `renderStores()`。地圖圖磚錯誤不刪除店家卡片。

- [ ] **Step 6: 執行靜態頁面驗收**

Run:

```bash
rg -n "id=\"map\"|id=\"storeList\"|const STORES|function applyFilters|openstreetmap.org|google.com/maps/search" map.html
```

Expected: 每個必要容器、資料陣列、篩選函式、OpenStreetMap 來源與 Google Maps 導航格式皆各有一個命中。

## Task 3: 主頁入口與 HOKA 文案調整

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `map.html` 的相對路徑與 HOKA 官方門市 URL。
- Produces: 可從主頁進入地圖頁的連結，以及已更新的 HOKA 直營店提示。

- [ ] **Step 1: 新增地圖頁入口**

在首頁工具列加入連結至 `map.html` 的「博多・天神地圖」按鈕。連結外觀須沿用 `.toolbar .secondary`，不使用 JavaScript 視窗開啟。

- [ ] **Step 2: 更新 HOKA 直營店文字**

保留 HOKA Fukuoka Tenjin 連結、地址、`11:00–20:00`、電話 `092-401-2211` 與出發前確認庫存提醒；移除「此店在天神，非博多／小倉」整段文字。

- [ ] **Step 3: 執行首頁靜態驗收**

Run:

```bash
rg -n "博多・天神地圖|map.html|HOKA Fukuoka Tenjin|11:00–20:00|非博多／小倉" index.html
```

Expected: 前四項有命中；「非博多／小倉」零命中。

## Task 4: 瀏覽器驗證與回歸檢查

**Files:**
- Verify: `index.html`
- Verify: `map.html`

**Interfaces:**
- Consumes: 完成的主頁與地圖頁。
- Produces: 實際瀏覽器驗證紀錄。

- [ ] **Step 1: 執行差異與 HTML 內嵌 JavaScript 檢查**

Run:

```bash
git diff --check
node -e "const fs=require('fs');const h=fs.readFileSync('map.html','utf8');for(const s of h.matchAll(/<script(?:[^>]*)>([\\s\\S]*?)<\\/script>/g)){new Function(s[1])};console.log('map inline JavaScript OK')"
```

Expected: 兩個命令皆成功，第二個輸出 `map inline JavaScript OK`。

- [ ] **Step 2: 以本機 HTTP 伺服器開啟頁面**

Run:

```bash
python3 -m http.server 8768 --bind 127.0.0.1
```

Expected: `index.html` 與 `map.html` 都能以 HTTP 載入。

- [ ] **Step 3: 驗證桌面版功能**

在實際瀏覽器中從首頁點「博多・天神地圖」，確認地圖顯示、店家標記與清單數量一致；依序切換博多、天神、鞋款、藥妝、生活雜貨、超市，確認標記與卡片同步更新。點一張店家卡片確認地圖聚焦，檢查導航與官方連結的目標 URL。

- [ ] **Step 4: 驗證手機版與降級狀態**

以寬度 390 px 檢視地圖頁，確認地圖在上、清單在下、篩選列能使用且沒有橫向溢位。暫時阻擋 Leaflet 或直接呼叫 `showMapFallback()`，確認可見失敗提示、店家卡片與導航按鈕仍存在。

- [ ] **Step 5: 最終變更檢查**

Run:

```bash
git status --short
git diff --check
```

Expected: 只出現本次地圖、店家來源、HOKA 文字調整與既有未提交研究／預覽檔；沒有空白或格式錯誤。

