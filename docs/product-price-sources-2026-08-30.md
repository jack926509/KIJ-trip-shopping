# 商品價格與來源紀錄（2026-08-30）

本次先處理使用者提供的 3 張商品截圖，後續再對清單全部 79 項商品及 46 家商店重新查證。
`matsukiyo LAB` 與 `ORIHIRO` 為新商品；
`3COINS 解凍プレート／KITINTO` 與既有 `3coins-defrosting-plate` 的品名、品番及外觀一致，
因此沿用既有不可變更的 id，只更新圖片、價格種類及來源，不建立重複商品。

## matsukiyo LAB ルテイン with ブルーベリー

| 欄位 | 內容 |
|---|---|
| id | `matsukiyo-lab-lutein-blueberry` |
| 規格 | 40 粒、每日 2 粒、約 20 日份；JAN 4571104437055 |
| 主要標示 | 每 2 粒含葉黃素 16 mg、山桑子萃取粉末 100 mg、總花青素 44 mg、黑醋栗萃取物 20 mg、目藥之木萃取物 20 mg |
| 價格 | ¥1,023（含稅） |
| priceKind | `official` |
| 價格與規格來源 | [松本清官方線上商店單品頁](https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4571104437055) |
| 查證日期 | 2026-08-30 |

官方頁另列定期購買價 ¥973；清單採一般單次購買價 ¥1,023，避免把訂閱折扣誤當作門市一般售價。
商品頁標明線上價格可能與店內不同，故只把行程內的松本清門市列為候選，到店仍須確認。

## ORIHIRO ブルーベリールテイン

