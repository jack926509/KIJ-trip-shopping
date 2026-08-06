# KIJ 購物清單／地圖 UX/UI 改版 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 依 `docs/superpowers/specs/2026-08-05-kij-ux-redesign-design.md`（含 2026-08-06 追加的第十二、十三節）把 `index.html`、`map.html` 從各自為政、內嵌 3.7MB 圖片、無日文品名的現況，改為共用設計系統與單一資料源、真實照片、可拿給店員看的購物工具。

**Architecture:** 抽出 `assets/kij.css`（設計 token＋元件樣式）與 `assets/products.js`（單一資料陣列，ES module）供兩頁 `<script type="module">` 共讀；圖片統一經 Node 腳本（`sharp`）產出 `images/thumb/*.webp`（200px）與 `images/full/*.webp`（1200px）兩種尺寸；`index.html`／`map.html` 改為讀資料陣列渲染 DOM，不再手刻重複標記。

**Tech Stack:** 純靜態網頁（HTML／CSS／原生 JS ES module，無框架、無建置工具鏈）；Node 22（僅供開發期腳本：圖片轉檔、資料驗證，不進最終產物）；圖片處理用 `sharp`（libvips，支援 avif／webp 編解碼）；驗收用 Playwright MCP（headless Chrome 截圖與 DOM 檢查）。

## Global Constraints

- 一律繁體中文，絕對禁止簡體字（含程式註解與資料內容）。
- 中文與英文／數字之間加半形空格。
- **資料誠實原則**：`yen`／`jaName`／`officialUrl` 等欄位查無可靠來源一律填 `null`，不得估算或編造；`source` 欄位需指向 repo 內實際存在的檔案路徑。
- **不得破壞既有使用者狀態邏輯的精神**：localStorage 鍵一律改為以商品 `id` 為基礎（見 Task 7），首次載入需相容遷移舊鍵，讀不到就用預設值，不得拋錯中斷頁面。
- 所有可點擊元素觸控高度 ≥ 44px；商品勾選框 26px 見方。
- 本專案沒有既有測試框架與 `package.json`；本計畫新增的「測試」一律是可機械執行的 Node 驗證腳本或 Playwright 檢查，取代單元測試框架，效果對等（跑得動、綠燈才算過）。
- `index.html` 完成後總體積須 < 300 KB（現況 3.7 MB，改善來源是移除內嵌 base64 圖片）。
- 每個 Task 完成即 commit 一次，不累積多個 Task 的變更在同一個 commit。

---

## 檔案結構總覽

| 檔案 | 動作 | 責任 |
|---|---|---|
| `package.json` | 新增 | `sharp` devDependency；`npm run build:images`／`npm run validate:data` 兩個 script |
| `scripts/extract-embedded-images.mjs` | 新增 | 從現有 `index.html` 抓出 13 張內嵌 base64 真實照片，另存為 `images/source/<id>.<ext>` |
| `scripts/build-images.mjs` | 新增 | 讀 `images/build-manifest.json`，用 sharp 把每個來源檔轉成 `images/thumb/<id>.webp`（200px）與 `images/full/<id>.webp`（1200px） |
| `images/build-manifest.json` | 新增 | `{ productId: 來源檔相對路徑 }` 對照表，Task 5／6 共用 |
| `scripts/validate-products.mjs` | 新增 | 檢查 `assets/products.js` schema 完整性（見 Task 1） |
| `assets/products.js` | 新增 | 單一商品資料源（33 項），ES module，`export const PRODUCTS = [...]` |
| `assets/kij.css` | 新增 | 共用設計 token＋元件樣式（頁首、分區、卡片、勾選框、底部工具列、店員模式、地圖店卡） |
| `index.html` | 重寫 | 購物清單頁：頁首／進度條／分類頁籤／可收合分區／商品卡／店員模式／底部工具列 |
| `map.html` | 重寫 | 地圖頁：套用 `kij.css`、修色票、新增小倉商圈、店家可買品項連動 |
| `個人生活/.../90 附件/購物清單/` 三張新照片 | 複製 | 複製進 `images/source/` 供 Task 6 處理 |

---

## Task 1：工具鏈骨架與資料驗證腳本

**Files:**
- Create: `package.json`
- Create: `scripts/validate-products.mjs`
- Test: 直接執行 `scripts/validate-products.mjs`（無獨立測試檔，腳本本身就是驗證器）

**Interfaces:**
- Consumes: 無（此任務不依賴其他任務）
- Produces: `npm run validate:data` 指令；`scripts/validate-products.mjs` 匯出的驗證規則會被 Task 4、Task 5 的驗收步驟呼叫

- [ ] **Step 1：建立 `package.json`**

```json
{
  "name": "kij-trip-shopping",
  "private": true,
  "type": "module",
  "scripts": {
    "build:images": "node scripts/build-images.mjs",
    "validate:data": "node scripts/validate-products.mjs"
  },
  "devDependencies": {
    "sharp": "^0.33.5"
  }
}
```

- [ ] **Step 2：安裝依賴**

Run: `cd "/Users/xieh/Desktop/技術開發/KIJ-trip-shopping" && npm install`
Expected: 成功安裝，產生 `node_modules/`（需加進 `.gitignore`，見 Step 6）

- [ ] **Step 3：寫 `scripts/validate-products.mjs`**

```js
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

async function loadProducts() {
  const mod = await import(path.join(ROOT, 'assets/products.js'));
  return mod.PRODUCTS;
}

function fail(errors) {
  console.error(`✗ 驗證失敗，共 ${errors.length} 項問題：`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const VALID_GROUP = new Set(['shopping', 'dryer', 'shoes']);
const VALID_TRACKING = new Set(['buy', 'try']);

const products = await loadProducts();
const errors = [];
const seenIds = new Set();

if (!Array.isArray(products) || products.length === 0) {
  fail(['PRODUCTS 必須是非空陣列']);
}

for (const p of products) {
  const label = p.id || '(缺 id)';

  if (!p.id || typeof p.id !== 'string') errors.push(`${label}: id 缺漏或非字串`);
  if (seenIds.has(p.id)) errors.push(`${label}: id 重複`);
  seenIds.add(p.id);

  if (!VALID_GROUP.has(p.group)) errors.push(`${label}: group 不合法（${p.group}）`);
  if (!VALID_TRACKING.has(p.tracking)) errors.push(`${label}: tracking 不合法（${p.tracking}）`);

  if (typeof p.name !== 'string' || p.name.length === 0) errors.push(`${label}: name 缺漏`);

  if (p.jaName !== null && typeof p.jaName !== 'string') errors.push(`${label}: jaName 必須是 null 或字串`);
  if (p.model !== null && typeof p.model !== 'string') errors.push(`${label}: model 必須是 null 或字串`);

  if (p.yen !== null && typeof p.yen !== 'number') errors.push(`${label}: yen 必須是 null 或數字`);
  if (p.twdRef !== null && typeof p.twdRef !== 'number') errors.push(`${label}: twdRef 必須是 null 或數字`);

  if (p.tracking === 'buy') {
    if (typeof p.defaultQty !== 'number' || p.defaultQty < 1) errors.push(`${label}: tracking=buy 時 defaultQty 必須 ≥ 1`);
  } else if (p.tracking === 'try') {
    if (p.defaultQty !== null) errors.push(`${label}: tracking=try 時 defaultQty 必須是 null`);
  }

  if (typeof p.image !== 'string' || p.image.length === 0) errors.push(`${label}: image 缺漏`);

  if (p.yen !== null) {
    if (typeof p.source !== 'string' || p.source.length === 0) {
      errors.push(`${label}: yen 非 null 時 source 不得為空`);
    } else if (!existsSync(path.join(ROOT, p.source))) {
      errors.push(`${label}: source 指向的檔案不存在（${p.source}）`);
    }
  }

  if (!Array.isArray(p.stores)) errors.push(`${label}: stores 必須是陣列（無資料填 []，不得省略欄位）`);

  // 簡體字掃描（僅檢查中文欄位，粗略但足以攔截明顯誤植）
  const SIMPLIFIED_MARKERS = ['产', '业', '国', '这', '为', '来', '发', '经', '现', '会', '与', '实', '万', '价'];
  for (const field of ['name', 'note']) {
    const val = p[field];
    if (typeof val === 'string' && SIMPLIFIED_MARKERS.some((ch) => val.includes(ch))) {
      errors.push(`${label}: ${field} 疑似含簡體字（"${val}"）`);
    }
  }
}

if (errors.length > 0) fail(errors);

console.log(`✓ 驗證通過：${products.length} 項商品，${seenIds.size} 個唯一 id`);
```

