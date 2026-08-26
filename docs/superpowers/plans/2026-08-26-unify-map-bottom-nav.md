# 地圖頁底部導覽一致化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 讓桌機版地圖頁使用與清單頁相同的置中膠囊底部導覽，同時維持手機滿寬導覽。

**Architecture:** 三頁已共用 `.kij-bottombar` markup 與 `assets/kij.css`。本次只解除桌機 CSS 的 `body.kij` 頁面限制，讓同一組樣式成為真正的共用元件，並以靜態契約測試防止日後再次分流。

**Tech Stack:** HTML、CSS、Node.js 靜態契約測試

**Spec:** `docs/superpowers/specs/2026-08-26-unify-map-bottom-nav-design.md`

## Global Constraints

- 桌機門檻固定為 821px，膠囊寬度上限固定為 460px，底部距離固定為 18px。
- 820px 以下保留既有滿寬底部導覽。
- 不修改地圖、商品或行程資料，也不新增依賴。
- 保留 `aria-current="page"`、44px 最小觸控高度與鍵盤焦點樣式。

---

### Task 1: 共用桌機底部導覽樣式

**Files:**
- Modify: `scripts/test-list-ui.mjs`
- Modify: `assets/kij.css`

**Interfaces:**
- Consumes: 三頁既有的 `.kij-bottombar` markup 與 `.active` 狀態。
- Produces: 所有頁面共用的 821px 以上置中膠囊導覽樣式。

- [x] **Step 1: 寫入會失敗的共用樣式契約測試**

在 `scripts/test-list-ui.mjs` 讀取的 `kijCss` 上加入檢查：禁止 `body.kij .kij-bottombar`，並要求 821px media query 內存在未限定頁面的 `.kij-bottombar`、460px 寬度及 18px bottom。

```js
if (/body\.kij \.kij-bottombar/.test(kijCss)) {
  failures.push('桌機底部導覽仍只套用在 body.kij，地圖頁會維持滿版樣式');
}
if (!/@media \(min-width: 821px\) \{[\s\S]*?\.kij-bottombar \{[\s\S]*?width: min\(460px,[\s\S]*?bottom: 18px;/.test(kijCss)) {
  failures.push('共用桌機底部導覽缺少 460px 置中膠囊或 18px 底部距離');
}
```

- [x] **Step 2: 執行測試並確認先失敗**

Run: `node scripts/test-list-ui.mjs`

Expected: FAIL，訊息包含「桌機底部導覽仍只套用在 body.kij」。

- [x] **Step 3: 將桌機膠囊規則改為三頁共用**

在 `assets/kij.css` 的 `@media (min-width: 821px)` 中，把四個 `body.kij .kij-bottombar...` 選擇器改為 `.kij-bottombar...`，並更新註解說明三頁統一。

```css
@media (min-width: 821px) {
  .kij-bottombar { /* 既有膠囊屬性 */ }
  .kij-bottombar a { /* 既有橫向排列屬性 */ }
  .kij-bottombar i { font-size: 17px; }
  .kij-bottombar .active { background: var(--accent-soft); }
}
```

- [x] **Step 4: 執行自動驗收**

Run: `npm test`

Expected: 清單 UI 與行程測試全部通過。

Run: `npm run validate:data`

Expected: 商品與店家資料驗證通過，數量維持 76 項商品、46 家店。

Run: `git diff --check`

Expected: 無空白錯誤。

- [x] **Step 5: 執行瀏覽器驗收**

在 1280×900 與 390×844 開啟 `index.html`、`itinerary.html`、`map.html`。確認桌機三頁導覽同為置中膠囊；手機三頁同為滿寬；頁面無水平溢出，地圖可操作且 console 無錯誤。

- [x] **Step 6: 建立原子提交**

```bash
git add assets/kij.css scripts/test-list-ui.mjs docs/superpowers/specs/2026-08-26-unify-map-bottom-nav-design.md docs/superpowers/plans/2026-08-26-unify-map-bottom-nav.md
git commit -m "fix: 統一桌機版底部導覽樣式"
```