| 欄位 | 內容 |
|---|---|
| id | `orihiro-blueberry-lutein` |
| 規格 | 30 粒（每粒 665 mg／內容液 400 mg）、每日 1 粒、30 日份；JAN 4571157259284 |
| 主要標示 | 機能性表示食品（届出 H328）；每粒含山桑子來源花青素 43.2 mg、葉黃素 6 mg |
| 價格 | ¥2,138（含稅） |
| priceKind | `retailer-reference` |
| 官方規格來源 | [ORIHIRO 官方商品頁](https://health.orihiro.com/product/detail/?cid=118&id=500) |
| 價格來源 | [松本清官方線上商店單品頁](https://www.matsukiyococokara-online.com/store/catalog/product/view/id/4571157259284) |
| 查證日期 | 2026-08-30 |

ORIHIRO 官方將希望零售價標為開放價格，因此清單不能把任何通路售價稱為官方定價。
本次採松本清線上含稅價 ¥2,138 作為通路參考；頁面也明確提醒實體店價格可能不同。

## 3COINS 解凍プレート／KITINTO

| 欄位 | 內容 |
|---|---|
| id | `3coins-defrosting-plate`（既有商品，未新增重複 id） |
| 品番與規格 | 2412-KR542-0000；鋁合金；約直徑 19.6 × 厚 0.3 cm |
| 價格 | ¥1,100（含稅） |
| priceKind | `official` |
| 價格與規格來源 | [PAL GROUP 官方單品頁](https://www.palcloset.jp/display/item/2412-KR542-0000/?b=3coins&cl=19) |
| 查證日期 | 2026-08-30 |

官方頁確認可用於加快自然解凍與料理散熱，並提醒通販與實體店價格可能不同。
既有的天神與小倉 3COINS 關聯予以保留，但不宣稱出發時仍有現貨。

## HOKA Mach Remastered

| 欄位 | 內容 |
|---|---|
| id | `mach-remastered` |
| 日本商品名 | マッハ リマスタード Mach Remastered |
| 型號 | 男款 1176250 |
| 官方分類 | Lifestyle |
| 價格 | ¥17,600（含稅） |
| priceKind | `official` |
| 價格與規格來源 | [HOKA 日本官方男款商品頁](https://www.hoka.com/jp/mach-remastered/1176250.html) |
| 查證日期 | 2026-08-30 |

官方頁確認半透明 ripstop 鞋面、無縫壓合薄膜、超臨界發泡中底、金屬鞋帶孔、
未收邊微纖維鞋舌、反光鞋帶與 3D 印刷標誌等設計。清單以 HOKA 福岡天神直營店作為試穿地點，
但不代表該店已有指定配色或尺寸現貨，到店仍須確認。

使用者提供的圖片可辨識為全黑配色，但僅憑圖片與檔名無法可靠對應官方色名，
因此清單不臆測色號；購買時請以鞋盒與店員提供的正式配色名稱為準。

## 圖片來源與處理

4 張圖片皆由使用者提供，原始檔位於旅程附件的 `90 附件/購物清單/0新清單` 資料夾。
專案保留副本如下，再由 `npm run build:images` 產生 400 px 縮圖與 1200 px 以內大圖：

- `images/source/matsukiyo-lab-lutein-blueberry.jpg`：800 × 1129 px。
- `images/source/orihiro-blueberry-lutein.jpg`：1183 × 1277 px。
- `images/source/3coins-defrosting-plate-2026-08-30.jpg`：1290 × 1337 px；保留舊來源圖，不刪除。
- `images/source/mach-remastered.avif`：1110 × 900 px；保留使用者提供的 AVIF 原檔。

這些截圖僅供個人旅遊採買辨識使用；商品商標與圖片權利屬原品牌或原發布者。

## 全商品重新查證

- 查證範圍：`assets/products.js` 最終輸出的 79 項商品，以及 `assets/stores.js` 的 46 家商店。
- 查證順序：日本品牌／製造商官網、品牌官方商店、官方新聞稿優先；無官網定價時，才採日本大型零售商的同型號商品頁。
- 定價語意：`official` 是品牌官網或官方希望零售價；`retailer-reference` 是通路當日價；`photo-reference` 與 `launch-reference` 不是目前官網成交價；查不到可靠現價則保留 `pending`，不補猜測數字。
- 商店語意：只有品牌直營、官方授權或自有品牌關係列為主要店家；僅能確認「這類店可能販售」而沒有指定分店 SKU／庫存證據者，一律列為候選店並標示到店確認。

### 79 項逐項查證結果

下表是 `assets/products.js` 最終輸出，查證日期統一為 2026-08-30。`已確認`只表示品牌直營、官方授權或自有品牌等通路關係，仍不代表出發日有現貨；`候選`一律須到店確認。來源網址直接記在每項商品的 `priceSourceUrl`，並由資料驗證器檢查官方／通路來源種類與單品頁格式。

| # | 商品 id | 現行價格／判定 | 來源種類 | 店家關聯 |
|---:|---|---:|---|---|
| 1 | `jinmart` | ¥1,320 | official | 候選 11 |
| 2 | `roihi` | ¥2,695 | official | 候選 11 |
| 3 | `nature` | ¥803 | official | 候選 11 |
| 4 | `anelon` | ¥1,848 | official | 候選 11 |
| 5 | `kombu` | 無固定官價（官方暫停販售） | pending | 候選 8 |
| 6 | `findmy` | ¥1,100 | official | 已確認 3 |
| 7 | `hareno-toothbrush` | ¥620 | retailer-reference | 候選 11 |
| 8 | `lion-stain-rescue` | ¥498 | retailer-reference | 候選 11 |
| 9 | `golden-seasoning` | ¥1,590 | official | 候選 1 |
| 10 | `toothbrush-p61` | ¥2,298 | retailer-reference | 候選 11 |
| 11 | `3coins-luggage-band` | ¥550 | official | 已確認 1 |
| 12 | `kayanoya-dashi` | ¥2,268 | official | 已確認 2 |
| 13 | `ne7n` | ¥7,680 | retailer-reference | 候選 4 |
| 14 | `ne5n` | ¥5,180 | retailer-reference | 候選 4 |
| 15 | `elecom-ex-g` | ¥7,623 | official | 候選 2 |
| 16 | `elecom-ex-g-pro` | ¥17,424 | official | 候選 3 |
| 17 | `sanwa-400-ma092` | ¥2,780 | official | 網路限定，未指定實體店 |
| 18 | `sanwa-ma-ergw19` | ¥7,480 | launch-reference | 候選 1 |
| 19 | `sanwa-trackball-400-mawbttb190` | ¥5,480 | official | 候選 1 |
| 20 | `logicool-ergo-m575-sp` | ¥7,700 | official | 候選 3 |
| 21 | `logicool-mx-ergo-s` | ¥19,580 | official | 候選 3 |
| 22 | `logicool-mx-anywhere-3s` | ¥15,950 | official | 候選 2 |
| 23 | `logicool-pebble-mouse-2-m350s` | ¥3,960 | official | 候選 3 |
| 24 | `buffalo-bsmbw318bk` | 無固定官價（開放價格） | pending | 候選 3 |
| 25 | `cloudtilt` | ¥23,100 | official | 已確認 1 |
| 26 | `cloudsurfermax` | ¥23,100 | official | 已確認 1／候選 1 |
| 27 | `cloudsurfer2` | ¥20,900 | official | 已確認 1 |
| 28 | `cloud6` | ¥19,800 | official | 已確認 1 |
| 29 | `cloudrunner3` | ¥18,700 | official | 已確認 1 |
| 30 | `clifton11` | ¥19,800 | official | 已確認 1 |
| 31 | `bondi9` | ¥24,200 | official | 已確認 1 |
| 32 | `skyflow` | ¥22,000 | retailer-reference | 已確認 1 |
| 33 | `transport2` | ¥22,000 | official | 已確認 1 |
| 34 | `gaviota5` | ¥27,500 | launch-reference | 已確認 1 |
| 35 | `hasameru-sponge` | ¥220 | official | 已確認 3 |
| 36 | `belt-fan` | ¥1,980 | official | 已確認 2 |
| 37 | `chawanmushi-no-moto` | ¥237 | official | 已確認 2 |
| 38 | `protect-u-folding-umbrella` | ¥2,178 | official | 候選 2 |
| 39 | `wpc-iza-cool-compact` | ¥5,280 | official | 候選 2 |
| 40 | `coleman-auto-folding-umbrella` | ¥2,980 | official | 已確認 3 |
| 41 | `pabron-ace-pro-x-36` | ¥2,178 | official | 候選 11 |
| 42 | `taisho-kampo-stomach-48` | ¥2,860 | official | 候選 11 |
| 43 | `morinaga-caramelic-pudding` | ¥321 | official | 候選 6 |
| 44 | `strawberry-chocolate-melon-pan` | ¥214 | official | 已確認 3 |
| 45 | `jurokucha-630ml` | 無固定單瓶官價 | pending | 候選 9 |
| 46 | `gogo-no-kocha-ice-milk-tea` | ¥186 | official | 已確認 3 |
| 47 | `asari-miso-soup` | ¥178 | official | 已確認 3 |
| 48 | `hanamidori-kiwami-spice` | ¥540 | official | 候選 8 |
| 49 | `kobayashi-zukkinon-ointment` | ¥1,100 | official | 候選 11 |
| 50 | `jojoen-salad-sauce` | ¥702 | official | 候選 8 |
| 51 | `fundokin-ao-yuzu-kosho` | ¥443 | official | 候選 8 |
| 52 | `higashimaru-oyster-dashi-shoyu` | ¥421 | official | 候選 8 |
| 53 | `3coins-defrosting-plate` | ¥1,100 | official | 已確認 2 |
| 54 | `3coins-folding-camp-chair` | ¥660 | official | 已確認 2 |
| 55 | `lulu-attack-ex-24` | ¥2,200 | official | 候選 11 |
| 56 | `ohta-isan-s-50` | ¥2,079 | official | 候選 11 |
| 57 | `daiso-toy-story-pendulum-clock` | ¥770 | launch-reference | 已確認 3 |
| 58 | `cp-lip-lip-essence` | ¥1,980 | official | 候選 11 |
| 59 | `kinui-calm-7-soothing-serum` | ¥2,970 | official | 候選 6 |
| 60 | `salonpas-ae-240` | ¥3,410 | official | 候選 11 |
| 61 | `passtime-lx-premium-21` | ¥2,398 | official | 候選 11 |
| 62 | `toraku-royal-custard-pudding` | ¥226 | launch-reference | 候選 6 |
| 63 | `seasoning-container-pair` | ¥330 | official | 已確認 2 |
| 64 | `kobayashi-harenurse-spray` | ¥880 | official | 候選 11 |
| 65 | `kobayashi-harenurse-18` | ¥2,541 | official | 候選 11 |
| 66 | `muji-3layer-sponge-grey` | ¥299 | official | 已確認 2 |
| 67 | `daiso-basin-cleaner-cloth` | ¥110 | official | 已確認 3 |
| 68 | `calbee-satsumaimo-chips` | 約 ¥160 | retailer-reference | 候選 9 |
| 69 | `cio-smartcoby-pro-slim-ss-10k` | ¥6,280 | official | 候選 3 |
| 70 | `cio-smartcoby-slimii-wireless-2-2-pro-ss10k` | ¥8,580 | official | 候選 3 |
| 71 | `cio-smartcoby-slimii-wireless-2-2-8k-special-edition` | ¥8,980 | retailer-reference | 候選 3 |
| 72 | `cio-smartcoby-pro-slim-cable` | ¥5,980 | official | 候選 3 |
| 73 | `cio-smartcoby-pro-cable-c` | ¥6,578 | official | 候選 3 |
| 74 | `horinishi-new-lemon` | ¥1,280 | official | 候選 8 |
| 75 | `sato-acess-l` | ¥1,717 | retailer-reference | 候選 6 |
| 76 | `sugar-butter-tree-yaki-ringo-brulee` | ¥300 | official | 已確認 1 |
| 77 | `matsukiyo-lab-lutein-blueberry` | ¥1,023 | official | 候選 4 |
| 78 | `orihiro-blueberry-lutein` | ¥2,138 | retailer-reference | 候選 4 |
| 79 | `mach-remastered` | ¥17,600 | official | 已確認 1 |

結果彙整：62 項 `official`、10 項 `retailer-reference`、4 項 `launch-reference`、3 項 `pending`；79 項均有明確價格語意與 2026-08-30 查證日期，沒有把候選店誤寫成現貨店。

### 本輪修正的官網價與來源

| id | 更新後價格 | 查證結果與來源 |
|---|---:|---|
| `logicool-mx-anywhere-3s` | ¥15,950 | [Logicool 日本官網](https://www.logicool.co.jp/ja-jp/shop/p/mx-anywhere-3s)；Yodobashi 當日 ¥12,990 是通路促銷，不取代官網價。 |
| `hanamidori-kiwami-spice` | ¥540 | [Torizen Foods 製造商官網](https://www.torizenfoods.jp/items/hanamidori/seasoning/kiwami-spice/)列未稅 ¥500／含稅 ¥540；Profoods ¥588 是通路價。 |
| `kobayashi-zukkinon-ointment` | ¥1,100 | [小林製藥官網](https://www.kobayashi.co.jp/seihin/zkn_n/)列 15 g 未稅 ¥1,000／含稅 ¥1,100。 |
| `seasoning-container-pair` | ¥330 | [3COINS 官方商品頁](https://www.palcloset.jp/display/item/2524-SJAR2P-000/?b=3coins)確認品番 `2524-SJAR2P-000`、各 340 ml；照片 ¥300 是未稅表示。 |
| `golden-seasoning` | ¥1,590 | 數字不變，改接 [HORINISHI 品牌官方販售頁](https://shop-orange.info/products/horinishi-023)；通路促銷另計。 |
| `kobayashi-harenurse-18` | ¥2,541 | 數字不變，改接 [小林製藥官網](https://www.kobayashi.co.jp/seihin/hrn/)的未稅 ¥2,310／含稅 ¥2,541。 |
| `transport2` | ¥22,000 | 數字不變，改接 [HOKA 日本現行男款 1171851](https://hoka-jp-api.hoka.com/transport-2/1171851.html)。 |
| `calbee-satsumaimo-chips` | 約 ¥160 | 更新為 [AEON 現行同 JAN 商品頁](https://shop.aeon.com/netsuper/01050000002420/010500000024204901330805180.html)的未稅 ¥148／含稅 ¥159.84；Calbee 為開放價。 |
| `3coins-luggage-band` | ¥550 | 數字不變，將第三方文章改為 [3COINS 第一方 2026 商品介紹](https://www.palcloset.jp/display/article/detail/?acd=2604133co_002&b=3coins&leeep_tracking=1)。 |
| `ohta-isan-s-50` | ¥2,079 | 數字不變，將舊 PDF 改為 [太田胃散目前商品頁](https://ohta-isan.co.jp/product/medicine/ohtaisanb-s/)。 |

### 無法列為目前官網價的品項

- `skyflow`：保留 ¥22,000 舊通路參考價，但明確標示本輪無法從 HOKA 日本現行頁重新確認。
- `daiso-toy-story-pendulum-clock`：¥770 有近期上市資料，但官方系列頁未直接列出該單品，改為 `launch-reference` 並標示到店確認。
- `kombu`：25 g 減鹽鹽昆布已由官方公告暫停販售，維持無現價，只可能遇到通路剩餘庫存。
- `buffalo-bsmbw318bk` 與 `jurokucha-630ml` 為開放價或缺少固定單瓶官價，繼續保留 `pending`，沒有用近似商品補價。

### 46 家商店官網與關聯檢查

- 46 家商店均重新檢查名稱、地址、地圖／官網網址及商品關聯；41 個官方網址可直接取得成功回應。
- HOKA、Alpen、Best Denki 與 HANDS 的官方頁有防自動存取或連線限制，改以官方門市搜尋結果／品牌頁交叉確認；沒有因此宣稱特定商品有庫存。
- ゆめマート官方來源存取受限，保留為一般食品候選店，不作指定商品鋪貨證據。
- 資料驗證會逐項檢查：所有 `stores`／`storeCandidates` 必須是現存的 46 家店、不得重複；品牌直營與自有品牌以外的未證實分店關聯只能列候選。

### 商店關聯修正

- `belt-fan` 已確認為 3COINS 品番 `2615-ITBF01-000`，主要店家改為天神與小倉兩家 3COINS；移除沒有商品關聯證據的 HANDS。
- 一般藥妝、超市、便利商店及量販店的商品映射，只要沒有指定分店 SKU／在庫證據，均由主要店家降為候選店；頁面仍會提供地址與導航，但顯示「到店確認」。
- HOKA 直營、茅乃舍官方店、MUJI、DAISO、3COINS 與 On 官方授權 Murasaki Sports 等品牌／授權關係保留為主要店家；這仍不代表指定尺寸、顏色或當日庫存。
- LAWSON 三家店已補上官方地圖深連結與電話；Cosmos 天神大丸前店改接福岡市中央區官方門市列表。Best Denki 小倉站前店保留官方分店頁，但自動查核遭 403，不把這種技術阻擋解讀為停業。
