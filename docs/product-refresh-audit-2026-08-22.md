# 商品價格與現貨提醒稽核（2026-08-22）

- 查詢時間：2026-08-22（Asia/Taipei）
- 母體：本任務開始時 `assets/products.js` 的既有 73 項。補查期間檔案由其他工作新增 `horinishi-new-lemon`，目前共 74 項；該新商品不在本次「既有 73 項」委派範圍，應以新增商品本身的查證結果另行驗收。
- Coverage：73／73 均已在 2026-08-22 重新判讀。67 項取得可支持「當日售價／官方建議價／開放價／暫停販售／停產」的來源；6 項因會員登入牆或照片商品身分不足，列為人工缺口，不猜價。
- 補查的 47 項中，16 項建議修改價格、價格語意或販售狀態；25 項可維持價格或已取得合法的開放價判定；6 項需人工確認。原始 Yodobashi 單品頁本輪皆回傳 403，因此相關滑鼠改以製造商官方現行頁判讀。
- 「有貨」只代表引用頁面當下的線上庫存；除非頁面明列福岡門市庫存，否則不能寫成天神、博多或小倉門市確定有貨。

## 建議直接修改（12 項）

| id | 現價 | 查到的新價 | 來源 | 是否需修改 | 現貨／庫存措辭建議 |
| --- | ---: | ---: | --- | --- | --- |
| `jinmart` | 未填 | ¥1,320 | [Rohto 官方：15 g、希望小売価格税込](https://jp.rohto.com/jinmart/ointment/) | 是：補 `model: 15 g`、官方價與查證日 | 「官方仍列為現行品；福岡各門市庫存未確認，請現場詢問 15 g。」 |
| `roihi` | 未填 | ¥2,695 | [Nichiban 官方：80 g、稅別 ¥2,450](https://www.nichiban.co.jp/general/health/stiff_shoulder/roihi_creamfelbi/) | 是：補 `model: 80 g`；含稅換算 ¥2,695 | 「官方仍列為現行品；實體藥妝庫存與售價未確認。」 |
| `nature` | 未填 | ¥803 | [Naris Up 官方品牌頁](https://www.narisup.com/shop/brand/natureconc.aspx) | 是：補 `model: 40 ml` 與官方參考價 | 「官方頁仍列商品；門市未必常備，請依 40 ml 包裝詢問。」 |
| `anelon` | 未填 | ¥1,848 | [SSP 官方：10 粒裝](https://www.ssp.co.jp/product/detail/annys/) | 是：指定 10 粒裝；另有 4 粒 ¥1,078、6 粒 ¥1,298 | 「請先看粒數；福岡門市庫存及折扣價未確認。」 |
| `ne7n` | ¥6,630 | ¥7,680 | [BicCamera 商品頁](https://www.biccamera.com/bc/item/14481337/) | 是：`+¥1,050`，來源改為 BicCamera | 「BicCamera 線上頁顯示三色有貨；不等於天神館現貨，可先用『店舗に取り置く』查分店。」 |
| `ne5n` | ¥4,073 | ¥5,180 | [BicCamera 商品頁](https://www.biccamera.com/bc/item/14481334/) | 是：`+¥1,107`，來源改為 BicCamera | 「BicCamera 線上頁顯示三色有貨；不等於天神館現貨。」 |
| `cloudtilt` | 未填 | ¥23,100 | [On 日本官方](https://www.on.com/ja-jp/products/cloudtilt-m-3me1010) | 是：補官方價 | 「尺寸與配色庫存差異大；官網部分尺寸缺貨，不宣稱福岡店有貨。」 |
| `bondi9` | 未填 | ¥24,200 | [HOKA 日本官方](https://hoka-jp-api.hoka.com/) | 是：補官方價 | 「需依性別、楦寬、尺寸現場確認；官網價格不代表福岡天神店庫存。」 |
| `hasameru-sponge` | 未填 | ¥220 | [DAISO 官方](https://jp.daisonet.com/products/4550480772363) | 是：補官方價與 JAN 4550480772363 | 「DAISO 官網只顯示網路訂購狀態；各門市庫存不同。」 |
| `belt-fan` | 未填 | ¥1,980 | [3COINS 官方](https://www.palcloset.jp/display/item/2615-ITBF01-000/) | 是：若照片即現行款，補價與型號；購買店應以 3COINS 為主，不宜以 HANDS 為確定店家 | 「季節商品；官方曾顯示再入荷／無庫存，現場可能售完。」 |
| `chawanmushi-no-moto` | 未填 | ¥237／1 袋；¥874／4 袋 | [久原本家官方](https://www.kubara.jp/sp/kayanoya/gohan/chawanmusi/184700/) | 是：卡片須先選規格；建議 4 袋 ¥874 | 「官方通販可購買；博多／小倉店內庫存未確認。」 |
| `daiso-basin-cleaner-cloth` | 未填 | ¥110 | [DAISO 官方](https://jp.daisonet.com/products/4550480670362) | 是：補官方價與 JAN 4550480670362 | 「官方網店目前售罄；不等於福岡門市售罄，請現場找 JAN。」 |

## 需先修正商品身分再決定價格（2 項）

| id | 現價 | 查到的新價 | 來源 | 是否需修改 | 現貨／庫存措辭建議 |
| --- | ---: | ---: | --- | --- | --- |
| `wpc-iza-cool-compact` | 未填；型號 `ZA020` | `ZA030`：¥5,280 | [Wpc. 官方 COOL & COMPACT](https://www.wpc-store.com/c/iza/za030)；[Wpc. 官方 ZA020 COMPACT](https://www.wpc-store.com/c/iza/za003) | 是：現資料把名稱 `COOL & COMPACT` 與舊型號 `ZA020` 混在一起。若目標是 COOL & COMPACT，改成 `ZA030`／¥5,280；若照片是 ZA020，名稱應改為 `COMPACT`，官方價自 ¥3,630 起 | 「COOL & COMPACT 為官方／直營店／部分通路限定；HANDS、Loft 不可寫成確定有貨。」 |
| `findmy` | 未填 | DAISO「紛失防止タグ」¥1,100 | [DAISO 官方](https://jp.daisonet.com/products/4560425562102) | 暫不直接填：官方文字只說可定位，未明示 Apple Find My 認證；需先從包裝確認相容標誌。若確認是同品，再補 ¥1,100／JAN 4560425562102 | 「DAISO 官網需登入才看庫存；各門市庫存未確認。」 |

## 已核對、價格不變或不宜填固定價（12 項）

| id | 現價 | 查到的新價 | 來源 | 是否需修改 | 現貨／庫存措辭建議 |
| --- | ---: | ---: | --- | --- | --- |
| `hareno-toothbrush` | ¥620 | ¥620 | [LOHACO 商品頁](https://lohaco.yahoo.co.jp/store/h-lohaco/item/ej33027/) | 否；一般刷毛單支仍為 ¥620，但頁面顯示缺貨 | 「此來源目前缺貨；不代表福岡藥妝無貨。另有螺旋刷毛 ¥730，勿混款。」 |
| `golden-seasoning` | ¥1,590 | ¥1,590 | [HORINISHI 官方](https://horinishi.jp/lineup) | 否 | 「官方仍列現行品；Alpen 福岡店庫存未確認。」 |
| `3coins-luggage-band` | ¥550 | ¥550 | [3COINS 官方](https://www.palcloset.jp/display/item/2424-3C7E621-00/) | 否 | 「官方商品頁仍存在；門市分店庫存未確認。」 |
| `kayanoya-dashi` | ¥2,268 | ¥2,268 | [茅乃舍官方](https://www.kayanoya.com/en/dashi/) | 否 | 「官方現行基本款；店內庫存仍以當日為準。」 |
| `cloudsurfermax` | ¥23,100 | ¥23,100 | [On 日本官方系列頁](https://www.on.com/ja-jp/shop/mens/shoes/cloudsurfer) | 否 | 「尺寸、楦寬、配色須現場確認。」 |
| `cloudsurfer2` | ¥20,900 | ¥20,900 | [On 日本官方系列頁](https://www.on.com/ja-jp/shop/mens/shoes/cloudsurfer) | 否 | 「尺寸、楦寬、配色須現場確認。」 |
| `cloud6` | ¥19,800 | ¥19,800 | [On 日本官方](https://www.on.com/ja-jp/products/cloud-6-m-3mf1007) | 否 | 「官方頁多個尺寸缺貨；線上狀態不代表福岡店。」 |
| `cloudrunner3` | ¥18,700 | ¥18,700 | [On 日本官方系列頁](https://www.on.com/ja-jp/shop/shoes/cloudtilt) | 否 | 「尺寸、楦寬、配色須現場確認。」 |
| `clifton11` | ¥19,800 | ¥19,800 | [HOKA 日本官方](https://hoka-jp-api.hoka.com/clifton-11/1176573.html) | 否 | 「官方頁依尺寸顯示有貨／缺貨；福岡天神店仍需另查。」 |
| `bondi9` | 見上表 | ¥24,200 | [HOKA 日本官方](https://hoka-jp-api.hoka.com/) | 見上表（本列僅補現貨觀察） | 「官方列為現行熱門款；尺寸與楦寬須現場確認。」 |
| `gaviota5` | 未填 | 發售定價 ¥27,500 | [Deckers Japan 官方新聞稿](https://prtimes.jp/main/html/rd/p/000000610.000003434.html) | 不建議直接當現價：2023 年款已未見於日本官網首頁現行主推，應視為舊款／剩餘庫存 | 「舊款庫存與出清價不定；到店以尺寸與架上價為準。」 |
| `morinaga-caramelic-pudding` | ¥321 | ¥321 | [森永製菓官方新聞稿](https://www.morinaga.co.jp/company/newsrelease/detail.php?no=3118) | 價格不變；提醒需加強 | 「2026-05-18 起便利商店期間限定，售完為止；8 月下旬找到的機率可能偏低。」 |

> 註：`bondi9` 同時出現在「需修改」與「已核對」是為了分別呈現價格補值與尺寸庫存提醒；計算 coverage 時只算 1 項。

## 2026-08-22 補查明細（原待查 47 項）

| id | 現價 | 2026-08-22 判讀 | 來源 | 是否需修改 | 現貨／庫存措辭建議 |
| --- | ---: | ---: | --- | --- | --- |
| `kombu` | ¥216 | 暫無現價；25 g 一時休賣 | [くらこん官方商品一覽](https://kurakon.jp/products/01/index.html)、[2026-04 休賣公告](https://www.kurakon.jp/news/oshirase/img/20260415/20260415.pdf) | 是：移除固定現價或改為暫停販售 | 「官方暫停販售；只可能買到通路剩餘庫存，勿列必買現貨。」 |
| `lion-stain-rescue` | ¥470 | 單件 ¥498；2 件組每件 ¥470 | [LOHACO 單件頁](https://lohaco.yahoo.co.jp/store/h-lohaco/item/8803586/)、[LION 官方規格](https://top.lion.co.jp/products/shimitori.htm) | 是：目前 ¥470 必須註明是 2 件組單件均價；單買用 ¥498 | 「LOHACO 仍可購買；福岡門市售價與庫存另查。」 |
| `toothbrush-p61` | ¥2,298 | 人工缺口：Costco 官方頁確認商品編號 83612／6 支組，但未對未登入訪客輸出價格 | [Costco Japan 官方](https://www.costco.co.jp/c/EBiSU-Premium-Care-Series-Toothbrush-6-PK/p/83612) | 暫不改價、不更新查證日 | 「Costco 會員價與倉庫庫存需登入或到店確認；先核對 6 支組。」 |
| `elecom-ex-g` | ¥5,080 | 官方標準價 ¥7,623，仍標示發售中 | [ELECOM 官方 M-XGM30DBSKBK](https://www.elecom.co.jp/products/M-XGM30DBSKBK.html) | 是：若卡片要表達官方價，改 ¥7,623；原 ¥5,080 只能保留為舊通路價 | 「官方現行品；Yodobashi 單品頁本輪 403，門市實售與庫存另查。」 |
| `elecom-ex-g-pro` | ¥6,590 | 官方標準價 ¥17,424 | [ELECOM 官方 M-XGM50MBSKBK](https://www.elecom.co.jp/products/M-XGM50MBSKBK.html) | 是：改官方價，或清楚標示原值是不可重驗的舊促銷價 | 同上。 |
| `sanwa-400-ma092` | ¥2,780 | ¥2,780；有貨、當日出貨、在庫限り | [Sanwa Direct 官方](https://direct.sanwa.co.jp/ItemPage/400-MA092) | 否 | 「官方線上有貨且屬庫存售完為止；福岡實體店未確認。」 |
| `sanwa-ma-ergw19` | ¥6,820 | 官方標準價 ¥7,480，但已標示「廃止」 | [Sanwa 官方](https://www.sanwa.co.jp/product/syohin?code=MA-ERGW19) | 是：改為停產／剩餘庫存，不把 ¥6,820 當現價 | 「停產品；只能找剩餘庫存，優先改買替代型號。」 |
| `sanwa-trackball-400-mawbttb190` | ¥5,480 | ¥5,480；有貨、可當日出貨 | [Sanwa Direct 官方](https://direct.sanwa.co.jp/ItemPage/400-MAWBTTB190BK) | 否 | 「官方線上有貨；福岡實體店仍需確認。」 |
| `logicool-ergo-m575-sp` | ¥8,400 | 官方直營特價 ¥7,700（原 ¥8,470），有貨 | [Logicool 官方](https://www.logicool.co.jp/ja-jp/shop/p/ergo-m575s-wireless-trackball.910-007027) | 是：改 ¥7,700；註明是可變動特價 | 「官網顯示有貨、可立即出貨；門市與指定白色款庫存另查。」 |
| `logicool-mx-ergo-s` | ¥17,700 | 官方現行列表 ¥17,800 起（原價最高 ¥19,580） | [Logicool 官方滑鼠列表](https://www.logicool.co.jp/ja-jp/products/mice.html?filters=ergonomic-line) | 是：改 ¥17,800 起，避免把不同保固版本混為單一價 | 「依型號／保固版本與門市庫存核對。」 |
| `logicool-mx-anywhere-3s` | ¥15,880 | 官方直營 ¥15,950；產品屬開放價 | [Logicool 官方列表](https://www.logicool.co.jp/ja-jp/products/mice.html?filters=ergonomic-line) | 是：改 ¥15,950 或標為開放價、門市價另計 | 「官網售價不代表福岡門市現貨。」 |
| `logicool-pebble-mouse-2-m350s` | ¥3,240 | 官方直營 ¥3,960，有貨 | [Logicool 官方](https://www.logicool.co.jp/ja-jp/products/mice/pebble-2-m350s-wireless-mouse.html) | 是：改 ¥3,960 | 「官網顯示有貨；藍色 M350sBL 與門市庫存另查。」 |
| `buffalo-bsmbw318bk` | ¥2,080 | 官方為開放價格；型號仍有支援頁 | [Buffalo 官方產品頁](https://www.buffalo.jp/product/detail/bsmbw318sv.html) | 是：`priceKind` 改開放價；¥2,080 只能作舊通路參考 | 「Yodobashi 本輪 403；到店按 BSMBW318BK 與架上價確認。」 |
| `skyflow` | ¥22,000 | 建議價 ¥22,000；可信通路頁該配色 22.0 cm 缺貨 | [Mega Sports 官方通路](https://store.megasports.jp/shop/g/g82436981/) | 價格否；加舊款／尺寸庫存提醒 | 「尺寸、性別與配色差異大；引用頁指定尺寸缺貨，不推定其他店有貨。」 |
| `transport2` | ¥22,000 | HOKA 日本官方現行價 ¥22,000 | [HOKA 日本官方搜尋頁](https://hoka-jp-api.hoka.com/on/demandware.store/Sites-HOKA-JP-Site/ja_JP/Coveo-Show?q=%E3%83%88%E3%83%A9%E3%83%B3%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%88&qs=1) | 否；來源改官方 | 「依男／女款、楦寬、尺寸與配色查庫存。」 |
| `protect-u-folding-umbrella` | ¥2,178 | 人工缺口：官方現行系列有 ¥1,760、¥2,178 三種款式，資料未填親骨與款式 | [PROTECT U 官方商店](https://www.id-official.com/) | 先補照片對應型號；不可用單一 ¥2,178 代表全系列 | 「超輕量／寬幅輕量 ¥2,178，基本款 ¥1,760；現場按包裝核對。」 |
| `coleman-auto-folding-umbrella` | ¥2,980 | 2026 新色仍為 Lawson 標準價 ¥2,980 | [Lawson 官方 2026 商品文](https://www.lawson.co.jp/lab/camp/art/1520758_9995.html) | 否；補 2026-04-14 發售與部分門市限定 | 「僅 Lawson 部分門市、Lawson Store 100 不販售；可能售完。」 |
| `pabron-ace-pro-x-36` | ¥1,495 | 官方希望價 ¥2,178 | [大正製藥官方新聞稿](https://www.taisho.co.jp/company/news/2023/20230822001374/) | 是：不要把比價站最低價當固定現價；改官方希望價或開放價語意 | 「藥妝實售可低於官方價；依 36 錠與當日架上價。」 |
| `taisho-kampo-stomach-48` | ¥1,760 | 官方希望價 ¥2,860；可信藥局當日網價 ¥2,178 | [大正製藥官方](https://www.taisho.co.jp/company/news/2021/20210601000779.html)、[杏林堂](https://www.kyorindo-onlineshop.jp/shop/g/g4987306009486/) | 是：建議填官方 ¥2,860，另註藥局常有折扣 | 「依 48 包核對；網價不代表福岡分店價。」 |
| `strawberry-chocolate-melon-pan` | ¥235 | 人工缺口：無品牌、通路、容量與 JAN，無法由品名唯一識別 | 無可合法對應來源 | 暫不改、不更新查證日 | 「照片限定商品；找不到同包裝即視為售罄／換款。」 |
| `jurokucha-630ml` | 未填 | 官方 630 ml 建議價 ¥180 稅別（¥194 含稅） | [Asahi 2025 商品目錄](https://www.asahiinryo.co.jp/products/digitalpamphlet/pdf/catalog_products_01.pdf) | 是：可補官方建議價 ¥194；便利商店架上價另計 | 「容量與標籤版本多；依 630 ml 包裝和架上價。」 |
| `gogo-no-kocha-ice-milk-tea` | 未填 | 人工缺口：品名不是現行唯一 SKU；一般 500 ml 午後紅茶奶茶通路價約 ¥95～¥170，不能據此替照片商品定價 | [KIRIN 現行商品資訊](https://products.kirin.co.jp/softdrink/softdrink/detail.html?id=8222) | 維持 pending；先補容量／JAN | 「同系列版本多；現場按照片包裝核對，不以近似款代替。」 |
| `asari-miso-soup` | ¥178 | 人工缺口：無品牌、容量、通路或 JAN，搜尋會對到多種商品 | 無可唯一對應來源 | 暫不改、不更新查證日 | 「便利商店輪替品；只按原照片同包裝與架上價購買。」 |
| `hanamidori-kiwami-spice` | ¥588 | ¥588；55 g、有貨 | [Profoods 官方通販](https://www.profoods.co.jp/i/0600551) | 否 | 「線上通路有貨；福岡超市／唐吉訶德鋪貨未確認。」 |
| `kobayashi-zukkinon-ointment` | ¥1,100 | 官方仍列現行品；製造商未列希望價，可信通路約 ¥815 起 | [小林製藥官方](https://www.kobayashi.co.jp/seihin/zkn_n/index.html)、[價格通路頁](https://kakaku.com/medicine-item/K0000528066/) | 是：改開放價；¥1,100 只作預算上限 | 「藥妝實售浮動；依 15 g／JAN 4987072083239。」 |
| `jojoen-salad-sauce` | ¥702 | 官方直營 ¥702 | [叙々苑官方](https://j-products.net/products/salad-tare.html) | 否 | 「官方可購買；福岡超市與門市庫存未確認。」 |
| `fundokin-ao-yuzu-kosho` | ¥443 | 官方直營 ¥443 | [Fundokin 官方商店](https://shop.fundokin.co.jp/c/ponzu_yuzu/07075) | 否 | 「官網可加入購物車；實體通路庫存另查。」 |
| `higashimaru-oyster-dashi-shoyu` | ¥421 | 官方希望價 ¥390 稅別＝¥421 含稅 | [Higashimaru 官方](https://www.higashimaru.co.jp/products/detail/pdt0103.html) | 否 | 「實體通路可有折扣；福岡分店鋪貨未確認。」 |
| `3coins-defrosting-plate` | ¥1,100 | ¥1,100；官方線上有貨，另有可查門市庫存頁 | [3COINS 官方](https://www.palcloset.jp/display/item/2412-KR542-0000/?b=3coins) | 否 | 「官方線上有貨；門市庫存頁具時間戳，出發當日再查福岡店。」 |
| `3coins-folding-camp-chair` | ¥660 | ¥660；官方線上無貨 | [3COINS 官方](https://www.palcloset.jp/display/item/2525-DN9065-000/?b=3coins) | 價格否；加缺貨提醒 | 「官網顯示無貨；門市可能有零星庫存，當日查分店。」 |
| `lulu-attack-ex-24` | ¥2,200 | 官方希望價 ¥2,200 | [第一三共官方](https://www.daiichisankyo-hc.co.jp/products/details/lulu_attack_ex/) | 否 | 「藥妝可有折扣；依 24 錠與當日架上價。」 |
| `ohta-isan-s-50` | ¥2,079 | 官方希望價 ¥2,079 | [太田胃散 2025 官方新聞稿](https://ohta-isan.co.jp/%E5%A4%AA%E7%94%B0%E8%83%83%E6%95%A3S%E3%83%BB%E5%A4%AA%E7%94%B0%E8%83%83%E6%95%A3%EF%BC%9C%E5%88%86%E5%8C%85%EF%BC%9ES_%E3%83%AA%E3%83%AA%E3%83%BC%E3%82%B9.pdf) | 否 | 「依新版 50 包規格；門市實售與庫存另查。」 |
| `daiso-toy-story-pendulum-clock` | ¥770 | ¥770；官方網店目前無庫存 | [DAISO 官方 Disney 專頁](https://jp.daisonet.com/pages/disney) | 價格否；加網店缺貨 | 「聯名品官網缺貨；不等於福岡門市完全無貨，出發日再查。」 |
| `cp-lip-lip-essence` | ¥1,980 | 官方直營 ¥1,980，可加入購物車 | [Astery 官方單品頁](https://www.astery.jp/product-page/cp-lip-cp%E3%83%AA%E3%83%83%E3%83%97-6ml-%E5%94%87%E7%94%A8%E7%BE%8E%E5%AE%B9%E6%B6%B2) | 否；來源改單品頁 | 「官方線上可購；實體藥妝鋪貨未確認。」 |
| `kinui-calm-7-soothing-serum` | ¥2,970 | ¥2,970；官方頁顯示 SOLD OUT／可登記補貨 | [KINUI 官方](https://kinui.tokyo/shop/products/sing_C7SS_default) | 價格否；加缺貨提醒 | 「官網售罄；福岡實體藥妝是否鋪貨未確認。」 |
| `salonpas-ae-240` | ¥3,410 | 2026 現行官方希望價：稅別 ¥3,100＝含稅 ¥3,410 | [久光製藥 2025 價格改定公告](https://www.hisamitsu.co.jp/company/pdf/news_release_250829.pdf) | 否 | 「官方價非藥妝成交價；依 240 枚與 JAN 核對。」 |
| `passtime-lx-premium-21` | ¥1,918 | 官方希望價 ¥2,398 | [祐徳薬品官方](https://www.yutokuyakuhin.co.jp/product/2-13-1.html) | 是：改官方希望價；原值是第三方網店折扣 | 「依 21 枚／JAN 4987235024451；藥妝實售可較低。」 |
| `toraku-royal-custard-pudding` | ¥226 | 官方確認現行規格；2026-04-01 新包裝希望價 ¥226 | [TORAKU 官方商品頁](https://www.toraku.co.jp/products/detail/1361/) | 否 | 「冷藏品，超市／便利商店鋪貨與到貨日不同；當日貨架為準。」 |
| `seasoning-container-pair` | ¥300 | 人工缺口：身分高度吻合 3COINS「調味料ポット 2 個組」¥330；原資料缺型號，仍需照片確認 | [3COINS 官方](https://www.palcloset.jp/display/item/2524-SJAR2P-000/?b=3coins) | 若照片確認同品，改 ¥330 並補型號；否則維持人工待核 | 「先核對外觀與品番；不要以泛稱保證現貨。」 |
| `kobayashi-harenurse-spray` | ¥798 | 官方希望價稅別 ¥800＝含稅 ¥880 | [小林製藥官方](https://www.kobayashi.co.jp/seihin/hrn_s/) | 是：改官方價 ¥880；原 ASKUL 折扣價不作固定現價 | 「藥妝實售浮動；依 15 ml。」 |
| `kobayashi-harenurse-18` | ¥2,541 | 官方希望價稅別 ¥2,310＝含稅 ¥2,541 | [小林製藥官方](https://www.kobayashi.co.jp/seihin/hrn/) | 否 | 「藥妝實售可較低；依 18 包。」 |
| `muji-3layer-sponge-grey` | ¥299 | 官方 ¥299，可加入購物車；可另查店舖庫存 | [MUJI 官方](https://www.muji.com/jp/ja/store/cmdty/detail/4550512975038) | 否 | 「官網可購；電話不受理庫存／保留，請用官網店舖庫存功能。」 |
| `calbee-satsumaimo-chips` | ¥181 | 第一方超市當日 ¥159.84；食品屬通路變動價 | [AEON Net Super](https://shop.aeon.com/netsuper/01050000004010/010500000040104901330805180.html) | 是：若採當日通路價改 ¥160；更穩妥為開放價＋預算 ¥160～¥181 | 「分店價與鋪貨不同；依 38 g／JAN 4901330805180。」 |
| `cio-smartcoby-pro-slim-ss-10k` | ¥6,280 | 官方 ¥6,280，可進入購買流程 | [CIO 官方](https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb35w2c1a-ssa10k-s/) | 否 | 「官方線上可購；福岡家電店庫存未確認，報完整型號。」 |
| `cio-smartcoby-slimii-wireless-2-2-pro-ss10k` | ¥8,580 | 官方 ¥8,580，可進入購買流程 | [CIO 官方](https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb35w1c-ss10k-s2w25/) | 否 | 同上。 |
| `cio-smartcoby-slimii-wireless-2-2-8k-special-edition` | ¥8,980 | BicCamera ¥8,980；黑／銀均標示店舖庫存有、2～3 日出貨 | [BicCamera 銀色頁，可切黑色](https://www.biccamera.com/bc/item/15238471/) | 否 | 「通路頁有店舖庫存，但未指定福岡天神館；出發日用店舖庫存再查。」 |
| `cio-smartcoby-pro-slim-cable` | ¥5,980 | 官方 ¥5,980，可進入購買流程 | [CIO 官方](https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/cio-mb35w2c-10000-sc/) | 否 | 「官網仍有商品頁；福岡家電店需報型號查庫存。」 |
| `cio-smartcoby-pro-cable-c` | ¥6,578 | 官方 ¥6,578，可加入購物車 | [CIO 官方](https://connectinternationalone.co.jp/cioproduct/mobilebattery/smartcoby/smartcoby-pro-cable-c/) | 否 | 「官網仍可購；實體店可能僅剩部分顏色。」 |

## 人工缺口與執行優先序

1. 人工缺口共 6 項：`toothbrush-p61`（Costco 會員／動態價格未公開）、`protect-u-folding-umbrella`（同系列三款、資料無型號）、`strawberry-chocolate-melon-pan`、`asari-miso-soup`、`gogo-no-kocha-ice-milk-tea`、`seasoning-container-pair`（後四者只有泛稱／照片，無法唯一識別）。這 6 項不得更新 `priceCheckedAt`。
2. `seasoning-container-pair` 已找到高度吻合的 3COINS 兩入組，但因原資料沒有型號，仍應由照片確認後才從 ¥300 改 ¥330。
3. 優先處理停售／錯價：`kombu`、`sanwa-ma-ergw19`、兩款 ELECOM、四款 Logicool、兩款大正藥品、`passtime-lx-premium-21` 與 `kobayashi-harenurse-spray`。
4. 所有 `stores` 只代表購物動線候選；沒有福岡分店即時庫存證據時，顯示文字統一用「可詢問門市」或「現場確認」。
5. 出發當日再按官方庫存工具重查 DAISO、3COINS、MUJI、BicCamera；便利商店冷藏／期間限定品一律顯示「可能售完」。
