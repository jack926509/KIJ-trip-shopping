# Shopping Itinerary Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增獨立行程頁，搬移地圖的路線建議，並讓固定行程與即時補買共用路線資料及地圖呈現。

**Architecture:** 固定行程放在 `assets/itinerary.js`；純路線邏輯集中於 `assets/route-planner.js`。`scripts/itinerary-app.js` 顯示固定與即時路線，`scripts/map-app.js` 只負責店家地圖及網址指定的路線繪製。

**Tech Stack:** 原生 ES modules、HTML、CSS、Leaflet 1.9.4、Node.js 驗證腳本。

**Spec:** `docs/superpowers/specs/2026-08-26-shopping-itinerary-design.md`

## Global Constraints

- 不建立第二份商品或店家資料。
- 不更改既有 localStorage key。
- 固定行程順序不得被最近鄰演算法重排。
- 藥妝店與候選店家不得宣稱現貨。
- 不新增執行期依賴。
- 不 push、不部署。

---

### Task 1: 行程資料與驗證

**Files:**
- Create: `assets/itinerary.js`
- Create: `assets/route-planner.js`
- Modify: `assets/stores.js`
- Modify: `scripts/validate-products.mjs`

**Interfaces:**
- Produces: `ITINERARY_DAYS`, `ITINERARY_SEGMENTS`, `createRoutePlanner({ stores, products, readStoredBool })`。

- [ ] 新增失敗驗證：行程 segment、店家與商品 ID 必須存在。
- [ ] 執行 `npm run validate:data`，確認因模組尚未建立而失敗。
- [ ] 寫入 9/3–9/6 行程資料與 Cosmos 店家。
- [ ] 抽出距離、路段與即時補買純函式。
- [ ] 再跑 `npm run validate:data`，確認通過。

### Task 2: 行程頁

**Files:**
- Create: `itinerary.html`
- Create: `scripts/itinerary-app.js`
- Create: `assets/itinerary.css`
- Modify: `index.html`
- Modify: `map.html`

**Interfaces:**
- Consumes: `ITINERARY_DAYS`、`ITINERARY_SEGMENTS`、路線規劃器。
- Produces: 日期分頁、固定行程卡、即時補買區域分頁及地圖連結。

- [ ] 先擴充 `scripts/test-list-ui.mjs`，要求三頁導覽與行程 module。
- [ ] 執行 `npm test`，確認失敗。
- [ ] 建立行程頁、日期選擇、固定行程與即時補買渲染。
- [ ] 將三頁底部導覽統一為清單、行程、地圖。
- [ ] 執行 `npm test`，確認通過。

### Task 3: 地圖路線入口搬移

**Files:**
- Modify: `map.html`
- Modify: `scripts/map-app.js`
- Modify: `assets/route-planner.js`
- Modify: `scripts/test-list-ui.mjs`

**Interfaces:**
- Consumes: `map.html?plan=<segment-id>`、`map.html?route=<area>`。
- Produces: 固定或即時路線的編號 marker、polyline、結束路線按鈕。

- [ ] 新增失敗測試：地圖不得保留 `routePanel`，但必須解析 `plan`、`route`。
- [ ] 執行 `npm test`，確認失敗。
- [ ] 移除地圖抽屜內行程面板及其渲染程式。
- [ ] 保留路線圖層，改由網址參數啟動固定或即時路線。
- [ ] 執行 `npm test`，確認通過。

### Task 4: 完整驗收與提交

**Files:**
- Modify: `package.json`
- Create: `scripts/test-itinerary.mjs`

**Interfaces:**
- Produces: 單一 `npm test` 可執行清單與行程契約測試。

- [ ] 新增行程資料、順序、網址及可選站測試。
- [ ] 執行 `npm run validate:data`、`npm test` 與所有 `node --check`。
- [ ] 執行 `git diff --check`。
- [ ] 啟動本機網站，以 390px、1280px 驗收清單、行程、地圖及 console。
- [ ] 檢查差異只含本功能，建立本機 commit。
