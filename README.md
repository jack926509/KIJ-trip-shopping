# 日本旅遊採購總表

北九州旅行使用的日本藥妝、日用品、食品伴手禮、3C 配件與社群推薦採購清單。

本專案為單頁式靜態網站，可直接部署至 Vercel、GitHub Pages、Cloudflare Pages 或其他靜態網站服務。

## 功能

- 商品分類篩選
- 商品名稱與品牌搜尋
- 購買完成勾選
- 數量與價格計算
- 日圓／新臺幣金額顯示
- 社群推薦標示
- 手機與桌面響應式版面
- 使用瀏覽器保存部分操作紀錄
- 商品價格來源與查證日期

## 專案結構

```text
.
├── index.html
├── map.html
├── assets/
│   ├── kij.css
│   └── products.js
├── skills/kij-shopping-list/
│   └── SKILL.md
├── README.md
└── images/
    ├── hoka/
    │   ├── clifton-11.jpeg
    │   └── ...
    └── on/
        ├── cloud-6-side.avif
        └── ...
```

若後續改用獨立圖片檔案，建議使用：

```text
.
├── index.html
├── README.md
└── images/
    ├── product-01.webp
    ├── product-02.webp
    └── ...
```

HTML 圖片路徑範例：

```html
<img src="./images/product-01.webp" alt="商品名稱">
```

## 在本機開啟

直接使用 Chrome、Edge、Safari 或 Firefox 開啟 `index.html`。

部分瀏覽器對本機檔案的 JavaScript 或跨網域請求有限制，因此正式測試建議部署至 Vercel。

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

1. 修改 `index.html`。
2. Commit 並 Push 到 GitHub。
3. Vercel 會自動重新部署。

## 快速新增商品

專案內建 `skills/kij-shopping-list`。安裝到 Codex Skills 目錄後，只要說「新增購物清單商品」或貼上商品網址，Skill 就會研究日本價格、來源、圖片與可證實店鋪關聯，寫入共用商品資料並驗證網站。

安裝方式：

```bash
cp -R skills/kij-shopping-list ~/.codex/skills/
```

所有新增商品會寫入 `assets/products.js`，因此部署後會正式出現在清單；有可證實的店鋪關聯時，也會出現在地圖頁。

資料變更後先執行：

```bash
npm run validate:data
```

## 圖片建議

- 優先使用 WebP 格式。
- 單張圖片建議控制在 100–300 KB。
- 避免將大量高解析度圖片全部轉成 Base64 嵌入 HTML。
- 使用相對路徑，不要使用電腦本機絕對路徑。
- 商品圖片建議確認授權與來源。

## 圖片來源

- ON 鞋款圖片取自 [ON 官方網站](https://www.on.com/)，頁面內均標註來源並連回對應官方商品頁。
- HOKA 鞋款圖片取自台灣經銷商 [ISPO+ 官方網站](https://www.ispo.com.tw/)，頁面內均標註實際圖片來源；商品資訊連結仍指向 HOKA 日本官方網站。
- 圖片僅供個人旅遊採購規劃使用；公開或商業使用仍應依品牌授權條款辦理。

## 注意事項

- 商品價格、庫存、匯率與社群推薦可能隨時間改變。
- 實際購買前，請再次確認官方資訊與店內標示。
- 網站資料主要供個人旅遊採購規劃使用。
