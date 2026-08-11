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

## 第一輪標記為待處理（已於第二輪全部解決，見下半部第 8 節）

下列商品的 `priceSourceUrl` 指向品牌首頁、系列頁或站內搜尋結果頁，而非單一商品頁。價格本身未發現錯誤，但佐證強度較弱：

| 商品 id | 現有來源 | 型態 |
| --- | --- | --- |
| `golden-seasoning` | `horinishi.jp/lineup/` | 系列頁 |
| `wpc-iza-cool-compact` | `wpc-iza.jp/` | 品牌首頁 |
| `cp-lip-lip-essence` | `astery.jp/en` | 品牌首頁 |
| `chawanmushi-no-moto` | `kubara.jp/item/search/...` | 站內搜尋頁 |
| `ne7n` | `biccamera.com/bc/category/?q=eh-ne7n` | 站內搜尋頁 |

## 查核方法

以 WebSearch 查詢各商品的品牌官方頁、官方新聞稿與至少一個日本零售通路頁交叉比對規格（容量、入數、型號）與價格；僅在規格明確相符時採用。無法連線直接抓取的網域（部分日本站台受網路政策阻擋）改以多筆搜尋結果交叉驗證，並在無法確認時保留原值、於本文件標記為待後續處理。

---

# 第二輪：清除全部遺留項目（2026-08-11）

上半部列出的「待後續處理」與先前稽核留下的項目，本輪全部處理完畢，不再保留任何待辦。

## 5. 台幣換算全面錯誤（新發現，影響全站）

原本只有 `ne7n`（¥7,680→NT$2,390）與 `ne5n`（¥5,180→NT$1,669）兩筆手寫台幣值，換算出來的匯率分別是 0.311 與 0.322 —— 不但彼此不一致，且與實際匯率（2026-08-10 為 1 JPY ≈ 0.2035 TWD）相差甚遠，兩筆都高估約 53–58%。

**處理**：在 `assets/products.js` 新增 `JPY_TWD_RATE = 0.2035`（`JPY_TWD_RATE_CHECKED_AT = '2026-08-10'`），所有 `twdRef` 一律由 `yen × JPY_TWD_RATE` 推導，移除全部手寫值。日後更新匯率只需改這一個常數。有台幣顯示的商品也從 2 項增為 44 項，README 宣稱的「日圓／新臺幣金額顯示」才名實相符。

## 6. 兩項待確認價格已補齊

| 商品 id | 處理 | 來源 |
| --- | --- | --- |
| `pabron-ace-pro-x-36` | `pending` → `retailer-reference`，¥1,495 | <https://kakaku.com/medicine-item/K0001623006/> |
| `taisho-kampo-stomach-48` | `pending` → `retailer-reference`，¥1,760 | <https://kakaku.com/medicine-item/K0000544212/> |

兩者皆為日本 OTC 藥品的開放價格商品，大正製藥未公布該規格希望小売価格，故採比價站最低價並於 `priceNote` 載明。

## 7. 兩項飲料維持 pending —— 此為最終判定，非待辦

`jurokucha-630ml` 與 `gogo-no-kocha-ice-milk-tea` 是日本清涼飲料，屬開放價格商品：Asahi 與 KIRIN 官方頁均不標示金額（KIRIN 官方明示希望小売価格僅供參考）。加上 630 ml 對應無標籤瓶／濃味版等多個規格、「ICE MILK TEA」查無對應的現行單一品項，無法指定 SKU 與定價。

填任何單一數字都會是臆測，因此保持 `pending`，並把原本「圖片無法辨識」這種看似可補的措辭改寫為明確的開放價格說明，`priceNote` 直接註明「此為最終判定，非待補資料」。

## 8. 5 筆偏弱來源全部更換

| 商品 id | 原來源 | 現在 |
| --- | --- | --- |
| `ne7n` | biccamera 站內搜尋頁 | BicCamera 單品頁 <https://www.biccamera.com/bc/item/14481338/>（note 稱 BicCamera，網域終於一致） |
| `chawanmushi-no-moto` | kubara 站內搜尋頁 | 官方單品頁（1 袋入）<https://www.kubara.jp/kayanoya/ryorinomoto/wafu/184700/> |
| `golden-seasoning` | `horinishi.jp/lineup/` 系列頁 | 改 `retailer-reference`，規格相符（瓶裝 100 g）單品頁 <https://www.yodobashi.com/product/100000001006781218/>；¥1,590 經多家通路一致標示 |
| `wpc-iza-cool-compact` | `wpc-iza.jp/` 品牌首頁 | 官方線上商店 IZA COMPACT 無地款商品頁 <https://www.wpc-store.com/c/iza/za003> |
| `cp-lip-lip-essence` | `astery.jp/en` 品牌首頁 | 官方商品列表頁 <https://www.astery.jp/en/category/all-products> |

