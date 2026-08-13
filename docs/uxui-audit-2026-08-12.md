# KIJ-trip-shopping UX/UI 現況盤點

日期：2026-08-12（台北時間）
範圍：`index.html`、`map.html`、`assets/kij.css`、`assets/products.js`，並比對既有設計文件與 git log。
用途：供後續 UX/UI 改版規劃的事實基礎，純盤點、未修改任何檔案。

---

## 1. 兩個 HTML 頁面：結構與互動元件

### 1.1 `index.html`（563 行，26 KB）—「購物清單」頁

由上而下的區塊（`index.html:9-37`）：

1. **`<header class="kij-header">`**（`index.html:11-27`）：sticky 固定於頂端。內含標題列（品名＋商品總數 `#kijItemCount`）、進度條（`#kijProgressLabel`，顯示「已買 N / M 項」）、四個分類頁籤（`<nav class="kij-tabs">`：藥妝日用／便利商店必買必吃／吹風機／鞋款，`index.html:20-25`）。
2. **`<main id="kijMain">`**：內含 `#kijSections`，由 JS 依目前頁籤動態渲染單一分區內容（`index.html:329-376` 的 `buildSectionHtml`）。
3. **`<nav class="kij-bottombar">`**（`index.html:33-36`）：sticky 固定於底部，僅兩個項目「清單」「地圖」。

互動元件：
- **分類頁籤（跳轉＋聚焦）**：點頁籤只顯示該群組，捲回頂端（`focusSection`，`index.html:440-445`）。**不是同頁篩選**，是整段替換渲染。
- **可收合分區標題**：`role="button" tabindex="0"`，點擊或 Enter／空白鍵切換收合，收合狀態存 localStorage（`toggleSectionCollapse`，`index.html:469-478`）。
- **數量加減**（僅 `tracking:'buy'` 的藥妝類）：＋／－按鈕，狀態存 `kij_qty_<id>`（`index.html:280-291,524-533`）。
- **已試穿切換**（鞋款）：按鈕文字「未試穿／已試穿 ✓」，存 `kij_tried_<id>`（`index.html:300-301,516-523`）。
- **圖片放大連結**：縮圖包一層 `<a>` 連到原尺寸圖，`target="_blank"` 開新分頁，非站內 Modal（`index.html:307`）。
- **跨頁定位**：帶 `#<productId>` 錨點進站可自動展開對應分區並捲動聚焦，供 `map.html` 連回使用（`applyUrlParams`／`focusProductById`，`index.html:449-467`）。
- 分類頁籤、數量控制、已試穿按鈕皆為原生 `<button>`；分區收合是 `<div role="button">` 而非原生按鈕（見第 7 節 a11y）。

**無**：搜尋框、篩選（除頁籤外）、Modal 彈窗、「結算」／「收藏」按鈕、日圓即時匯率。

### 1.2 `map.html`（1357 行，52 KB）—「地圖」頁

由上而下：

1. `back-link` 返回清單連結（`map.html:596`）。
2. `hero` 標題區（`map.html:598-602`）。
3. `filter-panel`（sticky）：區域篩選（全部／小倉／博多／天神，按鈕群）＋店家分類下拉選單（`<select>`，7 類）（`map.html:604-625`）。
4. `result-line`：符合筆數＋色票圖例（`map.html:627-638`）。
5. `content-grid` 雙欄：左側 Leaflet 地圖 `#map`（含載入失敗的 `#mapFallback` 降級畫面）；右側 `#storeList` 店家卡片清單，含 `#emptyState` 空狀態＋「重設篩選」按鈕（`map.html:640-661`）。
6. 底部工具列（與 `index.html` 共用樣式，「地圖」為 active）（`map.html:664-667`）。