- [ ] **Step 4：建立最小 `assets/products.js` 讓驗證腳本能跑（先放 1 筆假資料，Task 4 會整個覆寫）**

```js
export const PRODUCTS = [
  {
    id: 'placeholder-item',
    group: 'shopping',
    tracking: 'buy',
    category: '日用品',
    name: '暫用測試商品',
    jaName: null,
    model: null,
    yen: null,
    twdRef: null,
    defaultQty: 1,
    image: 'images/thumb/placeholder-item.webp',
    note: '此筆為 Task 1 佔位資料，Task 4 會整份覆寫',
    source: '',
    stores: []
  }
];
```

- [ ] **Step 5：跑驗證，確認綠燈**

Run: `npm run validate:data`
Expected: `✓ 驗證通過：1 項商品，1 個唯一 id`

- [ ] **Step 6：`.gitignore` 加入 `node_modules/`**

檢查現有 `.gitignore`（已知含 `.superpowers/`），追加一行 `node_modules/`。

- [ ] **Step 7：Commit**

```bash
git add package.json package-lock.json scripts/validate-products.mjs assets/products.js .gitignore
git commit -m "chore: 建立工具鏈骨架與商品資料驗證腳本"
```

---

## Task 2：抽出既有 13 張內嵌真實照片

**Files:**
- Create: `scripts/extract-embedded-images.mjs`
- Modify: 無（`index.html` 在此任務保持原樣，Task 7 才重寫）
- Test: 執行後檢查 `images/source/` 產出檔案數

**Interfaces:**
- Consumes: 現有 `index.html`（未經修改的原始版本）
- Produces: `images/source/<slug>.<ext>` 檔案群，供 Task 6 的 `images/build-manifest.json` 引用

- [ ] **Step 1：寫抽取腳本**

腳本邏輯：讀 `index.html` 全文，用正則找出所有 `<article ...id="([^"]+)"[^>]*>[\s\S]*?<img[^>]+src="(data:image\/[a-z]+;base64,[^"]+)"` 的配對（`.review-card` 與 `class="card shoe"` 排除，因為前者非商品、後者已有實體檔案在 `images/on|hoka/`，見 Task 5），把 base64 解碼寫成檔案。

```js
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const html = readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const outDir = path.join(ROOT, 'images/source');
mkdirSync(outDir, { recursive: true });

const articleRe = /<article\b([^>]*)>([\s\S]*?)<\/article>/g;
let match;
let extracted = 0;
const manifest = {};

while ((match = articleRe.exec(html))) {
  const [, attrs, body] = match;
  if (/class="[^"]*review-card/.test(attrs)) continue;
  if (/class="[^"]*\bshoe\b/.test(attrs)) continue;

  const idMatch = attrs.match(/\bid="([^"]+)"/);
  if (!idMatch) continue;
  const id = idMatch[1];

  const imgMatch = body.match(/<img[^>]+src="data:image\/([a-z]+);base64,([^"]+)"/);
  if (!imgMatch) continue; // 外部檔案圖片（7 張）不在此腳本處理範圍

  const [, ext, b64] = imgMatch;
  const fileExt = ext === 'jpeg' ? 'jpg' : ext;
  const outPath = path.join(outDir, `${id}.${fileExt}`);
  writeFileSync(outPath, Buffer.from(b64, 'base64'));
  manifest[id] = `images/source/${id}.${fileExt}`;
  extracted++;
}

console.log(`抽出 ${extracted} 張內嵌照片 → images/source/`);
console.log(JSON.stringify(manifest, null, 2));
```

- [ ] **Step 2：執行腳本**

Run: `node scripts/extract-embedded-images.mjs`
Expected: 印出 `抽出 13 張內嵌照片`（若不是 13，需先核對 `index.html` 現況第三節的統計是否仍準確——現況可能因先前小幅編輯而有出入，以實跑數字為準，不強行湊 13）

- [ ] **Step 3：人工檢查抽出的檔案能正常開啟**

Run: `file images/source/*.jpg images/source/*.png images/source/*.webp 2>/dev/null`
Expected: 每個檔案回報正確的圖片格式，無 `empty` 或 `data`（代表損毀）

- [ ] **Step 4：把腳本印出的 manifest JSON 存下來**，貼進 Task 6 的 `images/build-manifest.json` 草稿（先手動記錄，Task 6 會正式建檔）

- [ ] **Step 5：Commit**

```bash
git add scripts/extract-embedded-images.mjs images/source/
git commit -m "feat: 抽出既有內嵌 base64 真實商品照片"
```

---

## Task 3：複製 3 項新商品照片進 repo

**Files:**
- Create: `images/source/hasameru-sponge.jpeg`
- Create: `images/source/belt-fan.jpeg`
- Create: `images/source/chawanmushi-no-moto.jpg`

**Interfaces:**
- Consumes: 使用者提供的原始照片（路徑見下）
- Produces: `images/source/` 內三個新檔案，供 Task 6 manifest 引用

- [ ] **Step 1：複製檔案**

```bash
SRC="/Users/xieh/Desktop/個人生活/旅遊規劃/10 旅程/2026/2026-09-03_北九州/90 附件/購物清單"
cp "$SRC/はさめるスポンジ.jpeg" images/source/hasameru-sponge.jpeg
cp "$SRC/ベルトファン.jpeg" images/source/belt-fan.jpeg
cp "$SRC/茶碗蒸しのもと.jpg" images/source/chawanmushi-no-moto.jpg
```

