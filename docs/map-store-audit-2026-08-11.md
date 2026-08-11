# 商店地圖現況稽核（2026-08-11）

## 結論

- 逐筆以品牌或商場官方頁查核目前地圖的 29 家店，**尚未發現已確定歇業者**。
- 發現 6 筆現存但名稱、地址、樓層或營業時間不精確的資料，應在下一次更新時修正。
- 有 5 家店未附官方門市連結；即使仍營業，也不應再只留 Google Maps 搜尋字串。
- 商品清單有 48 項，其中 21 項沒有任何地圖店家連結。另 Welcia、HANDS、DAISO 博多巴士總站都已在地圖上，但目前沒有對應商品；不能宣稱地圖已依商品清單完整涵蓋。

## 已確認仍營業（官方來源）

| 區域 | 店家 | 查核結論 | 官方來源 |
| --- | --- | --- | --- |
| 博多／天神 | HOKA Fukuoka Tenjin | 營業中 | [HULIC SQUARE](https://www.hulic.co.jp/business/rent/square/fukuokatenjin/) |
| 博多 | Alpen FUKUOKA | 營業中 | [Canal City 樓層頁](https://canalcity.co.jp/shopsearch/floor/103) |
| 博多 | ムラサキスポーツ | 營業中 | [Canal City 店鋪頁](https://canalcity.co.jp/shop/detail/opa-0084?tenant_cd=opa-0084) |
| 博多 | 唐吉訶德中洲店、松本清博多站地下街店、DAISO 博多巴士總站店、MaxValu Express 博多祇園店 | 營業中 | [唐吉訶德](https://www.donki.com/store/shop_detail.php?add=1&shop_id=278)、[松本清](https://www.matsukiyococokara-online.com/map?kid=20805173)、[DAISO](https://www.daiso-sangyo.co.jp/shop/detail/001516)、[AEON 九州](https://tenpo.aeon-kyushu.info/maxvalu/detail/mvex-hakatagion/) |
| 天神 | Welcia ONE FUKUOKA BLDG.、3COINS+plus mina、松本清天神地下街、Cocokara Fine 福岡 PARCO、DAISO LACHIC、BicCamera 天神 1 號館、HANDS 博多店 | 營業中 | 各品牌或商場現行門市頁；[DAISO LACHIC](https://www.daiso-sangyo.co.jp/shop/detail/001789)、[BicCamera](https://biccamera.co.jp/language/chinese-tenjin.html)、[HANDS](https://store.hands.net/hakata/) |
| 小倉 | 松本清小倉站南口、Cocokara Fine 小倉站、DAISO／3COINS+plus AMU PLAZA 小倉、Sundrug 魚町銀天街、唐吉訶德小倉魚町、LAWSON 小倉魚町二丁目、茅乃舍小倉井筒屋 | 營業中 | [松本清](https://www.matsukiyococokara-online.com/map/?kid=20805475)、[Cocokara Fine](https://www.matsukiyococokara-online.com/map?kid=20001291)、[DAISO](https://www.daiso-sangyo.co.jp/shop/detail/005500)、[3COINS](https://www.palcloset.jp/addons/pal/shoplist/detail/?b=3coins&brandshop_no=2234)、[唐吉訶德](https://www.donki.com/store/shop_detail.php?add=1&shop_id=645)、[茅乃舍](https://www.kubara.jp/shoplist/kayanoya/) |
| 博多／天神／小倉 | LAWSON 博多、西鐵福岡天神站南口、小倉魚町二丁目 | 營業中 | [LAWSON 官方門市資訊](https://www.lawson.co.jp/service/others/in/) |
| 博多／小倉 | 茅乃舍博多站 DEITOS、茅乃舍小倉井筒屋 | 營業中 | [茅乃舍官方店鋪列表](https://www.kubara.jp/shoplist/kayanoya/) |

## 必須修正的現存店家資料

| 地圖 id | 現況問題 | 官方核對後應採用資料 |
| --- | --- | --- |
| `hoka-fukuoka-tenjin` | 樓層寫成 1F。 | HULIC SQUARE 官方列為 B1F；地址仍為天神 2-8-49。 |
| `sports-depo-canal-city-hakata` | 舊店名「SPORTS DEPO Flagship Store…」。 | 改為「Alpen FUKUOKA」；Canal City 官方列南棟 1–3F。 |
| `murasaki-sports-canal-city-hakata` | 名稱寫成「キャナルシティオーパ 3F」。 | 改為「キャナルシティ博多 Center Walk 3F」。 |
| `daikoku-drug-tenjin-nishidori` | 地址只寫到今泉 1 丁目，營業時間未明列。 | 今泉 1-19-19 アスティオン天神西；10:05–23:20。 |
| `don-quijote-fukuoka-tenjin` | 地址只寫到今泉 1 丁目，營業時間未明列。 | 今泉 1-20-17；24 小時營業。 |
| `matsumoto-kiyoshi-mina-tenjin` | 營業時間寫「依公告」。 | mina 天神官方列 B1F，08:00–22:00。 |

## 補齊官方來源連結

下列店家現仍營業，但 `map.html` 未寫 `officialUrl` 或 `officialSources`：

- `sundrug-uomachi-ginten-street`
- `matsumoto-kiyoshi-mina-tenjin`
- `daiso-lachic-fukuoka-tenjin`
- `daikoku-drug-tenjin-nishidori`
- `don-quijote-fukuoka-tenjin`

## 商品覆蓋缺口

目前沒有地圖店家連結的 21 項商品，包含防丟器、牙刷／去漬液、晴雨傘、腰間風扇、常備藥、調味料／醬料、DAISO 掛鐘與唇部美容液。

後續應分兩個層級處理：

1. 可由品牌或官方門市證實的項目才標示「可買」。
2. 一般通路合理但未能證實庫存的項目，僅標示「可到店確認」，不得沿用目前「這裡可買 N 項」的文字。

優先補齊的店家—商品關係：DAISO（掛鐘與防丟器）、HANDS（晴雨傘與旅行雜貨）、Welcia／松本清／Cocokara Fine／大國藥妝（牙刷、去漬液、常備藥與唇部保養）、MaxValu／唐吉訶德（調味料與醬料）、3COINS（腰間風扇與旅行雜貨）。這些先標為「到店確認」，待找到該商品在指定門市的官方庫存或門市頁證據後，才能升級為「可買」。