互動元件：
- 區域篩選按鈕、店家分類下拉選單，共同過濾 `#storeList` 與地圖 marker。
- Leaflet 地圖：自訂 pin（依分類上色）、popup、`fitBounds` 自動置中。
- 每張店家卡片有「這裡可買 N 項」商品縮圖列（最多 5 張＋`+N`），連回 `index.html#<id>`（`map.html:1134-1160`）。
- 圖磚載入失敗降級：隱藏地圖、顯示 `#mapFallback` 提示文字＋保留店家清單（`map.html:9-16` inline script、`map.html:263-271` 樣式）。
- 空狀態「重設篩選」按鈕已存在（`map.html:653-659`），非設計文件中提到「原規劃未做」的舊狀態。

---

## 2. `assets/kij.css`（431 行）：設計 token 現況

**有 CSS 變數，但只有一小組核心 token，定義在 `:root`（`assets/kij.css:2-14`）：**

```css
--bg: #fffdf8;
--surface: #ffffff;
--accent: #ff6b45;
--accent-soft: #fff4ec;
--text: #2b2118;
--muted: #9c9086;
--line: #f2e8dc;
--radius-card: 16px;
--radius-pill: 99px;
--shadow-card: 0 3px 12px rgba(180, 120, 80, .13);
--tap-min: 44px;
```

**這組 `:root` token 實際上被整檔覆寫、從未真正生效**：`body.kij` 選擇器在檔案後段（`assets/kij.css:207-217`）重新定義了同名變數（`--bg:#f4f1eb`、`--accent:#2f6d5e` 深綠、`--text:#26302c` 等），且優先權更高。也就是說目前頁面實際呈現的是「米白＋深綠」配色，`:root` 那組「暖白＋珊瑚橘」token 是死碼，只是 2026-08-05 設計文件的舊版視覺遺留（見第 5 節）。

**分類色票是硬編碼色碼，不是變數**（`assets/kij.css:25-28`）：
```css
.kij-cat-drug { color: #0a7a6a; background: #d7f5ee; }   /* 藥妝 綠 */
.kij-cat-food { color: #a04a10; background: #ffe7d8; }   /* 食品 橘 */
.kij-cat-electronics { color: #6b3fa0; background: #ece2fb; } /* 3C／家電 紫 */
.kij-cat-shoe { color: #1f5fa8; background: #dceafb; }    /* 鞋款 藍 */
```
比較表（`.kij-compare`）、鞋款品牌分色（ON／HOKA）另外散落十幾個十六進位色碼（`assets/kij.css:390-408`），同樣未 token 化。

**字型**：系統字型堆疊，無自訂 webfont（`assets/kij.css:22`）：
```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
```
無字級 scale 變數，字級全部是各元件個別寫死的 px 值（例如 `.kij-card h5 { font-size: 13.5px; }`、桌機版覆寫為 `18px`，`assets/kij.css:158,285`）。

**斷點（media query）共 3 處**：
- `@media (min-width: 760px)`（`assets/kij.css:350`）：分區內容改雙欄 grid。
- `@media (max-width: 540px)`（`assets/kij.css:355`、`assets/kij.css:416`）：手機版尺寸收斂（卡片內距、縮圖尺寸、字級）。

**深色模式：無**。全檔搜尋 `prefers-color-scheme` 零筆命中（`index.html`、`map.html`、`assets/kij.css` 皆無），且 2026-08-05 設計文件明確列為 YAGNI（見第 5 節）。

---

## 3. `assets/products.js`（869 行）：資料 schema 與統計

單一商品資料源，`export const PRODUCTS`，供兩頁 `import`（`assets/products.js:1`、`index.html:40`、`map.html:676`）。

**單筆商品欄位**（以第一筆 `jinmart` 為樣本，`assets/products.js:4-20`）：