- [ ] **Step 2：確認複製成功**

Run: `ls -la images/source/hasameru-sponge.jpeg images/source/belt-fan.jpeg images/source/chawanmushi-no-moto.jpg`
Expected: 三個檔案皆存在且檔案大小 > 0

- [ ] **Step 3：Commit**

```bash
git add images/source/hasameru-sponge.jpeg images/source/belt-fan.jpeg images/source/chawanmushi-no-moto.jpg
git commit -m "feat: 加入 3 項新商品的原始照片"
```

---

## Task 4：撰寫 `assets/products.js`（33 項商品資料，覆寫 Task 1 佔位資料）

**Files:**
- Modify: `assets/products.js`（整份覆寫 Task 1 的佔位內容）
- Test: `npm run validate:data`

**Interfaces:**
- Consumes: 現有 `index.html`（讀取 32 個 `<article>` 卡片的 `data-price`／`data-unit-price`／`data-default-qty`／顯示文字／既有日文片假名片段）、`docs/japan-product-prices-2026-08-01.md`、`docs/dryer-price-research-2026-08-01.md`（價格與日文品名查證來源）、本計畫 Task 2／3 產出的 `images/source/` 檔名、design spec 第五、十二節的欄位定義
- Produces: `export const PRODUCTS` 陣列，供 Task 5（圖片 manifest）、Task 7（`index.html`）、Task 8（`map.html`）共用

**執行者須知：這是資料萃取任務，不是憑空編寫。**

- [ ] **Step 1：讀取 `index.html` 全文，逐一列出 30 個商品型 `<article>`（18 shopping + 2 dryer + 10 shoe，排除 2 個 `.review-card`）的既有欄位**

對每個 article 記錄：`id`（若原本沒有 `id` 屬性，依品名自訂一個 kebab-case slug，例如「EBISU 優質牙刷」→ `ebisu-premium-care`）、`data-group`、`data-category`（若有）、顯示的中文品名、`data-price`（yen）、`data-unit-price`、`data-default-qty`、卡片內任何既有的片假名片段（可能是不完整的日文名或型號提示）。

- [ ] **Step 2：日文品名與型號查證**

對每個非鞋款商品，用 `docs/japan-product-prices-2026-08-01.md`、`docs/dryer-price-research-2026-08-01.md` 查證正式日文品名（`jaName`）與型號（`model`）。查得到就填入查證結果；**查不到就填 `null`，不得用中文名直翻或憑印象填寫**。10 款鞋子維持現況：無日文品名資料則 `jaName: null`（鞋款多半只有英文品牌／型號，如有官方日文頁面可查則填，查無則 `null`）。

- [ ] **Step 3：套用第八節既有缺陷修正**

- EH-NE7N：`yen` 統一用 `6630`（不用畫面曾寫死的 10470）。
- 3 款鞋子原本顯示「官網定價」但來源不可追溯者：`yen: null`，`source: ''`。
- HaRENO 牙刷：`note` 或 `model` 欄位的「螺旋刷毛」／「一般刷毛」矛盾擇一（以官方頁面查證結果為準；查不到則採用較晚寫入、較可能是修正後的說法，並在此步驟註明採用理由，不留矛盾）。

- [ ] **Step 4：為每個商品填 `image` 欄位，指向 Task 5 將產出的路徑**

規則：非鞋款商品一律 `images/thumb/<id>.webp`（清單卡片用縮圖，`index.html` 渲染店員模式時另組 `images/full/<id>.webp` 路徑，不需存在 `products.js` 裡，因為 thumb/full 只差資料夾名稱，程式端用字串取代即可，見 Task 7）。鞋款商品同規則，`<id>` 對應 Task 5 manifest 的 10 個鞋款 id。

- [ ] **Step 5：填 `stores` 欄位**

依 `map.html` 現有 9 家店＋ Task 8 新增的 12 家小倉／天神店家 id，逐一標註「這家店已知在賣這項商品」的組合。**只有明確可考證（例如吹風機、藥妝類商品在藥妝連鎖店；DAISO／3COINS 賣的生活雜貨類；鞋款只對應 HOKA／On 專賣或授權通路）才填；無法判斷就填 `[]`，不得亂猜**。

- [ ] **Step 6：3 項新商品資料**

直接採用設計規格第十二節的表格內容：

```js
  {
    id: 'hasameru-sponge',
    group: 'shopping',
    tracking: 'buy',
    category: '日用品',
    name: '掛勾式浴室海綿',
    jaName: 'はさめるスポンジ',
    model: null,
    yen: null,
    twdRef: null,
    defaultQty: 1,
    image: 'images/thumb/hasameru-sponge.webp',
    note: '水沖就能去污垢的浴室海綿，掛在水龍頭上方便晾乾。',
    source: '',
    stores: []
  },
  {
    id: 'belt-fan',
    group: 'shopping',
    tracking: 'buy',
    category: '3C 配件',
    name: '腰間夾式風扇',
    jaName: 'ベルトファン',
    model: null,
    yen: 1980,
    twdRef: null,
    defaultQty: 1,
    image: 'images/thumb/belt-fan.webp',
    note: '手拿風扇太占手，這款夾在腰帶上把風送進衣服裡，雙手能空出來。',
    source: 'docs/superpowers/specs/2026-08-05-kij-ux-redesign-design.md',
    stores: []
  },
  {
    id: 'chawanmushi-no-moto',
    group: 'shopping',
    tracking: 'buy',
    category: '食品伴手禮',
    name: '茅乃舍 茶碗蒸し的素',
    jaName: '茶碗蒸しのもと',
    model: null,
    yen: null,
    twdRef: null,
    defaultQty: 1,
    image: 'images/thumb/chawanmushi-no-moto.webp',
    note: '久原本家茅乃舍出品，加水加蛋就能做茶碗蒸的高湯調味包。',
    source: '',
    stores: []
  }
```

- [ ] **Step 7：組成完整 `assets/products.js`（33 筆），覆寫 Task 1 的佔位內容**

檔案開頭固定：

```js
// 單一商品資料源。index.html 與 map.html 皆從此檔讀取，不得各自維護副本。
export const PRODUCTS = [
  // ...Step 1-6 產出的 33 筆物件
];
```

- [ ] **Step 8：跑驗證**

Run: `npm run validate:data`
Expected: `✓ 驗證通過：33 項商品，33 個唯一 id`（若因 `source` 指向的路徑尚不存在而報錯屬正常——`belt-fan` 的 source 指向本規格檔，需確認該檔案路徑存在；其餘 `yen:null` 商品不受此檢查影響）

- [ ] **Step 9：Commit**

```bash
git add assets/products.js
git commit -m "feat: 建立 33 項商品的單一資料源 products.js"
```

---

## Task 5：圖片建置 manifest 與 sharp 轉檔腳本

**Files:**
- Create: `images/build-manifest.json`
- Create: `scripts/build-images.mjs`
- Test: 執行後檢查 `images/thumb/`／`images/full/` 檔案數與尺寸

