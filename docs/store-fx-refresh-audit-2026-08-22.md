# 門市營業時間與 JPY／TWD 匯率查核（2026-08-22）

查核時間：2026-08-22 12:28（Asia/Taipei）

## 結論

- 共盤點 `assets/stores.js` 的 45 家門市。
- 43 家已由品牌官方門市頁或商場官方店鋪頁直接確認；2 家因官方頁拒絕自動讀取而保留待人工確認。
- 確定需改 2 家：
  - `matsumoto-kiyoshi-hakata-station-underground`：`10:00–20:00` → `08:00–22:00`。
  - `sundrug-uomachi-ginten-street`：`09:00–20:30` → `09:30–21:15`。
- 最新可取得的臺灣銀行牌告是 2026-08-21 16:21:46（2026-08-22 為週六）。網站參考換算建議由 `0.2035` 更新為 `0.2032`，採「日圓即期賣出」以較貼近使用者用新臺幣取得日圓的成本。這不是信用卡最終入帳價，仍可能另有海外交易手續費。

## 逐店查核

「相同」表示目前 `hours` 可保留；「修改」表示第一方來源有明確不同資料；「待人工」表示官方頁存在但本次無法讀取內容。

| # | id | 現有 hours | 官方最新 hours | 直接來源 | 判定 |
|---:|---|---|---|---|---|
| 1 | `hoka-fukuoka-tenjin` | 11:00–20:00 | 11:00–20:00 | [HOKA 採用的 Locally 門市頁](https://www.locally.com/store/417342/hoka-fukuoka-tenjin) | 相同 |
| 2 | `alpen-fukuoka-canal-city-hakata` | 10:00–21:00 | 10:00–21:00 | [Alpen 官方門市頁](https://store.alpen-group.jp/Form/RealShop/ShopDetail.aspx?rsid=5400) | 相同 |
| 3 | `murasaki-sports-canal-city-hakata` | 10:00–21:00 | 10:00–21:00 | [Canal City 官方店鋪頁](https://canalcity.co.jp/shop/detail/opa-0084?tenant_cd=opa-0084) | 相同 |
| 4 | `don-quijote-nakasu` | 24 小時營業 | 24 小時營業 | [唐吉訶德官方門市頁](https://www.donki.com/store/shop_detail.php?shop_id=278) | 相同 |
| 5 | `matsumoto-kiyoshi-hakata-station-underground` | 10:00–20:00 | 08:00–22:00；無休 | [松本清官方門市頁](https://www.matsukiyococokara-online.com/map/?kid=20805173) | **修改**；精確門市頁優先於地下街一般物販時間 |
| 6 | `daikoku-drug-tenjin-building` | 平日 09:05–22:20；六日及假日 10:05–21:20 | 09:05–22:20；六日假日 10:05–21:20 | [大國藥妝官方門市頁](https://daikokudrug.com/store/81/) | 相同 |
| 7 | `welcia-one-fukuoka-tenjin` | 10:00–22:00（藥局服務另有時段） | 店鋪每日 10:00–22:00；調劑一至六 10:00–14:00、15:00–19:00，日祝休 | [Welcia 官方門市頁](https://store.welcia.co.jp/welcia/spot/detail?code=3796D) | 相同 |
| 8 | `3coins-plus-mina-tenjin` | 10:00–21:00 | 10:00–21:00 | [ミーナ天神官方店鋪頁](https://www.mina-tenjin.com/shop/detail.php?shopId=069) | 相同 |
| 9 | `daiso-hakata-bus-terminal` | 09:00–21:00 | 09:00–21:00 | [DAISO 官方門市頁](https://www.daiso-sangyo.co.jp/shop/detail/001516) | 相同 |
| 10 | `maxvalu-express-hakata-gion` | 24 小時營業 | 24 小時營業 | [AEON 九州官方門市頁](https://tenpo.aeon-kyushu.info/maxvalu/detail/mvex-hakatagion/) | 相同 |
| 11 | `lopia-hakata-yodobashi` | 10:00–21:00 | 10:00–21:00 | [ロピア官方門市頁](https://lopia.jp/shops/hakatayodobashi) | 相同 |
| 12 | `reganet-tenjin` | 平日 08:00–23:00／週末例假日 08:00–22:00 | 平日 08:00–23:00；六日假日 08:00–22:00 | [ソラリアステージ官方店鋪頁](https://www.solariastage.com/shops/reganet/) | 相同 |
| 13 | `aeon-shoppers-fukuoka-tenjin` | 09:00–22:00 | 09:00–22:00 | [AEON 九州官方門市頁](https://tenpo.aeon-kyushu.info/aeon/detail/shoppers-fukuoka/) | 相同 |
| 14 | `matsumoto-kiyoshi-kokura-station-south` | 07:00–24:00 | 07:00–24:00；無休 | [松本清官方門市頁](https://www.matsukiyococokara-online.com/map/?kid=20805475) | 相同 |
| 15 | `cocokara-fine-kokura-station` | 09:00–22:00 | 09:00–22:00；無休 | [Cocokara Fine 官方門市頁](https://www.matsukiyococokara-online.com/map/?kid=20001291) | 相同 |
| 16 | `daiso-amu-plaza-kokura` | 10:00–20:00 | 10:00–20:00 | [DAISO 官方門市頁](https://www.daiso-sangyo.co.jp/shop/detail/005500) | 相同；另見休館提醒 |
| 17 | `3coins-plus-amu-plaza-kokura` | 10:00–20:00 | 10:00–20:00 | [アミュプラザ小倉官方店鋪頁](https://www.amuplaza.jp/floor/detail/?cd=000100) | 相同；另見休館提醒 |
| 18 | `sundrug-uomachi-ginten-street` | 09:00–20:30 | 09:30–21:15 | [Sundrug 官方門市頁](https://sundrug-online.com/blogs/search-store/2005) | **修改** |
| 19 | `don-quijote-kokura-uomachi` | 09:00–03:00 | 09:00–翌日 03:00 | [唐吉訶德官方門市頁](https://www.donki.com/store/shop_detail.php?shop_id=645) | 相同 |
| 20 | `youme-mart-kokura` | 09:00–22:00 | 09:00–22:00 | [ゆめマート北九州官方門市頁](https://www.youme-kitakyushu.co.jp/store/451kokura.htm) | 相同 |
| 21 | `lopia-kokura-riverwalk` | 10:00–20:00 | 10:00–20:00 | [ロピア官方門市頁](https://lopia.jp/shops/riverwalk) | 相同 |
| 22 | `matsumoto-kiyoshi-tenjin-underground` | 09:00–22:30（元日休） | 09:00–22:30；元日休 | [松本清官方門市頁](https://www.matsukiyococokara-online.com/map/?kid=20805164) | 相同 |
| 23 | `cocokara-fine-fukuoka-parco` | 10:00–20:30 | 店鋪 10:00–20:30；調劑 10:00–19:30 | [Cocokara Fine 官方門市頁](https://www.matsukiyococokara-online.com/map?kid=20002399) | 相同 |
| 24 | `loft-mina-tenjin` | 10:00–20:00 | 10:00–20:00；免稅受理至 19:30 | [Loft 官方門市頁](https://www.loft.co.jp/shop_list/detail.php?shop_id=29) | 相同 |
| 25 | `matsumoto-kiyoshi-mina-tenjin` | 08:00–22:00 | 08:00–22:00 | [ミーナ天神官方店鋪頁](https://www.mina-tenjin.com/shop/detail.php?shopId=070) | 相同 |
| 26 | `daiso-lachic-fukuoka-tenjin` | 10:00–20:00 | 10:00–20:00 | [DAISO 官方門市頁](https://www.daiso-sangyo.co.jp/shop/detail/001789) | 相同 |
| 27 | `daikoku-drug-tenjin-nishidori` | 10:05–23:20 | 10:05–23:20 | [大國藥妝官方門市頁](https://daikokudrug.com/store/640/) | 相同 |
| 28 | `don-quijote-fukuoka-tenjin` | 24 小時營業 | 24 小時營業 | [唐吉訶德官方門市頁](https://www.donki.com/store/shop_detail.php?shop_id=461) | 相同 |
| 29 | `lawson-hakata` | 24 小時營業 | 24 小時營業 | [Lawson 官方訪日門市頁](https://www.lawson.co.jp/service/others/in/) | 相同 |
| 30 | `lawson-nishitetsu-fukuoka-tenjin-south` | 24 小時營業 | 24 小時營業 | [Lawson 官方訪日門市頁](https://www.lawson.co.jp/service/others/in/) | 相同 |
| 31 | `lawson-kokura-uomachi-2chome` | 24 小時營業 | 24 小時營業 | [Lawson 官方訪日門市頁](https://www.lawson.co.jp/service/others/in/) | 相同 |
| 32 | `biccamera-tenjin-1` | 10:00–21:00 | 10:00–21:00；全年無休 | [BicCamera 官方門市頁](https://www.biccamera.com/bc/i/shop/shoplist/shop026.jsp) | 相同 |
| 33 | `biccamera-tenjin-2` | 10:00–21:00 | 10:00–21:00；全年無休 | [BicCamera 官方門市頁](https://www.biccamera.com/bc/i/shop/shoplist/shop018.jsp) | 相同 |
| 34 | `yodobashi-camera-hakata` | 09:30–22:00，全年無休 | 本次未能從官方頁直接讀取 | [Yodobashi 官方門市頁](https://www.yodobashi.com/ec/store/0088/) | **待人工**；官方頁回應 403，暫勿改 |
| 35 | `bestdenki-kokura-ekimae` | 10:00–20:00 | 本次未能從官方頁直接讀取 | [Best Denki 官方門市頁](https://www.bestdenki.ne.jp/store/%E5%B0%8F%E5%80%89%E9%A7%85%E5%89%8D%E5%BA%97/) | **待人工**；官方頁回應 403，暫勿改 |
| 36 | `seven-eleven-tenjin-underground` | 07:00–23:00 | 07:00–23:00 | [天神地下街官方店鋪頁](https://www.tenchika.com/shop/seven-eleven/) | 相同 |
| 37 | `familymart-hakata-station` | 05:00–24:30 | 05:00–24:30 | [FamilyMart 官方門市頁](https://store.family.co.jp/points/78358) | 相同 |
| 38 | `familymart-kokura-station` | 05:30–23:30 | 05:30–23:30 | [FamilyMart 官方門市頁](https://store.family.co.jp/points/78237) | 相同 |
| 39 | `kayanoya-hakata-station-daitos` | 08:00–21:00 | 08:00–21:00；全年無休 | [茅乃舎官方門市頁](https://www.kayanoya.com/shop/hakata-deitos/) | 相同 |
| 40 | `kayanoya-kokura-izutsuya` | 10:00–19:00 | 10:00–19:00；依井筒屋營業日 | [茅乃舎官方門市頁](https://www.kayanoya.com/shop/kokura-izutsuya/) | 相同 |
| 41 | `hands-hakata` | 10:00–20:00 | 10:00–20:00 | [Hands 官方門市頁](https://store.hands.net/hakata/) | 相同；2026-08-25 休業 |
| 42 | `muji-tenjin-shoppers-fukuoka` | 09:00–21:00 | 09:00–21:00 | [無印良品官方門市頁](https://www.muji.com/jp/ja/shop/detail/046700) | 相同；官方註明不受理電話庫存確認或保留 |
| 43 | `muji-sent-city-kitakyushu` | 10:00–20:00 | 10:00–20:00 | [無印良品官方門市頁](https://www.muji.com/jp/ja/shop/detail/045633) | 相同；官方註明不受理電話庫存確認或保留 |
| 44 | `uniqlo-fukuoka-tenjin` | 10:00–20:00 | 10:00–20:00 | [ミーナ天神官方店鋪頁](https://www.mina-tenjin.com/shop/detail.php?shopId=074) | 相同 |
| 45 | `montbell-fukuoka-tenjin` | 10:30–21:00 | 10:30–21:00；全年無休 | [Montbell 官方門市頁](https://store.montbell.jp/search/shopinfo/?shop_no=618936) | 相同 |

## 臨時休館與出發前提醒

- アミュプラザ小倉官方頁公告 **2026-08-25（星期二）休館**。因此館內 `daiso-amu-plaza-kokura` 與 `3coins-plus-amu-plaza-kokura` 當日不可排入採買。
- Hands 博多官方頁亦公告 **2026-08-25（星期二）因アミュプラザ博多休館而休業**。
- 連鎖店即使有商品取扱資訊，也不等於目標品項、顏色、尺寸或數量有現貨。出發前提醒應維持「以官方庫存查詢／門市當日回覆為準」，不要把候選店寫成已確認有貨。
- 無印良品兩店官方頁明示不受理電話庫存確認或保留，應使用官網／App 的店鋪庫存功能或現場確認。

## 匯率依據與建議值

來源：[臺灣銀行牌告匯率](https://rate.bot.com.tw/xrt?Lang=zh-TW)及[日圓歷史牌告](https://rate.bot.com.tw/xrt/quote/day/JPY/spot/1?Lang=zh-TW)。

最新可取得牌告（2026-08-21 16:21:46，Asia/Taipei）：

| 類別 | 買入 | 賣出 |
|---|---:|---:|
| 現金匯率 | 0.1914 | 0.2042 |
| 即期匯率 | 0.1982 | 0.2032 |

網站用途是把日圓商品價換成「約新臺幣」供預算參考。建議採 `0.2032`（即期賣出），理由如下：

1. 使用者的方向是以新臺幣支付／取得日圓購買力，應看銀行「賣出」而非「買入」。
2. 即期價比現鈔價更接近刷卡或電子支付的基礎換算，但實際發卡組織匯率與海外手續費仍會不同。
3. 保留四位小數可直接寫成 `JPY_TWD_RATE = 0.2032`；查核日應寫 `JPY_TWD_RATE_CHECKED_AT = '2026-08-21'`，不能寫 8 月 22 日，因為最新牌告實際日期是 8 月 21 日。

## Coverage 與缺口

- 已盤點：45／45。
- 已取得第一方頁面可讀證據：43／45（95.6%）。
- 待人工開啟官方頁確認：2／45（`yodobashi-camera-hakata`、`bestdenki-kokura-ekimae`）。這兩筆目前不建議更改。
- 本文件只記錄查核結果，未修改 `assets/stores.js` 或 `assets/products.js`。