後兩筆的**金額本輪未能重新驗證**（Wpc. COMPACT 系列橫跨 ZA003／ZA020／ZA028 多個型號，照片只能辨識 ZA020，無法確定 SKU；Cp-Lip 官方頁未列價）。這點已寫進各自的 `priceNote`，並非隱瞞為已驗證。

## 9. 6 家孤兒店家已全部連上商品

`cocokara-fine-kokura-station`、`sundrug-uomachi-ginten-street`、`matsumoto-kiyoshi-tenjin-underground`、`cocokara-fine-fukuoka-parco`、`matsumoto-kiyoshi-mina-tenjin`、`daikoku-drug-tenjin-nishidori` 原本在地圖上有標記卻沒有任何商品指向。

六家都是松本清／Cocokara Fine／Sundrug／大國藥妝等大型連鎖藥妝，本就會鋪貨一般成藥與日用品，因此加入 9 項藥妝類商品的 `storeCandidates`（「建議到店確認」而非「可買」，不宣稱庫存）。地圖 29 家店現在全數至少被一項商品連結。

## 10. `3coins-luggage-bag` → `3coins-luggage-band`

該商品是行李箱拉桿固定綁帶（キャリーケースバンド），`name`、`jaName`、`note` 與圖檔名皆為「綁帶」，只有 id 寫成 `bag`。已一併更名 id、`images/thumb`／`images/full` 圖檔與 `build-manifest.json`。

副作用：使用者先前對這一項存在瀏覽器的勾選與數量會重置（localStorage 以 id 為鍵），其餘 47 項不受影響。

## 11. 驗證器補上 7 條語意規則（根因處理）

先前幾輪找到的錯誤都不是格式問題，而是**同一筆資料的兩個欄位互相矛盾**，格式驗證抓不到，只能靠人工複查 —— 這正是問題反覆浮現的原因。因此 `scripts/validate-products.mjs` 新增：

1. `priceNote` 點名的通路（BicCamera／LOHACO／Costco／Yodobashi／價格.com…）必須與 `priceSourceUrl` 網域相符
2. `priceNote` 寫出的「含稅 ¥N」必須等於 `yen`（全站一律存含稅價）
3. `official`／`retailer-reference` 的來源必須是單品頁，不得是首頁或站內搜尋頁
4. `twdRef` 必須等於 `yen × JPY_TWD_RATE`，禁止手寫值
5. 地圖上每家店都必須至少被一項商品連結
6. 店家 `hours` 不得只寫「依…公告」這類空泛字樣
7. 店家 `address` 與 `mapsQuery` 的樓層寫法不得互相矛盾

每條規則都以「注入當初那個 bug」的方式實測過會觸發：規則 1 對應 `ne5n`、規則 2 對應 `morinaga`、規則 3 對應 `wpc-iza`、規則 4 對應 `ne7n` 的 NT$2,390、規則 5 對應 6 家孤兒店家、規則 6 對應 Sundrug 的「依官方當日公告」、規則 7 對應 HOKA 的 B1F／1F 矛盾。

實作規則 7 時發現原本的店家區塊切割（`/\n\s*\{/`）會被 `officialSources` 的內層物件切斷，導致 `mapsQuery` 落到別的區塊而永遠比不到，已改為只在店家層級縮排（`/\n {6}\{/`）切割並重新實測。

## 現況

- 48 項商品、29 家店家，`npm run validate:data` 通過。
- 無孤兒店家、無孤兒圖片、無空泛營業時間、無手寫匯率。
- `pending` 價格 2 項，皆為開放價格商品的最終判定並已載明理由。
- 唯二未能本輪重新驗證金額的是 `wpc-iza-cool-compact` 與 `cp-lip-lip-essence`，已在資料本身的 `priceNote` 標示，不是隱含的待辦。

## 新增：CIO SMARTCOBY SLIMII Wireless2.2 8K Special Edition Set

| 品項 | 規格 | 顯示價格 | 類型 | 直接來源 | 核對結果 |
| --- | --- | ---: | --- | --- | --- |
| CIO SMARTCOBY SLIMII Wireless2.2 8K Special Edition Set | 黑色、型號 CIO-MB30W1C-8K-S2W25-EE-BK、含網狀收納袋 | ¥8,980 | BicCamera 通路參考 | [BicCamera 商品頁](https://www.biccamera.com/bc/item/15238470/) | 使用者照片可辨識型號、8,000 mAh、Qi2.2 25 W、USB-C 30 W 與收納袋；通路頁標示含稅 ¥8,980。 |

- [CIO 官方產品頁](https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb30w1c-8k-s2w25/) 確認基本型號的容量 8,000 mAh、尺寸約 102 × 70 × 12 mm、重量約 170 g、Qi2.2 無線最大 25 W、USB-C 最大 30 W。
- 本次照片為含專用網狀收納袋的 Special Edition Set，故價格採對應的 BicCamera 商品頁，而不使用基本型號的官方 ¥7,980 定價。
