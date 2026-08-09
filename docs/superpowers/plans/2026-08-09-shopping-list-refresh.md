# 北九州購物清單改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立與地圖一致的雙欄大卡購物清單、補齊價格資料、移除收藏與店員模式，並加入可重複使用的商品新增 Skill。

**Architecture:** `assets/products.js` 維持唯一商品來源，新增價格來源中繼資料；`index.html` 僅渲染與互動；`assets/kij.css` 提供共同風格與響應式網格；驗證腳本保護資料完整性。Skill 依賴此資料模型，新增資料後同時驗證清單與地圖關聯。

**Tech Stack:** 原生 HTML、CSS、ES Modules、Node.js、Sharp、瀏覽器 localStorage。

## Global Constraints

- 不引入後端、資料庫或外部帳號。
- 不修改既有商品 id，保留已購買與已試穿 localStorage 紀錄。
- 價格須標示種類、來源網址與查證日期。
- 新增門市關聯時必須有可追溯官方資料。

---

### Task 1: 商品資料與驗證規則

**Files:**
- Modify: `assets/products.js`
- Modify: `scripts/validate-products.mjs`
- Create: `docs/product-price-sources-2026-08-09.md`

- [ ] 補上六項缺價商品的價格、價格種類、來源網址及查證日期。
- [ ] 將所有既有商品補成一致的價格中繼資料結構。
- [ ] 擴充驗證腳本，檢查 id 唯一、價格種類合法、價格與來源成對存在、`stores` 為陣列。
- [ ] 執行 `npm run validate:data`。

### Task 2: 清單介面與操作重整

**Files:**
- Modify: `assets/kij.css`
- Modify: `index.html`

- [ ] 建立 1180 px 容器、760 px 雙欄斷點與 390 px 單欄檢查。
- [ ] 以深綠地圖色票取代橘色清單色票，放大卡片內容與圖片。
- [ ] 將一般商品狀態改為文字「未購買／已購買」，鞋款改為「未試穿／已試穿」。
- [ ] 刪除收藏介面、收藏狀態讀寫、店員模式與圖片放大控制。
- [ ] 保留數量、結算、頁籤、跨頁定位與 localStorage 的購買／試穿紀錄。

### Task 3: 商品新增 Skill

**Files:**
- Create: `skills/kij-shopping-list/SKILL.md`
- Create: `skills/kij-shopping-list/templates/product-record.js`
- Create: `skills/kij-shopping-list/references/source-policy.md`

- [ ] 描述自然語句觸發條件與研究、圖片、資料寫入、驗證程序。
- [ ] 提供完整商品資料範本與價格標示規範。
- [ ] 要求只新增資料、不可改動既有 id 或未經確認的門市關聯。

### Task 4: 驗收、審查與部署

**Files:**
- Modify: `README.md`

- [ ] 更新 README 的專案結構與新增商品操作。
- [ ] 執行資料驗證與本機 HTTP 伺服器瀏覽器驗收。
- [ ] 請 sol 對差異做獨立程式審查；修正所有實際問題。
- [ ] 提交變更、推送主分支，確認正式部署網址的清單與地圖。
