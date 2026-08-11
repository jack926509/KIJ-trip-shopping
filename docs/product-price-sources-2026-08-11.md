# 商品價格來源複查（2026-08-11）

本輪針對 48 項商品的價格、來源網址與內容一致性做全面複查，發現並修正下列 4 項。其餘商品的價格與來源經檢視未發現錯誤。

## 1. `morinaga-caramelic-pudding`（森永 マミーレ キャラメリックプディング）

**原紀錄**：`yen: 180`、`priceKind: 'photo-reference'`、priceNote「使用者提供圖片中的層架價標為 ¥180（含稅 ¥194）」。

**問題**：

1. 與官方參考售價差距過大。森永製菓官方新聞稿載明本品為 80 ml、超商限定，參考小売価格為未稅 ¥298／含稅 ¥321，2026-05-18 上市。¥180 與之相差近一倍，無法對應同一商品。
2. 含稅慣例與其他筆不一致。同批 Lawson 商品 `asari-miso-soup` 的 `yen` 存的是含稅價（¥178），本筆卻存未稅價（¥180），同一份資料兩種慣例。

**處理**：改為 `priceKind: 'official'`、`yen: 321`（含稅，與 `asari-miso-soup` 慣例一致），來源改為森永製菓官方新聞稿。原照片讀數保留在 note 中說明無法對應。

- 森永製菓官方新聞稿：<https://prtimes.jp/main/html/rd/p/000000800.000019896.html>

## 2. `hanamidori-kiwami-spice`（博多華味鳥 10 種極香料 55 g）

**原紀錄**：`yen: 708`、`priceSourceUrl: 'https://www.supersports.com/ja-jp/lbreath/products/C-10910310101/'`。

**問題**：來源網址指向 Super Sports XEBIO 旗下 L-Breath 運動用品通路的商品頁，與本商品（トリゼンフーズ 出品的雞肉料理用香料）類別不符，且無法驗證該網址確為本商品，屬來源與商品不對應。

**處理**：更換為規格相符（55 g）且可驗證的日本食品通路商品頁，並同步將價格對齊該來源的 ¥588，使價格與其引用來源一致。另於 note 補上製造販售商官方商品頁。

- 食品通路商品頁（プロフーズ，55 g）：<https://www.profoods.co.jp/i/0600551>
- 製造販售商官方商品頁（トリゼンフーズ）：<https://www.torizenfoods.jp/items/hanamidori/seasoning/kiwami-spice/>

## 3. `clifton11`（HOKA Clifton 11）

**原紀錄**：`priceSourceUrl: 'https://hoka-jp-api.hoka.com/'`。

**問題**：該網址為 API 服務根網域，不是商品頁，無法作為 `official` 價格的佐證。同群組的 `bondi9` 使用的是正確的官方商品頁格式（`https://www.hoka.com/jp/bondi-9/1162011.html`），本筆與之不一致。

**處理**：改為 HOKA 日本官方商品頁。價格 ¥19,800（含稅）經官方頁與品牌新聞稿確認無誤，不變動。

- HOKA 日本官方商品頁：<https://www.hoka.com/jp/clifton-11/1176572.html>

## 4. `ne5n`（Panasonic EH-NE5N）

**原紀錄**：note 寫「BicCamera 線上參考價 ¥5,180」，但 `priceSourceUrl` 指向 kakaku.com（價格.com 比價站）。

**問題**：說明文字宣稱的通路與實際引用來源不符。同群組的 `ne7n` note 同樣寫 BicCamera，但其來源網址確實是 biccamera.com，兩筆標準不一。

**處理**：價格與來源網址不變（比價站參考價本身無誤），僅修正 note 文字，明確標示來源為比價站而非 BicCamera 官方標價。

## 經檢視未發現錯誤的項目

- 其餘 44 項商品的 `yen`、`priceKind`、`priceSourceUrl`、`priceCheckedAt` 組合均通過驗證器規則，且未發現來源與商品不對應的情形。
- `golden-seasoning`（ほりにしプレミアム）經查確為 100 g 白松露鹽版本，商品內容與 note 描述相符；其掛在 Alpen（運動用品通路）之下亦合理，該品牌為戶外露營調味料。
- `cloudsurfermax` 的 note 提到 Alpen 獨家配色但來源為 On 官方頁，屬價格取自品牌官方、配色資訊另述，非矛盾。
- 48 項商品的 `stores`／`storeCandidates` 與各店家 `category`／`brand` 的對應關係逐筆檢視，未發現類別錯配。

## 待後續處理（本輪未變更）

下列商品的 `priceSourceUrl` 指向品牌首頁、系列頁或站內搜尋結果頁，而非單一商品頁。價格本身未發現錯誤，但佐證強度較弱，建議日後補上實際商品頁：

| 商品 id | 現有來源 | 型態 |
| --- | --- | --- |
| `golden-seasoning` | `horinishi.jp/lineup/` | 系列頁 |
| `wpc-iza-cool-compact` | `wpc-iza.jp/` | 品牌首頁 |
| `cp-lip-lip-essence` | `astery.jp/en` | 品牌首頁 |
| `chawanmushi-no-moto` | `kubara.jp/item/search/...` | 站內搜尋頁 |
| `ne7n` | `biccamera.com/bc/category/?q=eh-ne7n` | 站內搜尋頁 |

## 查核方法

以 WebSearch 查詢各商品的品牌官方頁、官方新聞稿與至少一個日本零售通路頁交叉比對規格（容量、入數、型號）與價格；僅在規格明確相符時採用。無法連線直接抓取的網域（部分日本站台受網路政策阻擋）改以多筆搜尋結果交叉驗證，並在無法確認時保留原值、於本文件標記為待後續處理。