| 欄位 | 說明 |
|---|---|
| `id` | 唯一鍵，兼作 DOM id、localStorage 鍵、跨頁錨點 |
| `group` | `shopping` \| `convenience` \| `dryer` \| `shoes` |
| `tracking` | `buy`（已購買＋數量）\| `try`（已試穿，無數量） |
| `category` | 子分類文字，`shopping`／`convenience` 才有，`dryer`／`shoes` 為 `null` |
| `name` / `jaName` | 中文名／日文正式品名（查無則 `null`） |
| `model` | 型號，多數為 `null` |
| `yen` / `twdRef` | 日圓參考價／台幣對照，查無填 `null` 不估算 |
| `defaultQty` | 預設購買數量 |
| `image` | 縮圖路徑（`images/thumb/<id>.webp`） |
| `note` | 一句話推薦理由 |
| `source` | 價格來源檔路徑，可追溯 |
| `stores` | 對應 `map.html` 店家 id 陣列 |
| `priceKind` | `official` \| `retailer-reference` \| `launch-reference` \| `photo-reference` \| `pending` |
| `priceSourceUrl` / `priceCheckedAt` / `priceNote` | 價格查證細節 |

**統計**（實跑 `node` 匯入 `PRODUCTS` 得出）：
- 共 **48** 筆商品。
- 依 `group`：`shopping` 31、`shoes` 10、`convenience` 5、`dryer` 2。
- 依 `tracking`：`buy` 38、`try` 10。
- `category` 共 **13** 種文字值（皮膚護理、痠痛舒緩、旅途常備藥、食品伴手禮、3C 配件、日用品、晴雨傘、冰品、麵包甜點、飲品、即食湯品、廚房用品、戶外用品），但 `assets/index.html:58-72` 的 `CATEGORY_CHIP_CLASS` 對照表只把它們收斂成 4 種色票（藥妝綠／食品橘／3C 紫／鞋款藍）。

---

## 4. 共用程度與內嵌樣式／腳本

**共用**：兩頁都 `<link rel="stylesheet" href="assets/kij.css">`（`index.html:7`、`map.html:25`），也都 `import { PRODUCTS } from './assets/products.js'`。底部工具列（`.kij-bottombar`）、卡片元件（`.kij-card`、`.kij-pill` 等）樣式來自這份共用檔，理論上一改兩頁同步。

**`map.html` 內嵌了大量頁面專屬樣式與邏輯，並未真正共用**：
- `<style>` 區塊 **566 行**（`map.html:26-592`），含自己的 `:root` 變數：`--bg`、`--card`、`--text`、`--muted`、`--green`、`--green-dark`、`--soft`、`--line`、`--gold`、`--warn`（`map.html:27-38`）。
- **變數命名不一致、部分重複定義**：`map.html` 用 `--green` 對應 `kij.css` 的 `--accent`（同色值 `#2f6d5e`，但變數名不同，等於同一個顏色在兩個檔案各維護一份），`--bg`／`--text`／`--muted`／`--line` 則是同名同值重複定義（`map.html:28-37` 對照 `assets/kij.css:207-214`），不是真正共用，只是手動保持數值一致——未來改配色需要兩處同步改，容易漏改。
- `<script type="module">` 區塊 **680 行**（`map.html:675-1355`），含店家資料陣列 `STORES`（十幾家店，逐筆含地址、經緯度、官方來源連結）、Leaflet 初始化、篩選邏輯、店卡渲染，全部寫在頁面內，未抽成 `assets/` 底下的共用模組。
- 分類色票在 `map.html` 內以 legend／pin 兩組 class 各自重寫一次十六進位色碼並加註解「與 kij.css 的 .kij-cat-* 保持一致」（`map.html:217-221,551-558`）——即人工同步，非程式共用，未來 `kij.css` 改色若忘記同步 `map.html` 就會不一致。

結論：**視覺 token 與商品資料是共用的，但頁面專屬的版面、店家資料、篩選邏輯完全獨立內嵌**，不算「兩頁共用一套前端」，比較接近「共用設計語彙＋各自實作」。

---

## 5. 既有設計文件 vs 實際程式碼