**Interfaces:**
- Consumes: `images/source/*`（Task 2、3 產出）、`images/on/*.avif`、`images/hoka/*.jpeg`（既有鞋款照片）、`assets/products.js` 的 33 個 `id`（Task 4 產出，用於檢查 manifest 是否覆蓋所有商品）
- Produces: `images/thumb/<id>.webp`（200px 長邊）、`images/full/<id>.webp`（1200px 長邊），供 Task 7、Task 4 Step 4 引用的路徑實際存在

- [ ] **Step 1：建立 `images/build-manifest.json`**

內容＝ Task 2 腳本印出的 13 筆 + Task 3 的 3 筆 + 既有 7 張外部檔案（實際檔名需在此步驟用 `ls images/` 現有子目錄核對，以 Task 2 執行時 `index.html` 裡找到的外部 `src="images/..."` 路徑為準）+ 10 筆鞋款對照：

```json
{
  "cloudtilt": "images/on/cloudtilt-side.avif",
  "cloudsurfermax": "images/on/cloudsurfer-max-side.avif",
  "cloudsurfer2": "images/on/cloudsurfer-2-side.avif",
  "cloud6": "images/on/cloud-6-side.avif",
  "cloudrunner3": "images/on/cloudrunner-3-side.avif",
  "clifton11": "images/hoka/clifton-11.jpeg",
  "bondi9": "images/hoka/bondi-9.jpeg",
  "skyflow": "images/hoka/skyflow.jpeg",
  "transport2": "images/hoka/transport-2.jpeg",
  "gaviota5": "images/hoka/gaviota-5.jpeg",
  "hasameru-sponge": "images/source/hasameru-sponge.jpeg",
  "belt-fan": "images/source/belt-fan.jpeg",
  "chawanmushi-no-moto": "images/source/chawanmushi-no-moto.jpg"
}
```

（其餘 17 筆——13 張 Task 2 抽出的內嵌照片＋既有 7 張外部檔案中未在此列出的部分——在實作時把 Task 2 腳本印出的 manifest JSON 與 `index.html` 現有 `src="images/..."` 的外部參照補進這個檔案，鍵名須與 `assets/products.js` 的 `id` 完全一致，否則 Step 3 的覆蓋率檢查會報錯攔下。）

- [ ] **Step 2：寫 `scripts/build-images.mjs`**

```js
import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'images/build-manifest.json'), 'utf8'));

mkdirSync(path.join(ROOT, 'images/thumb'), { recursive: true });
mkdirSync(path.join(ROOT, 'images/full'), { recursive: true });

let ok = 0;
let failed = [];

for (const [id, relSrc] of Object.entries(manifest)) {
  const srcPath = path.join(ROOT, relSrc);
  if (!existsSync(srcPath)) {
    failed.push(`${id}: 來源檔不存在（${relSrc}）`);
    continue;
  }
  try {
    await sharp(srcPath).resize({ width: 200, height: 200, fit: 'inside' }).webp({ quality: 82 })
      .toFile(path.join(ROOT, `images/thumb/${id}.webp`));
    await sharp(srcPath).resize({ width: 1200, height: 1200, fit: 'inside' }).webp({ quality: 85 })
      .toFile(path.join(ROOT, `images/full/${id}.webp`));
    ok++;
  } catch (err) {
    failed.push(`${id}: 轉檔失敗（${err.message}）`);
  }
}

console.log(`✓ 完成 ${ok} 項，thumb/full 各一張`);
if (failed.length > 0) {
  console.error(`✗ ${failed.length} 項失敗：`);
  failed.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
```

- [ ] **Step 3：在 `scripts/validate-products.mjs` 追加圖片覆蓋率檢查（修改 Task 1 的檔案）**

在既有迴圈的 `image` 欄位檢查之後追加：

```js
  const thumbPath = path.join(ROOT, 'images/thumb', `${p.id}.webp`);
  if (!existsSync(thumbPath)) errors.push(`${label}: 找不到對應的 images/thumb/${p.id}.webp（先跑 npm run build:images）`);
```

- [ ] **Step 4：執行轉檔**

Run: `npm run build:images`
Expected: `✓ 完成 33 項，thumb/full 各一張`

- [ ] **Step 5：跑資料驗證，確認圖片覆蓋率檢查也綠燈**

Run: `npm run validate:data`
Expected: `✓ 驗證通過：33 項商品，33 個唯一 id`

- [ ] **Step 6：抽查檔案大小與尺寸**

Run: `sips -g pixelWidth -g pixelHeight images/thumb/ebisu-premium-care.webp images/full/ebisu-premium-care.webp 2>&1; du -sh images/thumb images/full`
Expected: thumb 長邊 ≤ 200px、full 長邊 ≤ 1200px；`images/thumb`＋`images/full` 兩資料夾合計遠小於原本 3.7MB（33 張縮圖＋33 張大圖，預期在數 MB 等級）

- [ ] **Step 7：Commit**

```bash
git add images/build-manifest.json scripts/build-images.mjs scripts/validate-products.mjs images/thumb images/full
git commit -m "feat: 建立圖片轉檔管線，產出全部商品的 thumb/full webp"
```

---

## Task 6：`assets/kij.css` 共用設計系統

**Files:**
- Create: `assets/kij.css`
- Test: 視覺檢查併入 Task 9 的 Playwright 驗收；本任務只需確認語法正確可載入

**Interfaces:**
- Consumes: design spec 第四節的 CSS 變數表與分類色票表
- Produces: `--bg`／`--surface`／`--accent`／`--accent-soft`／`--text`／`--muted`／`--line`／`--radius-card`／`--radius-pill`／`--shadow-card`／`--tap-min` 等 CSS 變數，`.kij-cat-drug`／`.kij-cat-food`／`.kij-cat-electronics`／`.kij-cat-shoe` 分類色票 class，`.kij-header`／`.kij-progress`／`.kij-tabs`／`.kij-section`／`.kij-card`／`.kij-checkbox`／`.kij-bottombar`／`.kij-clerk-overlay` 元件 class，供 Task 7、Task 8 直接套用

- [ ] **Step 1：撰寫檔案**

