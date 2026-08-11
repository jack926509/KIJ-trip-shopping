# 商店地圖座標稽核（2026-08-11）

## 結論

目前 `map.html` 的 29 筆座標不可繼續沿用。以品牌／商場官方地址重新查詢日本國土地理院地名搜尋 API 後：

- 14 家偏差超過 100 公尺，屬嚴重錯位。
- 12 家偏差 31–100 公尺，仍可能導向錯誤街廓或建物另一側。
- 只有 3 家在 30 公尺內。

因此後續應一次更換全部 29 筆座標，不應只修最大偏差的幾家。

## 查核方法與限制

1. 地址以品牌或商場官方現行門市頁為準；上一輪已補正 Alpen、Murasaki、天神西通大國藥妝、福岡天神唐吉訶德、mina 天神松本清與 Sundrug 魚町銀天街地址。
2. 以日本國土地理院地名搜尋 API `https://msearch.gsi.go.jp/address-search/AddressSearch?q=` 取得地址座標。國土地理院官方採購規格亦列出此 API 與使用例。
3. 距離為現有座標與國土地理院結果間的球面近似距離，四捨五入至公尺。
4. 商場、車站地下街與百貨公司內的店家，只能定位到建物或地址代表點，不能聲稱精確到樓層櫃位或入口。相同建物內的多家店應共用建物座標，另由卡片標示樓層。

## 29 家座標差異表

| 地圖 id | 建議緯度 | 建議經度 | 現有偏差 | 判定 |
| --- | ---: | ---: | ---: | --- |
| `hoka-fukuoka-tenjin` | 33.590679 | 130.397797 | 233 m | 嚴重錯位 |
| `sports-depo-canal-city-hakata` | 33.589085 | 130.410233 | 141 m | 嚴重錯位 |
| `murasaki-sports-canal-city-hakata` | 33.589966 | 130.411606 | 28 m | 可接受但仍統一更新 |
| `don-quijote-nakasu` | 33.593967 | 130.405731 | 97 m | 偏差 |
| `matsumoto-kiyoshi-hakata-station-underground` | 33.589783 | 130.420593 | 163 m | 嚴重錯位；地下街代表點 |
| `daikoku-drug-tenjin-building` | 33.591782 | 130.398407 | 24 m | 可接受但仍統一更新 |
| `welcia-one-fukuoka-tenjin` | 33.590576 | 130.400360 | 70 m | 偏差 |
| `3coins-plus-mina-tenjin` | 33.592609 | 130.398712 | 270 m | 嚴重錯位 |
| `daiso-hakata-bus-terminal` | 33.591270 | 130.419083 | 236 m | 嚴重錯位 |
| `maxvalu-express-hakata-gion` | 33.592213 | 130.411224 | 329 m | 嚴重錯位 |
| `matsumoto-kiyoshi-kokura-station-south` | 33.886395 | 130.881302 | 52 m | 偏差 |
| `cocokara-fine-kokura-station` | 33.887192 | 130.881485 | 121 m | 嚴重錯位；站體代表點 |
| `daiso-amu-plaza-kokura` | 33.887192 | 130.881485 | 84 m | 偏差；站體代表點 |
| `3coins-plus-amu-plaza-kokura` | 33.887192 | 130.881485 | 87 m | 偏差；站體代表點 |
| `sundrug-uomachi-ginten-street` | 33.884033 | 130.879929 | 77 m | 偏差 |
| `don-quijote-kokura-uomachi` | 33.882725 | 130.880371 | 90 m | 偏差 |
| `matsumoto-kiyoshi-tenjin-underground` | 33.589390 | 130.398041 | 101 m | 嚴重錯位；地下街代表點 |
| `cocokara-fine-fukuoka-parco` | 33.591072 | 130.398087 | 60 m | 偏差 |
| `matsumoto-kiyoshi-mina-tenjin` | 33.592609 | 130.398712 | 94 m | 偏差 |
| `daiso-lachic-fukuoka-tenjin` | 33.587925 | 130.400894 | 175 m | 嚴重錯位 |
| `daikoku-drug-tenjin-nishidori` | 33.586323 | 130.397400 | 97 m | 偏差 |
| `don-quijote-fukuoka-tenjin` | 33.586506 | 130.398010 | 181 m | 嚴重錯位 |
| `lawson-hakata` | 33.589935 | 130.414841 | 243 m | 嚴重錯位 |
| `lawson-nishitetsu-fukuoka-tenjin-south` | 33.587902 | 130.400375 | 246 m | 嚴重錯位 |
| `lawson-kokura-uomachi-2chome` | 33.883812 | 130.879944 | 37 m | 偏差 |
| `biccamera-tenjin-1` | 33.586903 | 130.401108 | 391 m | 嚴重錯位 |
| `kayanoya-hakata-station-daitos` | 33.589912 | 130.420395 | 29 m | 可接受但仍統一更新；站體代表點 |
| `kayanoya-kokura-izutsuya` | 33.885441 | 130.877686 | 359 m | 嚴重錯位 |
| `hands-hakata` | 33.589912 | 130.420395 | 44 m | 偏差；站體代表點 |

## 最大風險點

1. `biccamera-tenjin-1`：偏差約 391 m，現有標記不在官方門牌代表點。
2. `kayanoya-kokura-izutsuya`：偏差約 359 m，已落到井筒屋以東的魚町方向。
3. `maxvalu-express-hakata-gion`：偏差約 329 m。
4. `3coins-plus-mina-tenjin`：偏差約 270 m。
5. `lawson-nishitetsu-fukuoka-tenjin-south`：偏差約 246 m。
6. `lawson-hakata`：偏差約 243 m。

## 實作前的必要規則

- 將 `lat`／`lng` 全數替換成上表值。
- 同步先修正官方地址，再產生座標；不可從錯誤或只到丁目地址反推位置。
- Google Maps 導航仍使用完整店名＋官方地址，座標只供 Leaflet 顯示。
- 商場內重疊標記不得以任意偏移假裝成實際櫃位；若影響操作，應使用重疊標記展開或店家清單聚焦。
- 更新後需跑資料驗證、座標偏差檢查，並實際開啟桌面與手機地圖確認 29 個標記。