專案共有兩份規格／計畫，時間序上第二份大幅推翻第一份的部分決定，**目前程式碼實際對應的是較新的 2026-08-09 版本**，這點在盤點前必須先弄清楚，否則會誤判「沒做完」：

### 5.1 `docs/superpowers/specs/2026-08-05-kij-ux-redesign-design.md`（初版，已核准進入實作）

**已實作**：
- 共用 `assets/kij.css`＋`assets/products.js` 架構（文件第四、五節）→ 對應 `assets/kij.css:1`、`assets/products.js:1`。
- 分類頁籤「跳轉＋聚焦」行為（文件第二節表格）→ `index.html:440-445`。
- localStorage 改用商品 `id` 為鍵，取代舊的 DOM 索引鍵（文件「localStorage 依 DOM 索引產生鍵的風險」段）→ `index.html:120-134` 皆以 `kij_bought_${id}` 等命名。
- 圖片外部化為 `images/thumb/`／`images/full/` 兩種尺寸（文件第五節「圖片：兩件分開的工作」）→ 實際目錄各 55 張檔案存在。
- `loading="lazy"` 縮圖（文件未明講但符合「效能」精神）→ `index.html:307`。

**文件寫了但程式碼裡看不到（已被下一版設計明確撤銷，非疏漏）**：
- **視覺風格「暖白＋珊瑚橘」token**（文件第四節列出的 `--bg:#fffdf8`／`--accent:#ff6b45`）：這組值仍留在 `assets/kij.css:2-14` 的 `:root`，但被同檔 `body.kij`（`assets/kij.css:207-217`）覆寫成米白＋深綠，等於文件核准的原始視覺方向已被推翻、程式碼裡留了一份死碼版本。
- **店員模式（全螢幕覆蓋層、日文求助句「探しています」）**：文件第六節詳細規格（含深色資訊區、型號等寬字），程式碼中完全找不到 `店員`／`staff`／`overlay`／`探しています` 等關鍵字——已被 2026-08-09 文件明確要求「完整移除店員模式、圖片放大按鈕與日文求助浮層」。
- **收藏功能**：文件未直接規格但隱含在底部工具列描述「清單／地圖／結算／收藏」，程式碼與 2026-08-09 文件都確認已移除。
- **即時台銀匯率**（文件第六節「頁首：標題＋即時台銀匯率」）：`index.html` 頭部只有標題與商品數，無匯率相關程式碼；`v40_rate` 等舊鍵在新版也未見。此項在 2026-08-09 文件中未被提及延續或撤銷，屬於「靜默消失」，若使用者仍在意比價可能要在改版時決定去留。

### 5.2 `docs/superpowers/specs/2026-08-09-shopping-list-refresh-design.md`（第二版，較新）

此文件明確**推翻**了 2026-08-05 的店員模式／收藏設計，要求「移除收藏與店員模式」「一般商品採文字按鈕『未購買／已購買』；鞋款採『未試穿／已試穿』」「底部導覽保留清單、地圖、結算」。

**已實作**：
- 移除收藏與店員模式 → 確認程式碼中無相關殘留（見 5.1）。
- 一般商品「未購買／已購買」文字按鈕、鞋款「未試穿／已試穿」→ `index.html:293-301,410-415` 的 `syncCardVisual` 與 `buildCardHtml` 確實用文字按鈕，非圖示方框。
- 桌面雙欄大卡版面、與地圖頁一致的米白深綠風格 → `assets/kij.css:207-217,350-353`。
- `priceKind`／`priceSourceUrl`／`priceCheckedAt` 欄位與「價格待確認」文案 → `assets/products.js` 逐筆皆有這三欄；`index.html:171-177` 的 `PRICE_KIND_LABEL` 對照表與「價格待確認」文字。