```css
/* KIJ 共用設計系統：index.html、map.html 皆引用此檔，顏色與間距不得在頁面內覆寫 */
:root {
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
}

* { box-sizing: border-box; }

body.kij {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", sans-serif;
}

.kij-cat-drug { color: #0a7a6a; background: #d7f5ee; }
.kij-cat-food { color: #a04a10; background: #ffe7d8; }
.kij-cat-electronics { color: #6b3fa0; background: #ece2fb; }
.kij-cat-shoe { color: #1f5fa8; background: #dceafb; }

.kij-pill {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-pill);
}

.kij-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg);
  box-shadow: 0 2px 10px rgba(180, 120, 80, .08);
  padding-bottom: 10px;
}

.kij-header .title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 15px 11px;
}

.kij-header .title-row b {
  font-size: 17px;
  font-weight: 800;
  color: var(--accent);
}

.kij-header .title-row span {
  font-size: 11px;
  color: var(--muted);
}

.kij-progress {
  margin: 0 15px 12px;
  background: var(--accent-soft);
  border-radius: 14px;
  padding: 11px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kij-progress .label { font-size: 12px; color: #a04a10; font-weight: 700; }
.kij-progress .total { font-size: 19px; font-weight: 800; color: var(--accent); }

.kij-tabs {
  display: flex;
  gap: 8px;
  padding: 0 15px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.kij-tab {
  font-size: 12.5px;
  font-weight: 700;
  padding: 9px 15px;
  border-radius: var(--radius-pill);
  background: #f3ede6;
  color: #6f6459;
  white-space: nowrap;
  min-height: var(--tap-min);
  display: flex;
  align-items: center;
  border: none;
  cursor: pointer;
}

.kij-tab.active {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 3px 10px rgba(255, 107, 69, .35);
}

.kij-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 4px 10px;
  cursor: pointer;
  min-height: var(--tap-min);
}

.kij-section-header b { font-size: 14.5px; font-weight: 800; }
.kij-section-header .count { font-size: 11.5px; color: var(--muted); font-weight: 600; }

.kij-card {
  background: var(--surface);
  border-radius: var(--radius-card);
  padding: 11px;
  box-shadow: var(--shadow-card);
  margin-bottom: 10px;
  display: flex;
  gap: 11px;
  align-items: flex-start;
}

.kij-card .thumb {
  width: 66px;
  height: 66px;
  border-radius: 11px;
  background: #f7f2ea;
  flex: none;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: none;
  padding: 0;
}

.kij-card .thumb img { width: 100%; height: 100%; object-fit: contain; }

.kij-card .thumb::after {
  content: "⤢";
  position: absolute;
  right: 3px;
  bottom: 1px;
  font-size: 11px;
  color: #fff;
  background: rgba(43, 33, 24, .55);
  border-radius: 5px;
  padding: 0 4px;
}

.kij-card .mid { flex: 1; min-width: 0; }
.kij-card h5 { font-size: 13.5px; font-weight: 800; margin: 5px 0 2px; }
.kij-card .ja { font-size: 10.5px; color: var(--muted); }
.kij-card .price-row { display: flex; align-items: baseline; gap: 7px; margin-top: 7px; }
.kij-card .yen { font-size: 18px; font-weight: 800; color: var(--accent); }
.kij-card .twd { font-size: 10px; color: var(--muted); }

.kij-checkbox {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 2px solid #e0d5c8;
  flex: none;
  background: none;
  cursor: pointer;
  position: relative;
  padding: 0;
}

.kij-checkbox.on {
  background: var(--accent);
  border-color: var(--accent);
}

.kij-checkbox.on::after {
  content: "✓";
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kij-bottombar {
  position: sticky;
  bottom: 0;
  display: flex;
  background: var(--surface);
  border-top: 1px solid var(--line);
  padding: 10px 0 max(14px, env(safe-area-inset-bottom));
  z-index: 10;
}

.kij-bottombar a, .kij-bottombar button {
  flex: 1;
  text-align: center;
  font-size: 10.5px;
  color: #a99e93;
  background: none;
  border: none;
  min-height: var(--tap-min);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  cursor: pointer;
}

.kij-bottombar .active { color: var(--accent); font-weight: 800; }
.kij-bottombar i { font-size: 19px; font-style: normal; }

.kij-clerk-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--surface);
  display: none;
  flex-direction: column;
}

.kij-clerk-overlay.show { display: flex; }

.kij-clerk-overlay .bar {
  background: #2b2118;
  color: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: var(--tap-min);
}

.kij-clerk-overlay .bar button {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  min-width: var(--tap-min);
  min-height: var(--tap-min);
  cursor: pointer;
}

.kij-clerk-overlay .big {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.kij-clerk-overlay .big img { max-width: 100%; max-height: 100%; object-fit: contain; }

.kij-clerk-overlay .info {
  background: #2b2118;
  color: #fff;
  padding: 16px 20px calc(20px + env(safe-area-inset-bottom));
  text-align: center;
}

.kij-clerk-overlay .jpn { font-size: 19px; font-weight: 800; line-height: 1.4; }
.kij-clerk-overlay .model { font-family: ui-monospace, Menlo, monospace; font-size: 15px; font-weight: 700; color: #ffb08c; margin-top: 7px; }
.kij-clerk-overlay .ask { font-size: 13.5px; margin-top: 11px; background: rgba(255, 255, 255, .13); border-radius: 9px; padding: 8px 10px; line-height: 1.5; }
.kij-clerk-overlay .qty { font-size: 12px; color: #c9bdb0; margin-top: 9px; }

.kij-img-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  color: var(--muted);
  background: var(--accent-soft);
}
```

- [ ] **Step 2：語法檢查（無 CSS linter，改用瀏覽器載入驗證，併入 Task 9）**

此任務先跳過獨立驗證，Task 9 的 Playwright 截圖若版面正常即代表 CSS 語法正確可解析。

- [ ] **Step 3：Commit**

```bash
git add assets/kij.css
git commit -m "feat: 建立共用設計系統 kij.css"
```

---

## Task 7：重寫 `index.html`

**Files:**
- Modify: `index.html`（整份重寫，保留 `<head>` 的 meta／viewport，body 全部替換）
- Test: Task 9 的 Playwright 端對端檢查；本任務內先跑手動 DOM 檢查（Step 5、6）

**Interfaces:**
- Consumes: `assets/kij.css`（Task 6）、`assets/products.js` 的 `PRODUCTS` 陣列（Task 4）
- Produces: 頁面 `id="app"` 掛載點；`window.__kijState`（供 Task 9 驗收腳本讀取已勾選狀態，僅供測試用途，不作為正式 API）

- [ ] **Step 1：`<head>` 引入共用 CSS 與資料模組**

```html
<link rel="stylesheet" href="assets/kij.css">
<script type="module" src="assets/products.js"></script>
```

- [ ] **Step 2：撰寫渲染邏輯（`<script type="module">`，重點結構如下，實作時展開成完整檔案）**

核心資料流：`import { PRODUCTS } from './assets/products.js'` → 依 `group` 分三區（`shopping`／`dryer`／`shoes`）渲染可收合分區 → 每個分區內再依 `category`（僅 `shopping` 群組有子分類）分組成商品卡列表。

狀態鍵一律 `kij_bought_<id>`、`kij_qty_<id>`、`kij_tried_<id>`（鞋款）、`kij_fav_<id>`、`kij_section_<group>_collapsed`，讀取順序：先試新鍵，讀不到就檢查舊鍵（`localStorage` 內以 `_persist_` 或既有 `keyFor` 產生的鍵，***實作時對照現有 `index.html` 的 `keyFor` 函式邏輯抓出舊鍵格式***）做一次性搬遷、寫回新鍵後刪除舊鍵；都讀不到就用 `defaultQty`／`false` 預設值。

分類頁籤「跳轉＋聚焦」行為：

