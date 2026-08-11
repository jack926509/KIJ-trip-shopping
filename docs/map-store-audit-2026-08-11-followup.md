# 商店地圖二次稽核與修正（2026-08-11 追加）

延續同日稍早的 `map-coordinate-audit-2026-08-11.md`、`map-store-audit-2026-08-11.md`，針對地圖 29 家店的位置、營業時間與商品連結再次以外部搜尋逐筆核對，發現並修正下列問題。

## 修正項目

| 地圖 id | 問題 | 修正後 |
| --- | --- | --- |
| `hoka-fukuoka-tenjin` | 地址樓層誤植為 B1F；與同筆資料的 `mapsQuery`（寫 1F）自相矛盾。多方來源（HULIC 官方頁、天神在地新聞、fashion-press.net）皆確認為 1F。 | 地址改回 `HULIC SQUARE FUKUOKA TENJIN 1F` |
| `matsumoto-kiyoshi-hakata-station-underground` | 營業時間寫 08:00–22:00，但條目自身引用的官方來源（博多駅地下街 e-ekichika.com）標示物販類為 10:00–20:00，資料與自己附的來源矛盾。 | 改為 10:00–20:00，並在備註說明第三方網站另有不同記載 |
| `sundrug-uomachi-ginten-street` | 營業時間僅寫「依官方當日公告」，未提供任何具體時段。 | 改為 09:00–20:30（多個零售資訊站一致） |
| `kayanoya-kokura-izutsuya` | 營業時間僅寫「依井筒屋當日公告」；地址未載樓層。 | 改為 10:00–19:00；地址補上「小倉井筒屋 本館 B1F」 |
| `kayanoya-hakata-station-daitos` | 營業時間僅寫「依博多 DEITOS 當日公告」；地址未載樓層。 | 改為 08:00–21:00（茅乃舍官方店鋪頁）；地址補上「1F みやげもん市場」 |
| `daiso-lachic-fukuoka-tenjin` | 營業時間僅寫「依商場營業時間」；地址未載樓層。 | 改為 10:00–20:00（DAISO 官方門市頁）；地址補上「福岡三越 LACHIC 9F」 |

## 已核對、確認無誤的店家（不需修改）

以下店家逐筆以外部搜尋核對地址／樓層／營業時間，與現有資料一致：

- `sports-depo-canal-city-hakata`（Alpen FUKUOKA）
- `don-quijote-nakasu`、`don-quijote-fukuoka-tenjin`、`don-quijote-kokura-uomachi`
- `daikoku-drug-tenjin-building`
- `welcia-one-fukuoka-tenjin`
- `maxvalu-express-hakata-gion`
- `matsumoto-kiyoshi-kokura-station-south`
- `matsumoto-kiyoshi-tenjin-underground`
- `cocokara-fine-kokura-station`（含與 `daiso-amu-plaza-kokura` 同樓層 B1F 的備註屬實）
- `cocokara-fine-fukuoka-parco`
- `biccamera-tenjin-1`
- `hands-hakata`

## 商品—店家連結（品項）核對

逐一比對 48 項商品的 `stores`／`storeCandidates` 與對應店家的 `category`／`brand`，未發現類別明顯不符的錯誤連結（例如藥妝店只掛藥品／日用品、3COINS 只掛日用雜貨、Kayanoya 只掛食品、LAWSON 只掛超商即食品等），品項對應合理。

## 未變更事項（維持既有判斷）

- `map-store-audit` 稽核指出的 6 家「有資料但無商品連結」店家（Cocokara Fine 小倉站、Sundrug 魚町銀天街等）本次不刪除，理由同稍早的 README 稽核：屬同連鎖藥妝在天神／小倉的其他分店，資料完整可作備用據點。
- AMU PLAZA 小倉商場內三家店（Cocokara Fine／DAISO／3COINS）座標仍共用建物代表點，3COINS 實際樓層為西館 5F、與 Cocokara Fine／DAISO 所在的 B1F 不同，惟現有備註未宣稱三者同層，不構成錯誤。

## 查核方法

以 WebSearch 查詢各店家官方頁與至少一個第三方資訊站（NAVITIME、Yahoo!地圖、Tokubai 等）交叉核對地址、樓層與營業時間；僅在多來源一致且與官方頁不衝突時採用。仍有第三方來源分歧的店家（如博多站地下街松本清）已在備註中註明，不做無根據的單一數字宣稱。