**文件寫了但程式碼裡看不到（疑似之後又被拿掉，屬於落差，非確認撤銷）**：
- **「底部導覽保留清單、地圖、結算」**：文件明文要保留「結算」，但 `index.html:33-36` 的 `.kij-bottombar` 只有「清單」「地圖」兩項，沒有結算入口。更明確的證據是 `assets/kij.css:345` 仍留著 `.kij-checkout-row { display:flex; justify-content:space-between; ... }` 這條規則，但整個 repo（`index.html`、`map.html`）搜尋 `kij-checkout-row` 完全沒有任何元素使用它——**是一段孤兒 CSS，證明「結算」功能曾經存在後被拿掉，但沒人回頭刪這條規則、也沒人回頭確認文件要不要跟著改**。這是本次盤點中最明確的一處「規格與實作分岔」，建議改版時一併決定：要嘛把結算功能做回來，要嘛正式修訂文件並清掉孤兒 CSS。
- **商品搜尋／品牌搜尋**：`README.md` 功能列表寫「商品名稱與品牌搜尋」，但 `index.html` 全檔無任何 `<input>` 元素，README 這條看來是舊版殘留描述，與目前實作不符。

---

## 6. RWD 與行動裝置檢查（手機現場使用為主要情境）

- **Viewport**：兩頁皆正確設定 `width=device-width, initial-scale=1`（`index.html:5`、`map.html:5`），寫法略有差異（屬性順序不同）但效果相同，非問題。
- **觸控目標**：有全域 `--tap-min: 44px` token（`assets/kij.css:13`），且確實套用在分類頁籤（`assets/kij.css:94`）、底部工具列（`assets/kij.css:181`）、狀態按鈕（`assets/kij.css:302`）。但**數量加減按鈕在手機斷點被縮到 32px**（`assets/kij.css:365` `.kij-qty-btn { min-width: 32px; min-height: 32px; }`，於 `@media (max-width: 540px)` 內），低於 44px 門檻，且緊鄰放置容易誤觸——這是明確的觸控目標不足案例。
- **Sticky 元素**：頁首（`.kij-header`，`assets/kij.css:224-232`）、底部工具列（`.kij-bottombar`，`assets/kij.css:164-172`）、地圖頁篩選面板（`.filter-panel`，`map.html:113-128`）、地圖面板本身在桌機寬度會 sticky（`.map-panel`，`map.html:230-238`，手機寬度改回 static，`map.html:570`）。三層 sticky（頁首＋篩選＋地圖）在手機直式畫面上會共同侵占垂直空間，值得改版時實測是否過度擁擠。
- **圖片載入策略**：`index.html` 商品卡縮圖有 `loading="lazy"`（`index.html:307`）。**`map.html` 店卡的商品縮圖（44px）由 JS 動態建立卻沒有加 `loading="lazy"`**（`map.html:1144-1147`，`img.alt = p.name; img.src = p.image;` 兩行間沒有設定 `loading`），店家一多會一次載入所有縮圖，是可以順手補的效能小洞。圖片皆為 `.webp`（縮圖與原圖各 55 張），尺寸策略遵循設計文件（縮圖 200px／原圖 1200px 長邊），但盤點時未逐檔量測實際輸出尺寸是否落實。
- **地圖頁降級**：Leaflet CSS 載入失敗時有 `onerror="showMapFallback()"`（`map.html:23`）與對應 `#mapFallback` 畫面，是少見已經做好的錯誤處理範例，改版時應保留。

---

## 7. 讀 code 可見的明顯 UX／a11y 問題