```js
function focusSection(groupOrAll) {
  document.querySelectorAll('.kij-section').forEach((section) => {
    const show = groupOrAll === 'all' || section.dataset.group === groupOrAll;
    section.querySelector('.kij-section-body').hidden = !show;
    section.querySelector('.kij-section-header').setAttribute('aria-expanded', String(show));
  });
  if (groupOrAll !== 'all') {
    document.querySelector(`[data-group="${groupOrAll}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
```

店員模式開關：

```js
function openClerkMode(product) {
  const overlay = document.getElementById('clerkOverlay');
  const fullImgSrc = product.image.replace('images/thumb/', 'images/full/');
  overlay.querySelector('.big img').src = fullImgSrc;
  const jpnEl = overlay.querySelector('.jpn');
  if (product.jaName) {
    jpnEl.hidden = false;
    jpnEl.textContent = product.jaName;
  } else {
    jpnEl.hidden = true;
  }
  overlay.querySelector('.model').textContent = product.model || '';
  overlay.querySelector('.model').hidden = !product.model;
  const qtyEl = overlay.querySelector('.qty');
  if (product.tracking === 'buy') {
    const qty = getQty(product.id);
    qtyEl.textContent = product.yen != null
      ? `要買 ${qty} 個・參考價 ¥${product.yen.toLocaleString()}`
      : `要買 ${qty} 個`;
  } else {
    qtyEl.textContent = '想試穿的尺寸：現場記錄';
  }
  overlay.classList.add('show');
}
```

日文求助句固定寫死在 HTML 模板裡（不放進 `products.js`，因為每個商品都一樣，屬 UI 文案不是資料）：

```html
<p class="ask">この商品を探しています。<br>置き場所を教えていただけますか？</p>
```

圖片載入失敗處理：

```js
img.addEventListener('error', () => {
  img.replaceWith(makeFallback(product.name[0]));
}, { once: true });
```

底部工具列固定四個按鈕（清單為當前頁 `active`，地圖連往 `map.html`，結算捲到頁面內結算區塊，收藏篩選只顯示 `kij_fav_*` 為真的商品）。

結算加總邏輯：

```js
function computeTotal() {
  return PRODUCTS
    .filter((p) => p.tracking === 'buy' && p.yen != null)
    .reduce((sum, p) => sum + p.yen * getQty(p.id), 0);
}
```

- [ ] **Step 3：進度條文案**

```js
const buyItems = PRODUCTS.filter((p) => p.tracking === 'buy');
const boughtCount = buyItems.filter((p) => isBought(p.id)).length;
progressLabel.textContent = `已買 ${boughtCount} / ${buyItems.length} 項`;
```

- [ ] **Step 4：鞋款分區顯示「已試穿」**

```js
const shoeItems = PRODUCTS.filter((p) => p.group === 'shoes');
const triedCount = shoeItems.filter((p) => isTried(p.id)).length;
shoeSectionHeader.querySelector('.count').textContent = `已試穿 ${triedCount} / ${shoeItems.length}`;
```

- [ ] **Step 5：手動驗證頁面能載入（先用檔案協定開，之後 Task 9 用 Playwright 正式驗）**

Run: `python3 -m http.server 8811 --directory "/Users/xieh/Desktop/技術開發/KIJ-trip-shopping"`（背景執行）
用瀏覽器開 `http://localhost:8811/index.html`，人工確認：33 張商品卡都有渲染、無 JS console 錯誤。

- [ ] **Step 6：檢查體積**

Run: `du -h index.html`
Expected: < 300 KB

- [ ] **Step 7：Commit**

```bash
git add index.html
git commit -m "feat: 重寫購物清單頁，改用共用資料源與設計系統"
```

---

## Task 8：重寫 `map.html`（含小倉商圈合併）

**Files:**
- Modify: `map.html`（套用 `kij.css`、修正資料與渲染邏輯，Leaflet 載入與離線降級機制不動）
- Test: Task 9 的 Playwright 端對端檢查

**Interfaces:**
- Consumes: `assets/kij.css`、`assets/products.js` 的 `PRODUCTS`（讀 `stores` 欄位做反查）、design spec 第七、十三節
- Produces: `map.html` 內的 `STORES` 陣列（21 家：既有 9 家＋新增 12 家）、`AREA_LABELS`（新增 `kokura: '小倉'`）

- [ ] **Step 1：`<head>` 引入共用 CSS，`<title>`／頁首標題改為「小倉・博多・天神購物地圖」**

- [ ] **Step 2：`STORES` 陣列新增 12 筆（小倉 6 ＋天神 6），沿用design spec 第十三節的資料合併結論**

```js
// 小倉商圈
{
  id: 'matsumoto-kiyoshi-kokura-station-south',
  name: '松本清 小倉站南口店',
  brand: '松本清',
  category: 'drug',
  area: 'kokura',
  address: '福岡縣北九州市小倉北區京町 2-4-27',
  hours: '07:00–24:00',
  note: '離小倉站南口很近，適合回飯店前補貨。',
  lat: 33.88593,
  lng: 130.88137,
  officialUrl: 'https://www.matsukiyococokara-online.com/map/?kid=20805475',
  officialSources: [
    { label: '松本清官方門市頁', url: 'https://www.matsukiyococokara-online.com/map/?kid=20805475' }
  ],
  mapsQuery: 'マツモトキヨシ 小倉駅南口店'
},
{
  id: 'cocokara-fine-kokura-station',
  name: 'Cocokara Fine 小倉站店',
  brand: 'Cocokara Fine',
  category: 'drug',
  area: 'kokura',
  address: '福岡縣北九州市小倉北區淺野 1-1-1',
  hours: '09:00–22:00',
  note: '位於小倉站商場地下樓層。',
  lat: 33.88684,
  lng: 130.88272,
  officialUrl: 'https://www.matsukiyococokara-online.com/map/?kid=20001291',
  officialSources: [
    { label: 'Cocokara Fine 官方門市頁', url: 'https://www.matsukiyococokara-online.com/map/?kid=20001291' }
  ],
  mapsQuery: 'ココカラファイン 小倉駅店'
},
{
  id: 'daiso-amu-plaza-kokura',
  name: 'DAISO AMU PLAZA 小倉店',
  brand: 'DAISO',
  category: 'daily',
  area: 'kokura',
  address: '福岡縣北九州市小倉北區淺野 1-1-1',
  hours: '10:00–20:00',
  note: '可與 Cocokara Fine 同樓層安排。',
  lat: 33.88684,
  lng: 130.88229,
  officialUrl: 'https://www.daiso-sangyo.co.jp/shop/detail/005500',
  officialSources: [
    { label: 'DAISO 官方門市頁', url: 'https://www.daiso-sangyo.co.jp/shop/detail/005500' }
  ],
  mapsQuery: 'DAISO アミュプラザ小倉店'
},
{
  id: '3coins-plus-amu-plaza-kokura',
  name: '3COINS＋plus AMU PLAZA 小倉店',
  brand: '3COINS',
  category: 'daily',
  area: 'kokura',
  address: '福岡縣北九州市小倉北區淺野 1-1-1',
  hours: '10:00–20:00',
  note: '中型店、提供免稅服務。',
  lat: 33.88678,
  lng: 130.88229,
  officialUrl: 'https://www.palcloset.jp/addons/pal/shoplist/detail/?b=3coins&brandshop_no=2234',
  officialSources: [
    { label: '3COINS 官方店鋪頁', url: 'https://www.palcloset.jp/addons/pal/shoplist/detail/?b=3coins&brandshop_no=2234' }
  ],
  mapsQuery: '3COINS plus アミュプラザ小倉店'
},
{
  id: 'sundrug-uomachi-ginten-street',
  name: 'Sundrug 魚町銀天街店',
  brand: 'Sundrug',
  category: 'drug',
  area: 'kokura',
  address: '福岡縣北九州市小倉北區魚町 2 丁目',
  hours: '依官方當日公告',
  note: '魚町商店街主要藥妝採買點。',
  lat: 33.88334,
  lng: 130.87999,
  mapsQuery: 'サンドラッグ 魚町銀天街店'
},
{
  id: 'don-quijote-kokura-uomachi',
  name: '唐吉訶德 小倉魚町店',
  brand: '唐吉訶德',
  category: 'drug',
  area: 'kokura',
  address: '福岡縣北九州市小倉北區魚町周邊',
  hours: '依官方當日公告',
  note: '適合晚間一次補齊食品、日用品和藥妝。',
  lat: 33.88289,
  lng: 130.87942,
  mapsQuery: 'ドン・キホーテ 小倉魚町店'
},
// 天神（新增，避開既有 3coins-plus-mina-tenjin／daikoku-drug-tenjin-building 重複）
{
  id: 'matsumoto-kiyoshi-tenjin-underground',
  name: '松本清 天神地下街店',
  brand: '松本清',
  category: 'drug',
  area: 'tenjin',
  address: '福岡縣福岡市中央區天神 2 丁目地下街',
  hours: '依官方當日公告',
  note: '雨天逛街最方便。',
  lat: 33.59030,
  lng: 130.39812,
  mapsQuery: 'マツモトキヨシ 天神地下街店'
},
{
  id: 'cocokara-fine-fukuoka-parco',
  name: 'Cocokara Fine 福岡 PARCO 店',
  brand: 'Cocokara Fine',
  category: 'drug',
  area: 'tenjin',
  address: '福岡縣福岡市中央區天神 2-9-18',
  hours: '依 PARCO 營業時間',
  note: '可與 PARCO、天神地下街一起逛。',
  lat: 33.59075,
  lng: 130.39861,
  mapsQuery: 'ココカラファイン 福岡パルコ店'
},
{
  id: 'matsumoto-kiyoshi-mina-tenjin',
  name: '松本清 mina 天神店',
  brand: '松本清',
  category: 'drug',
  area: 'tenjin',
  address: '福岡縣福岡市中央區天神 4-3-8',
  hours: '依官方當日公告',
  note: '與 3COINS 同棟，集中採買效率最高。',
  lat: 33.59345,
  lng: 130.39880,
  mapsQuery: 'マツモトキヨシ ミーナ天神店'
},
{
  id: 'daiso-lachic-fukuoka-tenjin',
  name: 'DAISO LACHIC 福岡天神店',
  brand: 'DAISO',
  category: 'daily',
  area: 'tenjin',
  address: '福岡縣福岡市中央區天神 2-1-1',
  hours: '依商場營業時間',
  note: '同區亦有 Standard Products、THREEPPY。',
  lat: 33.58843,
  lng: 130.39910,
  mapsQuery: 'DAISO ラシック福岡天神店'
},
{
  id: 'daikoku-drug-tenjin-nishidori',
  name: '大國藥妝 天神西通店',
  brand: '大國藥妝',
  category: 'drug',
  area: 'tenjin',
  address: '福岡縣福岡市中央區今泉 1 丁目',
  hours: '依官方當日公告',
  note: '可和天神西通逛街行程串聯。',
  lat: 33.58703,
  lng: 130.39679,
  mapsQuery: 'ダイコクドラッグ 天神西通り店'
},
{
  id: 'don-quijote-fukuoka-tenjin',
  name: '唐吉訶德 福岡天神本店',
  brand: '唐吉訶德',
  category: 'drug',
  area: 'tenjin',
  address: '福岡縣福岡市中央區今泉 1 丁目',
  hours: '依官方當日公告',
  note: '適合最後統一補貨。',
  lat: 33.58664,
  lng: 130.39606,
  mapsQuery: 'ドン・キホーテ 福岡天神本店'
}
```

- [ ] **Step 3：`AREA_LABELS` 加入小倉，篩選列加按鈕**

```js
const AREA_LABELS = { hakata: '博多', tenjin: '天神', kokura: '小倉' };
```

```html
<button type="button" data-area="kokura" aria-pressed="false">小倉</button>
```

- [ ] **Step 4：官方連結渲染防呆（修正現況假設 `officialSources` 一定存在的問題）**

原本（`map.html:782-785` 附近）：

```js
const primarySource = store.officialSources.find(source => source.url === store.officialUrl);
actions.append(makeExternalLink('Google Maps 導航', makeMapsUrl(store), 'action-link maps-link'));
actions.append(makeExternalLink(primarySource ? primarySource.label : '官方資料', store.officialUrl, 'action-link'));
store.officialSources.filter(source => source.url !== store.officialUrl).forEach(source => {
  actions.append(makeExternalLink(source.label, source.url, 'action-link'));
});
```

改為：

```js
actions.append(makeExternalLink('Google Maps 導航', makeMapsUrl(store), 'action-link maps-link'));
const officialSources = store.officialSources || [];
if (store.officialUrl) {
  const primarySource = officialSources.find((source) => source.url === store.officialUrl);
  actions.append(makeExternalLink(primarySource ? primarySource.label : '官方資料', store.officialUrl, 'action-link'));
}
officialSources
  .filter((source) => source.url !== store.officialUrl)
  .forEach((source) => actions.append(makeExternalLink(source.label, source.url, 'action-link')));
```

- [ ] **Step 5：修正分類色票對調（現況 `map.html:38,40`）**

對照 `assets/kij.css` 的分類色票，`--drug` 應對應 `.kij-cat-drug`（綠 `#0a7a6a`），`--supermarket`／`--daily` 對應橘（`#a04a10`）。直接移除 `map.html` 自己的 `:root` 顏色變數，改為引用 `assets/kij.css` 的變數與分類 class，從根本消除「兩套色票各自維護、對調」的問題，而非只交換數值。

- [ ] **Step 6：加入底部工具列（複用 `assets/kij.css` 的 `.kij-bottombar`，「地圖」項標 `active`）**

- [ ] **Step 7：加入「這裡可買 N 項」區塊**

```js
import { PRODUCTS } from './assets/products.js';

function productsForStore(storeId) {
  return PRODUCTS.filter((p) => p.stores.includes(storeId));
}

function renderStoreProducts(store, container) {
  const items = productsForStore(store.id);
  if (items.length === 0) return; // 無對應商品時不顯示區塊，不顯示「可買 0 項」

  const wrap = document.createElement('div');
  wrap.className = 'store-products';
  wrap.append(makeTextElement('span', 'store-products-label', `這裡可買 ${items.length} 項`));

  const shown = items.slice(0, 5);
  const thumbRow = document.createElement('div');
  thumbRow.className = 'store-products-thumbs';
  shown.forEach((p) => {
    const link = document.createElement('a');
    link.href = `index.html#${p.id}`;
    link.className = 'store-product-thumb';
    const img = document.createElement('img');
    img.src = p.image;
    img.alt = p.name;
    link.append(img);
    thumbRow.append(link);
  });
  if (items.length > 5) {
    thumbRow.append(makeTextElement('span', 'store-products-more', `+${items.length - 5}`));
  }
  wrap.append(thumbRow);
  container.append(wrap);
}
```

（`renderStoreProducts` 在既有的店卡渲染函式尾端呼叫，插在 `note` 與 `actions` 之間。）

- [ ] **Step 8：修正空狀態缺少「重設篩選」按鈕（現況 `map.html:531` 附近）**

```html
<div id="emptyState" hidden>
  <p>找不到符合條件的店家。</p>
  <button type="button" id="resetFiltersBtn">重設篩選</button>