| 問題 | 證據 | 說明 |
|---|---|---|
| **無 loading／骨架狀態** | 全檔搜尋 `spinner`／`骨架`／`skeleton` 零命中 | 地圖頁 Leaflet 初始化、店卡渲染皆無載入中提示；資料量小目前不明顯，但改版若接外部 API（例如真的接匯率）會需要。 |
| **`index.html` 無空狀態設計** | `index.html` 全檔搜尋不到任何「查無結果」文案或元素 | 目前分區永遠有內容所以不觸發，但若之後加搜尋／篩選，需要補上（`map.html:653-659` 已有可參考的既有範式）。 |
| **分區收合用 `<div role="button">` 而非原生 `<button>`** | `index.html:368` | 功能上用 `role="button" tabindex="0"` 加鍵盤事件（`index.html:544-551`）補救，可運作，但語意上不如原生 `<button>` 乾淨，螢幕報讀器對某些屬性（如 `disabled`）支援度較差。 |
| **`index.html`／`assets/kij.css` 完全沒有 `:focus-visible` 樣式** | `assets/kij.css` 431 行搜尋 `focus` 零命中；對照 `map.html:56-61` 有定義 `button:focus-visible, a:focus-visible { outline: 3px solid ... }` | 鍵盤操作者在**購物清單頁**（分類頁籤、數量按鈕、已試穿按鈕、分區收合）完全看不到目前焦點在哪，只有**地圖頁**因為內嵌了自己的 `<style>` 才有焦點框。這是共用 `kij.css` 應該補、卻只在 `map.html` 內嵌樣式裡做了的明確不一致案例。 |
| **分類色票僅四色，且色票與底色對比未經驗證** | `assets/kij.css:25-28` | 例如 `.kij-cat-electronics { color:#6b3fa0; background:#ece2fb; }` 紫底紫字、`.kij-cat-shoe` 藍底藍字，屬於「同色系深淺」配色，目測可讀但未做過 WCAG 對比度計算，改版時建議實測。 |
| **數量按鈕手機斷點縮到 32px，低於自訂的 44px 觸控門檻** | `assets/kij.css:365` | 見第 6 節。 |
| **`map.html` 店卡縮圖無 `loading="lazy"`** | `map.html:1144-1147` | 見第 6 節。 |
| **孤兒 CSS：`.kij-checkout-row` 定義了卻無任何元素使用** | `assets/kij.css:345`；全 repo 搜尋 `kij-checkout-row` 只有這一處定義、零處使用 | 對應第 5.2 節「結算」功能規格與實作分岔，屬於技術債，改版時應一併清理或補回功能。 |
| **`:root` 死碼 token 與實際生效值不一致，容易誤導後續維護者** | `assets/kij.css:2-14`（暖白珊瑚橘）被 `assets/kij.css:207-217`（米白深綠）覆寫 | 見第 2、5.1 節。任何人只看檔案開頭的 `:root` 會誤判目前配色，需要往下捲到第 207 行才看到真正生效的值。改版時建議直接刪掉第一組死碼、把 `body.kij` 那組實際生效值搬進 `:root`。 |
| **README 功能列表與實作不符** | `README.md` 寫「商品名稱與品牌搜尋」「社群推薦標示」，`index.html` 無 `<input>`、無社群推薦相關程式碼 | 非嚴重 bug，但文件失準，改版規劃時不應把 README 當作現況依據。 |
| **圖片放大連結非全站一致的「給店員看」體驗** | `index.html:307` 的 `<a>` 開新分頁顯示原圖，2026-08-09 文件已明確要「移除圖片放大按鈕」但實際仍保留一個簡化版（開新分頁而非浮層） | 屬於規格與實作的中間態：文件說要拿掉，程式碼拿掉了「浮層」但留了「開新分頁看大圖」這個較簡單的替代方案，未在任何文件中明確記錄這個折衷決定。 |

**未發現**：`<img>` 缺 `alt` 的情況（`index.html:307`、`map.html:1146` 皆有設定 `alt`）；按鈕誤用 `<div>` 且無鍵盤支援的情況（僅有的一處 `role="button"` 已補鍵盤事件）；顏色作為唯一資訊傳達手段的情況（分類色票皆搭配文字 pill，非純色塊）。

---

## 建立的檔案

- `/Users/xieh/Desktop/技術開發/KIJ-trip-shopping/docs/uxui-audit-2026-08-12.md`（本檔案，唯讀盤點任務，未修改其他任何檔案）