</div>
```

```js
document.getElementById('resetFiltersBtn').addEventListener('click', () => {
  activeArea = 'all';
  activeCategory = 'all';
  document.getElementById('searchInput').value = '';
  document.querySelectorAll('[data-area]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.area === 'all')));
  renderStores();
});
```

- [ ] **Step 9：確認圖磚失敗降級機制未被動到**

Run: `grep -n "showMapFallback\|mapFallback" map.html`
Expected: 仍是原本 `map.html:892-907` 一帶的邏輯（行號可能因重寫位移，但函式與流程不變）

- [ ] **Step 10：Commit**

```bash
git add map.html
git commit -m "feat: 重寫地圖頁，套用共用設計系統並合併小倉商圈資料"
```

---

## Task 9：端對端驗收（fresh-context，對應設計規格第十一節）

**這個 Task 必須由沒有參與 Task 1-8 實作的 agent 執行**（見 `~/.claude/rules/10-model-dispatch.md` 驗證不自驗）。

**Files:** 不新增／修改任何專案檔案，僅執行驗證並回報結果。若發現問題，回報後由另一輪任務修正，不在驗收任務裡直接改代碼。

**Interfaces:**
- Consumes: Task 1-8 的全部產出
- Produces: 通過／不通過的結論 ＋ 每項證據

- [ ] **Step 1：啟動本機伺服器**

Run: `python3 -m http.server 8811 --directory "/Users/xieh/Desktop/技術開發/KIJ-trip-shopping"`（背景執行）

- [ ] **Step 2：渲染檢查（對應規格驗收 1）**

用 Playwright MCP：`browser_navigate` 到 `http://localhost:8811/index.html`，`browser_resize` 390×844，`browser_take_screenshot`；再 `browser_resize` 1280×900，`browser_take_screenshot`。對 `map.html` 重複同樣兩種尺寸。四張截圖檢查：無破圖、無水平捲軸（`browser_evaluate` 執行 `document.documentElement.scrollWidth <= document.documentElement.clientWidth`）。

- [ ] **Step 3：狀態保存檢查（對應規格驗收 2）**

`browser_navigate` 到 `index.html` → 用 `browser_click` 勾選 3 個商品的已購買框、改 1 個數量、收合 1 個分區 → `browser_navigate` 重新載入同一頁 → `browser_snapshot` 確認上述 3+1+1 項狀態都還在。

- [ ] **Step 4：店員模式檢查（對應規格驗收 3）**

任選 1 個 `jaName` 非 null 的商品，點縮圖，`browser_snapshot` 確認全螢幕大圖與日文名有出現；任選 1 個 `jaName` 為 null 的商品，確認沒有出現空白日文區塊。任選 1 個鞋款卡片，點開後 `browser_evaluate` 讀 `img.src`，確認路徑含 `images/full/` 且不是 SVG data URI（`!src.startsWith('data:image/svg')`）。

- [ ] **Step 5：地圖連動檢查（對應規格驗收 4）**

`browser_navigate` 到 `map.html`，任選一家「可買 N 項」的店，用 `browser_evaluate` 讀該店 DOM 上顯示的數字，與直接 `import('./assets/products.js')` 算出的 `PRODUCTS.filter(p => p.stores.includes(storeId)).length` 比對是否一致；點其中一張縮圖，確認導向 `index.html#<id>` 且該商品所屬分區有展開。

- [ ] **Step 6：資料一致性檢查（對應規格驗收 5）**

Run: `npm run validate:data`
Expected: 綠燈，33 項全過

- [ ] **Step 7：中文品質檢查（對應規格驗收 6）**

對 `index.html`、`map.html`、`assets/products.js`、`assets/kij.css` 逐檔人工掃描簡體字（不用自組 regex 字元類，依 `~/.claude/rules/40-maintenance.md` 教訓區），並檢查中文與英數字之間是否有半形空格。

- [ ] **Step 8：體積檢查（對應規格驗收 7）**

Run: `du -h index.html`
Expected: < 300 KB

- [ ] **Step 9：回報**

依全域規則格式回報：結論（通過／不通過，逐項列出）、證據（截圖描述＋實際輸出）、若有不通過項目附上具體檔案與行號。

---

## 自我審查（Plan Self-Review）

**1. Spec 涵蓋度**：對照設計規格第四～十三節，Task 6 對應第四節，Task 4 對應第五、十二節，Task 7 對應第六節，Task 8 對應第七、十三節，Task 4 Step 3 對應第八節六項缺陷，Task 9 對應第九～十一節。第十節 YAGNI 項目未安排任何任務去實作，符合「不做」的要求。

**2. Placeholder 掃描**：已避免「TBD」「之後補」等字樣；Task 4、Task 5 的部分資料表格因依賴讀取既有大檔（`index.html` 3.7MB）與外部研究文件，計畫中改為給出完整規則契約＋機械驗證腳本，而非手抄尚未讀取的資料——這是刻意的任務設計（資料萃取型任務），已在 Task 4 開頭以粗體註明「這是資料萃取任務，不是憑空編寫」以避免執行者誤讀成允許隨意填寫。

**3. 型別一致性**：`PRODUCTS`／`STORES` 欄位名稱在 Task 4、5、7、8 間核對一致（`id`／`group`／`tracking`／`category`／`jaName`／`model`／`yen`／`twdRef`／`defaultQty`／`image`／`note`／`source`／`stores`；店家端 `id`／`name`／`brand`／`category`／`area`／`address`／`hours`／`note`／`lat`／`lng`／`officialUrl`／`officialSources`／`mapsQuery`）。`productsForStore`（Task 8）與 `stores` 欄位（Task 4）的關聯欄位名一致。

**4. 範圍檢查**：本計畫聚焦單一子系統（一次改版含資料遷移），未發現需要拆成多份計畫的獨立子系統。
