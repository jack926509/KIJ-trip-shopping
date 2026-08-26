/* 店家資料的單一來源。
 *
 * 這份資料原本內嵌在 map.html，而 index.html 另外手抄了一份 STORE_SUMMARIES
 * 只存「顯示名稱＋分類」。兩份副本各自演化的結果是 18 家店在兩頁顯示不同名稱，
 * 其中 sports-depo-canal-city-hakata 更嚴重：清單頁寫「SPORTS DEPO キャナルシティ博多店」、
 * 地圖頁卻是「Alpen FUKUOKA」——同一個 id 指到兩家不同的店，站在運河城會找錯。
 * 抽成這個檔案後兩頁共用同一筆記錄，那類漂移不可能再發生。
 *
 * 每筆的兩個名稱是刻意並存、且相鄰擺放，方便一眼核對：
 *   name     ── 地圖標記與店家卡片用，比照招牌的日文正式名稱
 *   listName ── 清單頁的店家連結用，較短的中文慣用名
 * 其餘欄位沿用原本 map.html 的定義；referenceOnly 表示刻意只作地點參考、暫不連商品。
 */
export const STORES = [
  {
    id: 'hoka-fukuoka-tenjin',
    name: 'HOKA Fukuoka Tenjin',
    listName: 'HOKA Fukuoka Tenjin',
    type: '鞋店',
    brand: 'HOKA',
    category: 'shoe',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2-8-49 HULIC SQUARE FUKUOKA TENJIN 1F',
    hours: '11:00–20:00',
    note: 'HOKA 品牌獨立門市；電話 092-401-2211。目標鞋款與尺寸須於出發前確認。',
    lat: 33.590679,
    lng: 130.397797,
    officialUrl: 'https://www.locally.com/store/417342/hoka-fukuoka-tenjin',
    officialSources: [
      { label: 'HOKA 採用的 Locally 定位器門市明細', url: 'https://www.locally.com/store/417342/hoka-fukuoka-tenjin' },
      { label: 'HULIC SQUARE FUKUOKA TENJIN 第一方店鋪頁', url: 'https://www.hulic.co.jp/business/rent/square/fukuokatenjin/' }
    ],
    mapsQuery: 'HOKA Fukuoka Tenjin 福岡県福岡市中央区天神 2-8-49 HULIC SQUARE FUKUOKA TENJIN 1F'
  },
  {
    id: 'alpen-fukuoka-canal-city-hakata',
    name: 'Alpen FUKUOKA',
    listName: 'Alpen FUKUOKA（キャナルシティ博多）',
    type: '鞋店',
    brand: 'Alpen',
    category: 'shoe',
    area: 'hakata',
    address: '福岡県福岡市博多区住吉 1-2-74 キャナルシティ博多 サウスビル 1–3F',
    hours: '10:00–21:00',
    note: '多品牌運動用品店；不宣稱 On 或 HOKA 有指定鞋款、尺寸或即時庫存。',
    lat: 33.589085,
    lng: 130.410233,
    officialUrl: 'https://store.alpen-group.jp/Form/RealShop/ShopDetail.aspx?rsid=5400',
    officialSources: [
      { label: 'Alpen 官方門市頁', url: 'https://store.alpen-group.jp/Form/RealShop/ShopDetail.aspx?rsid=5400' },
      { label: 'Canal City 官方樓層頁', url: 'https://canalcity.co.jp/shopsearch/floor/103' }
    ],
    mapsQuery: 'Alpen FUKUOKA 福岡県福岡市博多区住吉 1-2-74'
  },
  {
    id: 'murasaki-sports-canal-city-hakata',
    name: 'ムラサキスポーツ キャナルシティ博多店（On 授權通路）',
    listName: 'ムラサキスポーツキャナルシティ博多店',
    type: '鞋店',
    brand: 'On',
    category: 'shoe',
    area: 'hakata',
    address: '福岡県福岡市博多区住吉 1-2-22 キャナルシティ博多 センターウォーク 3F',
    hours: '10:00–21:00',
    note: 'On 官方列為「取扱店」的合作零售通路，非 On 直營或專賣店；品項與庫存應以店內為準。',
    lat: 33.589966,
    lng: 130.411606,
    officialUrl: 'https://customer-service.on-running.com/ja-jp/dealers/017S09Nhs4QAC',
    officialSources: [
      { label: 'On 官方授權通路頁', url: 'https://customer-service.on-running.com/ja-jp/dealers/017S09Nhs4QAC' },
      { label: 'Canal City 官方店鋪頁', url: 'https://canalcity.co.jp/shop/detail/opa-0084?tenant_cd=opa-0084' }
    ],
    mapsQuery: 'ムラサキスポーツ キャナルシティ博多店 福岡県福岡市博多区住吉 1-2-22'
  },
  {
    id: 'don-quijote-nakasu',
    name: 'ドン・キホーテ中洲店',
    listName: '唐吉訶德中洲店',
    type: '藥妝',
    brand: '唐吉訶德',
    category: 'drug',
    area: 'hakata',
    address: '福岡県福岡市博多区中洲 3-7-24',
    hours: '24 小時營業',
    note: '中洲川端站 4 號出口直結；藥品販售時段須以藥師／登錄販售者在店時間為準。',
    lat: 33.593967,
    lng: 130.405731,
    officialUrl: 'https://www.donki.com/store/shop_detail.php?shop_id=278',
    officialSources: [
      { label: '唐吉訶德官方門市頁', url: 'https://www.donki.com/store/shop_detail.php?shop_id=278' }
    ],
    mapsQuery: 'ドン・キホーテ中洲店 福岡県福岡市博多区中洲 3-7-24'
  },
  {
    id: 'matsumoto-kiyoshi-hakata-station-underground',
    name: '薬 マツモトキヨシ 博多駅地下街店',
    listName: '松本清博多站地下街店',
    type: '藥妝',
    brand: '松本清',
    category: 'drug',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 地下 4',
    hours: '08:00–22:00',
    note: '博多口側地下 1 樓；營業時間依松本清官方門市頁。不保證指定藥品、品牌或免稅服務，出發前請再確認當日公告。',
    lat: 33.589783,
    lng: 130.420593,
    officialUrl: 'https://www.matsukiyococokara-online.com/map/?kid=20805173',
    officialSources: [
      { label: '松本清官方門市頁', url: 'https://www.matsukiyococokara-online.com/map/?kid=20805173' },
      { label: '博多站地下街官方店鋪頁', url: 'https://www.e-ekichika.com/shop/matsukiyo' }
    ],
    mapsQuery: '薬 マツモトキヨシ 博多駅地下街店 福岡県福岡市博多区博多駅中央街 地下 4'
  },
  {
    id: 'daikoku-drug-tenjin-building',
    name: 'ダイコクドラッグ天神ビル店',
    listName: '大國藥妝天神大樓店',
    type: '藥妝',
    brand: '大國藥妝',
    category: 'drug',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2-12-1 天神ビル B1F',
    hours: '平日 09:05–22:20；六日及假日 10:05–21:20',
    note: '天神地下街一帶順路店；一般連鎖門市，不宣稱指定商品庫存。',
    lat: 33.591782,
    lng: 130.398407,
    officialUrl: 'https://daikokudrug.com/store/81/',
    officialSources: [
      { label: '大國藥妝官方門市頁', url: 'https://daikokudrug.com/store/81/' }
    ],
    mapsQuery: 'ダイコクドラッグ天神ビル店 福岡県福岡市中央区天神 2-12-1 天神ビル B1F'
  },
  {
    id: 'welcia-one-fukuoka-tenjin',
    name: 'ウエルシア ワンビル福岡天神店',
    listName: 'Welcia One Building 福岡天神店',
    type: '藥妝',
    brand: 'Welcia',
    category: 'drug',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 1-11-1 ONE FUKUOKA BLDG. B2F',
    hours: '10:00–22:00（藥局服務另有時段）',
    note: '天神站旁 ONE FUKUOKA BLDG. B2F；官方頁列有免稅店服務。一般商品與指定藥品庫存請以店內為準。',
    lat: 33.590576,
    lng: 130.40036,
    officialUrl: 'https://store.welcia.co.jp/welcia/spot/detail?code=3796D',
    officialSources: [
      { label: 'Welcia 官方門市頁', url: 'https://store.welcia.co.jp/welcia/spot/detail?code=3796D' },
      { label: 'ONE FUKUOKA BLDG. 官方交通資訊', url: 'https://onefukuoka-building.jp/access' }
    ],
    mapsQuery: 'ウエルシア ワンビル福岡天神店 福岡県福岡市中央区天神 1-11-1 ONE FUKUOKA BLDG. B2F'
  },
  {
    id: '3coins-plus-mina-tenjin',
    name: '3COINS+plus ミーナ天神店',
    listName: '3COINS+plus ミーナ天神店',
    type: '生活雜貨（3COINS／DAISO）',
    brand: '3COINS',
    category: 'daily',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 4-3-8 ミーナ天神 B1F',
    hours: '10:00–21:00',
    note: '生活雜貨店；行李固定帶等特定品項請現場確認。',
    lat: 33.592609,
    lng: 130.398712,
    officialUrl: 'https://www.mina-tenjin.com/shop/detail.php?shopId=069',
    officialSources: [
      { label: 'ミーナ天神官方店鋪頁', url: 'https://www.mina-tenjin.com/shop/detail.php?shopId=069' }
    ],
    mapsQuery: '3COINS+plus ミーナ天神店 福岡県福岡市中央区天神 4-3-8 ミーナ天神 B1F'
  },
  {
    id: 'daiso-hakata-bus-terminal',
    name: 'DAISO 博多バスターミナル店',
    listName: 'DAISO 博多巴士總站店',
    type: '生活雜貨',
    brand: 'DAISO',
    category: 'daily',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 2-1 博多バスターミナル 5F',
    hours: '09:00–21:00',
    note: '同樓層另有 Standard Products／THREEPPY；本筆僅代表 DAISO，不保證防丟器等特定商品庫存。',
    lat: 33.59127,
    lng: 130.419083,
    officialUrl: 'https://www.daiso-sangyo.co.jp/shop/detail/001516',
    officialSources: [
      { label: 'DAISO 官方門市頁', url: 'https://www.daiso-sangyo.co.jp/shop/detail/001516' }
    ],
    mapsQuery: 'DAISO 博多バスターミナル店 福岡県福岡市博多区博多駅中央街 2-1 博多バスターミナル 5F'
  },
  {
    id: 'maxvalu-express-hakata-gion',
    name: 'マックスバリュエクスプレス博多祇園店',
    listName: 'MaxValu Express 博多祇園店',
    type: '超市／賣場',
    brand: 'MaxValu',
    category: 'supermarket',
    area: 'hakata',
    address: '福岡県福岡市博多区祇園町 7-20',
    hours: '24 小時營業',
    note: '博多站與中洲／運河城間的補給點；食品與特價品依當日店內為準。',
    lat: 33.592213,
    lng: 130.411224,
    officialUrl: 'https://tenpo.aeon-kyushu.info/maxvalu/detail/mvex-hakatagion/',
    officialSources: [
      { label: 'AEON 九州官方門市頁', url: 'https://tenpo.aeon-kyushu.info/maxvalu/detail/mvex-hakatagion/' }
    ],
    mapsQuery: 'マックスバリュエクスプレス博多祇園店 福岡県福岡市博多区祇園町 7-20'
  },
  {
    id: 'lopia-hakata-yodobashi',
    name: 'ロピア 博多ヨドバシ店',
    listName: 'ロピア 博多ヨドバシ店',
    type: '超市',
    brand: 'ロピア',
    category: 'supermarket',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 6-12 ヨドバシ博多 4F',
    hours: '10:00–21:00',
    note: '博多站 12 號出口徒步約 2 分鐘，就在 Yodobashi 相機館 4 樓；連鎖折扣超市，以生鮮肉品與進口食品聞名，適合順路補貨零食飲料與伴手禮。品項與營業時間請以店內公告為準。',
    lat: 33.588055,
    lng: 130.421546,
    officialUrl: 'https://lopia.jp/shops/hakatayodobashi',
    officialSources: [
      { label: 'ロピア官方店舗頁', url: 'https://lopia.jp/shops/hakatayodobashi' }
    ],
    mapsQuery: 'ロピア博多ヨドバシ店 福岡県福岡市博多区博多駅中央街 6-12 ヨドバシ博多'
  },
  {
    id: 'reganet-tenjin',
    name: 'レガネット天神',
    listName: 'レガネット天神（ソラリアステージ B1）',
    type: '超市',
    brand: 'にしてつストア',
    category: 'supermarket',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2-11-3 ソラリアステージ B1F',
    hours: '平日 08:00–23:00／週末例假日 08:00–22:00',
    note: '西鐵福岡（天神）站正上方 ソラリアステージ 地下一樓，出站幾乎不用走路；天神商圈買調味料與食品伴手禮最方便的超市。品項與庫存請以店內為準。',
    lat: 33.589977,
    lng: 130.398999,
    officialUrl: 'https://www.solariastage.com/shops/reganet/',
    officialSources: [
      { label: 'ソラリアステージ 官方店舖頁', url: 'https://www.solariastage.com/shops/reganet/' }
    ],
    mapsQuery: 'レガネット天神 福岡県福岡市中央区天神 2-11-3 ソラリアステージ'
  },
  {
    id: 'aeon-shoppers-fukuoka-tenjin',
    name: 'イオンショッパーズ福岡店',
    listName: 'イオンショッパーズ福岡店',
    type: '超市',
    brand: 'イオン',
    category: 'supermarket',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 4-4-11',
    hours: '09:00–22:00',
    note: '天神站徒步約 4 分鐘，AEON 集團大型店；地下一樓「天神フードスタイル」為食品賣場，零食飲料與伴手禮選擇多，是天神商圈離車站最近的超市之一。品項與營業時間請以店內公告為準。',
    lat: 33.593826,
    lng: 130.398338,
    officialUrl: 'https://tenpo.aeon-kyushu.info/aeon/detail/shoppers-fukuoka/',
    officialSources: [
      { label: 'AEON 九州官方門市頁', url: 'https://tenpo.aeon-kyushu.info/aeon/detail/shoppers-fukuoka/' }
    ],
    mapsQuery: 'イオンショッパーズ福岡店 福岡県福岡市中央区天神 4-4-11'
  },
  {
    id: 'matsumoto-kiyoshi-kokura-station-south',
    name: '松本清 小倉站南口店',
    listName: '松本清小倉站南口店',
    type: '藥妝',
    brand: '松本清',
    category: 'drug',
    area: 'kokura',
    address: '福岡縣北九州市小倉北區京町 2-4-27',
    hours: '07:00–24:00',
    note: '離小倉站南口很近，適合回飯店前補貨。',
    lat: 33.886395,
    lng: 130.881302,
    officialUrl: 'https://www.matsukiyococokara-online.com/map/?kid=20805475',
    officialSources: [
      { label: '松本清官方門市頁', url: 'https://www.matsukiyococokara-online.com/map/?kid=20805475' }
    ],
    mapsQuery: 'マツモトキヨシ 小倉駅南口店'
  },
  {
    id: 'cosmos-tenjin-daimaru-mae',
    name: 'ドラッグストアコスモス 天神大丸前店',
    listName: 'Cosmos 天神大丸前店',
    type: '藥妝',
    brand: 'Cosmos',
    category: 'drug',
    area: 'tenjin',
    address: '福岡県福岡市中央区渡辺通 5-24-30 東カン福岡第一ビル 103',
    hours: '10:00–23:00',
    note: '天神南附近的順路候選藥妝店；不宣稱指定品牌、規格或現貨。電話 092-791-9339。',
    referenceOnly: true,
    lat: 33.5882707,
    lng: 130.4023493,
    officialUrl: 'https://www.cosmospc.co.jp/shop/kyushu/fukuoka/fukuoka/chuou/',
    officialSources: [
      { label: 'Cosmos 官方中央區門市頁', url: 'https://www.cosmospc.co.jp/shop/kyushu/fukuoka/fukuoka/chuou/' },
      { label: 'MapFan 店鋪座標', url: 'https://mapfan.com/spots/SCWA3%2CFKF1%2C7R0' }
    ],
    mapsQuery: 'ドラッグストアコスモス 天神大丸前店 福岡県福岡市中央区渡辺通 5-24-30'
  },
  {
    id: 'cocokara-fine-kokura-station',
    name: 'Cocokara Fine 小倉站店',
    listName: 'Cocokara Fine 小倉站店',
    type: '藥妝',
    brand: 'Cocokara Fine',
    category: 'drug',
    area: 'kokura',
    address: '福岡縣北九州市小倉北區淺野 1-1-1',
    hours: '09:00–22:00',
    note: '位於小倉站商場地下樓層。',
    lat: 33.887192,
    lng: 130.881485,
    officialUrl: 'https://www.matsukiyococokara-online.com/map/?kid=20001291',
    officialSources: [
      { label: 'Cocokara Fine 官方門市頁', url: 'https://www.matsukiyococokara-online.com/map/?kid=20001291' }
    ],
    mapsQuery: 'ココカラファイン 小倉駅店'
  },
  {
    id: 'daiso-amu-plaza-kokura',
    name: 'DAISO AMU PLAZA 小倉店',
    listName: 'DAISO AMU PLAZA 小倉店',
    type: '生活雜貨',
    brand: 'DAISO',
    category: 'daily',
    area: 'kokura',
    address: '福岡縣北九州市小倉北區淺野 1-1-1',
    hours: '10:00–20:00',
    note: '可與 Cocokara Fine 同樓層安排。',
    lat: 33.887192,
    lng: 130.881485,
    officialUrl: 'https://www.daiso-sangyo.co.jp/shop/detail/005500',
    officialSources: [
      { label: 'DAISO 官方門市頁', url: 'https://www.daiso-sangyo.co.jp/shop/detail/005500' }
    ],
    mapsQuery: 'DAISO アミュプラザ小倉店'
  },
  {
    id: '3coins-plus-amu-plaza-kokura',
    name: '3COINS＋plus AMU PLAZA 小倉店',
    listName: '3COINS+plus AMU PLAZA 小倉店',
    type: '生活雜貨（3COINS／DAISO）',
    brand: '3COINS',
    category: 'daily',
    area: 'kokura',
    address: '福岡縣北九州市小倉北區淺野 1-1-1 AMU PLAZA 小倉 西館 5F',
    hours: '10:00–20:00',
    note: '中型店、提供免稅服務；位於西館 5F，與 B1F 的 DAISO／Cocokara Fine 不同樓層。',
    lat: 33.887192,
    lng: 130.881485,
    officialUrl: 'https://www.amuplaza.jp/floor/detail/?cd=000100',
    officialSources: [
      { label: 'AMU PLAZA 小倉官方樓層頁', url: 'https://www.amuplaza.jp/floor/detail/?cd=000100' },
      { label: '3COINS 官方店鋪頁', url: 'https://www.palcloset.jp/addons/pal/shoplist/detail/?b=3coins&brandshop_no=2234' }
    ],
    mapsQuery: '3COINS plus アミュプラザ小倉店'
  },
  {
    id: 'sundrug-uomachi-ginten-street',
    name: 'Sundrug 魚町銀天街店',
    listName: 'Sundrug 魚町銀天街店',
    type: '藥妝',
    brand: 'Sundrug',
    category: 'drug',
    area: 'kokura',
    address: '福岡県北九州市小倉北区魚町 2-1-7',
    hours: '09:30–21:15',
    note: '魚町商店街主要藥妝採買點；營業時間依 Sundrug 官方門市頁，出發前請再確認當日公告。',
    lat: 33.884033,
    lng: 130.879929,
    officialUrl: 'https://sundrug-online.com/blogs/search-store/2005',
    officialSources: [
      { label: 'Sundrug 官方門市頁', url: 'https://sundrug-online.com/blogs/search-store/2005' }
    ],
    mapsQuery: 'サンドラッグ 魚町銀天街店'
  },
  {
    id: 'don-quijote-kokura-uomachi',
    name: '唐吉訶德 小倉魚町店',
    listName: '唐吉訶德小倉魚町店',
    type: '藥妝',
    brand: '唐吉訶德',
    category: 'drug',
    area: 'kokura',
    address: '福岡縣北九州市小倉北區魚町 3-3-10',
    hours: '09:00–03:00',
    note: '官方頁列有醫藥品與免稅服務；指定商品仍需以門市庫存為準。',
    lat: 33.882725,
    lng: 130.880371,
    officialUrl: 'https://www.donki.com/store/shop_detail.php?shop_id=645',
    officialSources: [
      { label: '唐吉訶德官方門市頁', url: 'https://www.donki.com/store/shop_detail.php?shop_id=645' }
    ],
    mapsQuery: 'ドン・キホーテ 小倉魚町店'
  },
  {
    id: 'youme-mart-kokura',
    name: 'ゆめマート小倉',
    listName: 'ゆめマート小倉（魚町）',
    type: '超市',
    brand: 'ゆめマート',
    category: 'supermarket',
    area: 'kokura',
    address: '福岡県北九州市小倉北区魚町 4-1-1',
    hours: '09:00–22:00',
    note: '魚町銀天街尾端、旦過市場旁；前身為丸和，以自家明太子聞名，是小倉買在地調味料與食品的超市。營業時間請於現場或官方頁再確認（查證當日官方網站連線失敗，時間取自第三方通路頁）。',
    lat: 33.881801,
    lng: 130.879401,
    officialUrl: 'https://www.youme-kitakyushu.co.jp/store/451kokura.htm',
    officialSources: [
      { label: 'ゆめマート北九州 官方門市頁', url: 'https://www.youme-kitakyushu.co.jp/store/451kokura.htm' },
      { label: '旦過市場官方介紹頁（丸和沿革）', url: 'https://www.tangaichiba.jp/maruwa/' }
    ],
    mapsQuery: 'ゆめマート小倉 福岡県北九州市小倉北区魚町 4-1-1'
  },
  {
    id: 'lopia-kokura-riverwalk',
    name: 'ロピア 北九州リバーウォーク店',
    listName: 'ロピア 北九州リバーウォーク店',
    type: '超市',
    brand: 'ロピア',
    category: 'supermarket',
    area: 'kokura',
    address: '福岡県北九州市小倉北区室町 1-1-1 リバーウォーク北九州 B1F',
    hours: '10:00–20:00',
    note: '小倉城旁 リバーウォーク北九州 購物中心地下一樓，距西小倉站南口約 5 分鐘步行、距小倉站約 10 分鐘步行；北九州地區的連鎖折扣超市，生鮮肉品與零食飲料選擇多，逛完小倉城可順路補貨。品項與營業時間請以店內公告為準。',
    lat: 33.885813,
    lng: 130.875805,
    officialUrl: 'https://lopia.jp/shops/riverwalk',
    officialSources: [
      { label: 'ロピア官方店舗頁', url: 'https://lopia.jp/shops/riverwalk' },
      { label: 'リバーウォーク北九州 官方館內店舗頁', url: 'https://riverwalk.co.jp/shop/51264/' }
    ],
    mapsQuery: 'ロピア北九州リバーウォーク店 福岡県北九州市小倉北区室町 1-1-1 リバーウォーク北九州'
  },
  {
    id: 'matsumoto-kiyoshi-tenjin-underground',
    name: '松本清 天神地下街店',
    listName: '松本清天神地下街店',
    type: '藥妝',
    brand: '松本清',
    category: 'drug',
    area: 'tenjin',
    address: '福岡縣福岡市中央區天神 2-地下 1-025',
    hours: '09:00–22:30（元日休）',
    note: '天神地下街的藥妝店；官方頁列有醫藥品、日用品與免稅服務資訊。',
    lat: 33.58939,
    lng: 130.398041,
    officialUrl: 'https://www.matsukiyococokara-online.com/map/?kid=20805164',
    officialSources: [
      { label: '松本清官方門市頁', url: 'https://www.matsukiyococokara-online.com/map/?kid=20805164' }
    ],
    mapsQuery: 'マツモトキヨシ 天神地下街店'
  },
  {
    id: 'cocokara-fine-fukuoka-parco',
    name: 'Cocokara Fine 福岡 PARCO 店',
    listName: 'Cocokara Fine 福岡 PARCO 店',
    type: '藥妝',
    brand: 'Cocokara Fine',
    category: 'drug',
    area: 'tenjin',
    address: '福岡縣福岡市中央區天神 2-9-18',
    hours: '10:00–20:30',
    note: '福岡 PARCO 新館 B1F；官方頁列有醫藥品、日用品與免稅服務資訊。',
    lat: 33.591072,
    lng: 130.398087,
    officialUrl: 'https://www.matsukiyococokara-online.com/map?kid=20002399',
    officialSources: [
      { label: 'Cocokara Fine 官方門市頁', url: 'https://www.matsukiyococokara-online.com/map?kid=20002399' }
    ],
    mapsQuery: 'ココカラファイン 福岡パルコ店'
  },
  {
    id: 'loft-mina-tenjin',
    name: 'LOFT 天神店',
    listName: 'LOFT 天神店',
    type: '生活雜貨',
    brand: 'LOFT',
    category: 'daily',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 4-3-8 ミーナ天神 4F',
    hours: '10:00–20:00',
    note: '生活雜貨與晴雨傘賣場；PROTECT U、Wpc. 等品牌傘款依季節與門市調貨，顏色與庫存請現場確認。',
    lat: 33.592609,
    lng: 130.398712,
    officialUrl: 'https://www.loft.co.jp/shop_list/detail.php?shop_id=29',
    officialSources: [
      { label: 'LOFT 官方店鋪頁', url: 'https://www.loft.co.jp/shop_list/detail.php?shop_id=29' },
      { label: 'mina 天神官方店鋪頁', url: 'https://www.mina-tenjin.com/shop/detail.php?shopId=079' }
    ],
    mapsQuery: 'ロフト 天神店 福岡県福岡市中央区天神 4-3-8 ミーナ天神 4F'
  },
  {
    id: 'matsumoto-kiyoshi-mina-tenjin',
    name: '松本清 mina 天神店',
    listName: '松本清 mina 天神店',
    type: '藥妝',
    brand: '松本清',
    category: 'drug',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 4-3-8 ミーナ天神 B1F',
    hours: '08:00–22:00',
    note: '與 3COINS 同棟，集中採買效率最高。',
    lat: 33.592609,
    lng: 130.398712,
    officialUrl: 'https://www.mina-tenjin.com/shop/detail.php?shopId=070',
    officialSources: [
      { label: 'mina 天神官方店鋪頁', url: 'https://www.mina-tenjin.com/shop/detail.php?shopId=070' }
    ],
    mapsQuery: 'マツモトキヨシ ミーナ天神店'
  },
  {
    id: 'daiso-lachic-fukuoka-tenjin',
    name: 'DAISO LACHIC 福岡天神店',
    listName: 'DAISO LACHIC 福岡天神店',
    type: '生活雜貨',
    brand: 'DAISO',
    category: 'daily',
    area: 'tenjin',
    address: '福岡縣福岡市中央區天神 2-1-1 福岡三越 LACHIC 9F',
    hours: '10:00–20:00',
    note: '同區亦有 Standard Products、THREEPPY；年末年終另有調整。',
    lat: 33.587925,
    lng: 130.400894,
    officialUrl: 'https://www.daiso-sangyo.co.jp/shop/detail/001789',
    officialSources: [
      { label: 'DAISO 官方門市頁', url: 'https://www.daiso-sangyo.co.jp/shop/detail/001789' }
    ],
    mapsQuery: 'DAISO ラシック福岡天神店'
  },
  {
    id: 'daikoku-drug-tenjin-nishidori',
    name: '大國藥妝 天神西通店',
    listName: '大國藥妝 天神西通店',
    type: '藥妝',
    brand: '大國藥妝',
    category: 'drug',
    area: 'tenjin',
    address: '福岡県福岡市中央区今泉 1-19-19 アスティオン天神西',
    hours: '10:05–23:20',
    note: '可和天神西通逛街行程串聯。',
    lat: 33.586323,
    lng: 130.3974,
    officialUrl: 'https://daikokudrug.com/store/640/',
    officialSources: [
      { label: '大國藥妝官方門市頁', url: 'https://daikokudrug.com/store/640/' }
    ],
    mapsQuery: 'ダイコクドラッグ 天神西通り店'
  },
  {
    id: 'don-quijote-fukuoka-tenjin',
    name: '唐吉訶德 福岡天神本店',
    listName: '唐吉訶德福岡天神本店',
    type: '藥妝',
    brand: '唐吉訶德',
    category: 'drug',
    area: 'tenjin',
    address: '福岡県福岡市中央区今泉 1-20-17',
    hours: '24 小時營業',
    note: '適合最後統一補貨。',
    lat: 33.586506,
    lng: 130.39801,
    officialUrl: 'https://www.donki.com/store/shop_detail.php?shop_id=461',
    officialSources: [
      { label: '唐吉訶德官方門市頁', url: 'https://www.donki.com/store/shop_detail.php?shop_id=461' }
    ],
    mapsQuery: 'ドン・キホーテ 福岡天神本店'
  },
  {
    id: 'lawson-hakata',
    name: 'LAWSON 博多店',
    listName: 'LAWSON 博多店',
    type: '便利商店',
    brand: 'LAWSON',
    category: 'convenience',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅前 2-6-12',
    hours: '24 小時營業',
    note: 'LAWSON 商品的博多補貨點；冷藏、冷凍與限定商品庫存請以店內為準。',
    lat: 33.589935,
    lng: 130.414841,
    officialUrl: 'https://www.lawson.co.jp/service/others/in/',
    officialSources: [
      { label: 'LAWSON 官方門市資訊', url: 'https://www.lawson.co.jp/service/others/in/' }
    ],
    mapsQuery: 'ローソン 博多店 福岡県福岡市博多区博多駅前 2-6-12'
  },
  {
    id: 'lawson-nishitetsu-fukuoka-tenjin-south',
    name: 'LAWSON 西鐵福岡天神站南口店',
    listName: 'LAWSON 西鐵福岡天神站南口店',
    type: '便利商店',
    brand: 'LAWSON',
    category: 'convenience',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2-2-67',
    hours: '24 小時營業',
    note: '天神購物動線上的 LAWSON；冷藏、冷凍與限定商品庫存請以店內為準。',
    lat: 33.587902,
    lng: 130.400375,
    officialUrl: 'https://www.lawson.co.jp/service/others/in/',
    officialSources: [
      { label: 'LAWSON 官方門市資訊', url: 'https://www.lawson.co.jp/service/others/in/' }
    ],
    mapsQuery: 'ローソン 西鉄福岡天神駅南口店 福岡県福岡市中央区天神 2-2-67'
  },
  {
    id: 'lawson-kokura-uomachi-2chome',
    name: 'LAWSON 小倉魚町二丁目店',
    listName: 'LAWSON 小倉魚町二丁目店',
    type: '便利商店',
    brand: 'LAWSON',
    category: 'convenience',
    area: 'kokura',
    address: '福岡県北九州市小倉北区魚町 2-4-18',
    hours: '24 小時營業',
    note: '魚町銀天街旁的 LAWSON；冷藏、冷凍與限定商品庫存請以店內為準。',
    lat: 33.883812,
    lng: 130.879944,
    officialUrl: 'https://www.lawson.co.jp/service/others/in/',
    officialSources: [
      { label: 'LAWSON 官方門市資訊', url: 'https://www.lawson.co.jp/service/others/in/' }
    ],
    mapsQuery: 'ローソン 小倉魚町二丁目店 福岡県北九州市小倉北区魚町 2-4-18'
  },
  {
    id: 'biccamera-tenjin-1',
    name: 'BicCamera 天神 1 號館',
    listName: 'BicCamera 天神 1 號館',
    type: '家電',
    brand: 'BicCamera',
    category: 'electronics',
    area: 'tenjin',
    address: '福岡県福岡市中央区今泉 1-25-1',
    hours: '10:00–21:00',
    note: 'Panasonic 吹風機的主要採買點；型號、電壓規格、庫存與免稅資格請結帳前確認。',
    lat: 33.586903,
    lng: 130.401108,
    officialUrl: 'https://www.biccamera.com/bc/i/shop/shoplist/shop026.jsp',
    officialSources: [
      { label: 'BicCamera 天神 1 號館官方店鋪頁', url: 'https://www.biccamera.com/bc/i/shop/shoplist/shop026.jsp' }
    ],
    mapsQuery: 'ビックカメラ 天神1号館 福岡県福岡市中央区今泉 1-25-1'
  },
  {
    id: 'biccamera-tenjin-2',
    name: 'BicCamera 天神 2 號館',
    listName: 'BicCamera 天神 2 號館',
    type: '家電',
    brand: 'BicCamera',
    category: 'electronics',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2-4-5',
    hours: '10:00–21:00',
    note: '與天神 1 號館分館別販售商品不同，Panasonic 吹風機到店前建議先致電確認庫存；型號、電壓規格與免稅資格請結帳前確認。',
    lat: 33.587361,
    lng: 130.398375,
    officialUrl: 'https://www.biccamera.com/bc/i/shop/shoplist/shop018.jsp',
    officialSources: [
      { label: 'BicCamera 官方門市頁', url: 'https://www.biccamera.com/bc/i/shop/shoplist/shop018.jsp' }
    ],
    mapsQuery: 'ビックカメラ 天神2号館 福岡県福岡市中央区天神 2-4-5'
  },
  {
    id: 'yodobashi-camera-hakata',
    name: 'ヨドバシカメラ マルチメディア博多',
    listName: 'ヨドバシカメラ マルチメディア博多',
    type: '家電',
    brand: 'Yodobashi Camera',
    category: 'electronics',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 6-12',
    hours: '09:30–22:00，全年無休',
    note: '博多駅筑紫口徒步約 1 分；Panasonic 吹風機到店前建議先致電確認庫存，型號、電壓規格與免稅資格請結帳前確認。',
    lat: 33.588174,
    lng: 130.421743,
    officialUrl: 'https://www.yodobashi.com/ec/store/0088/',
    officialSources: [
      { label: 'ヨドバシ官方門市頁', url: 'https://www.yodobashi.com/ec/store/0088/' }
    ],
    mapsQuery: 'ヨドバシカメラ マルチメディア博多 福岡県福岡市博多区博多駅中央街 6-12'
  },
  {
    id: 'bestdenki-kokura-ekimae',
    name: 'ベスト電器 小倉駅前店',
    listName: 'ベスト電器 小倉駅前店',
    type: '家電',
    brand: 'ベスト電器',
    category: 'electronics',
    area: 'kokura',
    address: '福岡県北九州市小倉北区京町 3-1-1 セントシティ 6F',
    hours: '10:00–20:00',
    note: '小倉駅小倉城口（南口）徒步約 2 分；Panasonic 吹風機到店前建議先致電確認庫存，型號、電壓規格與免稅資格請結帳前確認。',
    lat: 33.884969,
    lng: 130.882494,
    officialUrl: 'https://www.bestdenki.ne.jp/store/%E5%B0%8F%E5%80%89%E9%A7%85%E5%89%8D%E5%BA%97/',
    officialSources: [
      { label: 'ベスト電器官方門市頁', url: 'https://www.bestdenki.ne.jp/store/%E5%B0%8F%E5%80%89%E9%A7%85%E5%89%8D%E5%BA%97/' }
    ],
    mapsQuery: 'ベスト電器 小倉駅前店 福岡県北九州市小倉北区京町 3-1-1 セントシティ'
  },
  {
    id: 'seven-eleven-tenjin-underground',
    name: 'セブン-イレブン 天神地下街店',
    listName: '7-ELEVEN 天神地下街店',
    type: '便利商店',
    brand: 'セブン-イレブン',
    category: 'convenience',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2 天神地下街',
    hours: '07:00–23:00',
    note: '天神地下街內；冷藏、冷凍與限定商品庫存請以店內為準。',
    lat: 33.58939,
    lng: 130.398041,
    officialUrl: 'https://www.tenchika.com/shop/seven-eleven/',
    officialSources: [
      { label: '天神地下街官方店鋪頁', url: 'https://www.tenchika.com/shop/seven-eleven/' }
    ],
    mapsQuery: 'セブン-イレブン 天神地下街店 福岡県福岡市中央区天神 2 天神地下街'
  },
  {
    id: 'familymart-hakata-station',
    name: 'ファミリーマート JR博多駅店',
    listName: 'FamilyMart JR 博多站店',
    type: '便利商店',
    brand: 'ファミリーマート',
    category: 'convenience',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 1-1',
    hours: '05:00–24:30',
    note: '博多駅構內；冷藏、冷凍與限定商品庫存請以店內為準。',
    lat: 33.589912,
    lng: 130.420395,
    officialUrl: 'https://store.family.co.jp/points/78358',
    officialSources: [
      { label: 'FamilyMart 官方店舗頁', url: 'https://store.family.co.jp/points/78358' }
    ],
    mapsQuery: 'ファミリーマート JR博多駅店 福岡県福岡市博多区博多駅中央街 1-1'
  },
  {
    id: 'familymart-kokura-station',
    name: 'ファミリーマート JR小倉駅改札口店',
    listName: 'FamilyMart JR 小倉站改札口店',
    type: '便利商店',
    brand: 'ファミリーマート',
    category: 'convenience',
    area: 'kokura',
    address: '福岡県北九州市小倉北区浅野 1-1-1',
    hours: '05:30–23:30',
    note: '小倉駅改札口出站即達；冷藏、冷凍與限定商品庫存請以店內為準。',
    lat: 33.887192,
    lng: 130.881485,
    officialUrl: 'https://store.family.co.jp/points/78237',
    officialSources: [
      { label: 'FamilyMart 官方店舗頁', url: 'https://store.family.co.jp/points/78237' }
    ],
    mapsQuery: 'ファミリーマート JR小倉駅改札口店 福岡県北九州市小倉北区浅野 1-1-1'
  },
  {
    id: 'kayanoya-hakata-station-daitos',
    name: '茅乃舍 博多站 DEITOS 店',
    listName: '茅乃舍 博多站 DEITOS 店',
    type: '食品／伴手禮',
    brand: '茅乃舍',
    category: 'gift-food',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 1-1 博多デイトス 1F みやげもん市場',
    hours: '08:00–21:00',
    note: '茅乃舍高湯包與茶碗蒸し的素的博多採買點；營業日隨博多站設施公告調整，季節商品與禮盒請以店內為準。',
    lat: 33.589912,
    lng: 130.420395,
    officialUrl: 'https://www.kayanoya.com/shop/hakata-deitos/',
    officialSources: [
      { label: '茅乃舍 博多站 DEITOS 店官方頁', url: 'https://www.kayanoya.com/shop/hakata-deitos/' },
      { label: '茅乃舍官方店鋪列表', url: 'https://www.kubara.jp/shoplist/kayanoya/?wh=pc_menu' }
    ],
    mapsQuery: '茅乃舎 博多駅デイトス店 福岡県福岡市博多区博多駅中央街 1-1'
  },
  {
    id: 'kayanoya-kokura-izutsuya',
    name: '茅乃舍 小倉井筒屋店',
    listName: '茅乃舍 小倉井筒屋店',
    type: '食品／伴手禮',
    brand: '茅乃舍',
    category: 'gift-food',
    area: 'kokura',
    address: '福岡県北九州市小倉北区船場町 1-1 小倉井筒屋 本館 B1F',
    hours: '10:00–19:00',
    note: '小倉逛街動線上的茅乃舍據點；營業日隨井筒屋公告調整，季節商品與禮盒請以店內為準。',
    lat: 33.885441,
    lng: 130.877686,
    officialUrl: 'https://www.kayanoya.com/shop/kokura-izutsuya/',
    officialSources: [
      { label: '茅乃舍 小倉井筒屋店官方頁', url: 'https://www.kayanoya.com/shop/kokura-izutsuya/' },
      { label: '茅乃舍官方店鋪列表', url: 'https://www.kubara.jp/shoplist/kayanoya/?wh=pc_menu' }
    ],
    mapsQuery: '茅乃舎 小倉井筒屋店 福岡県北九州市小倉北区船場町 1-1'
  },
  {
    id: 'hands-hakata',
    name: 'HANDS 博多店',
    listName: 'HANDS 博多店',
    type: '生活雜貨',
    brand: 'HANDS',
    category: 'daily',
    area: 'hakata',
    address: '福岡県福岡市博多区博多駅中央街 1-1 アミュプラザ博多 1–5F',
    hours: '10:00–20:00',
    note: '晴雨傘與日用品的到店確認點；品項、顏色與庫存不保證，請以店內查詢為準。',
    lat: 33.589912,
    lng: 130.420395,
    officialUrl: 'https://store.hands.net/hakata/',
    officialSources: [
      { label: 'HANDS 博多店官方資訊', url: 'https://store.hands.net/hakata/' }
    ],
    mapsQuery: 'ハンズ博多店 福岡県福岡市博多区博多駅中央街 1-1'
  },
  {
    id: 'muji-tenjin-shoppers-fukuoka',
    name: '無印良品 天神ショッパーズ福岡',
    listName: '無印良品 天神ショッパーズ福岡',
    type: '生活雜貨',
    brand: '無印良品',
    category: 'daily',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 4-4-11 天神ショッパーズ福岡 2F',
    hours: '09:00–21:00',
    note: '無印三層海綿等生活用品的天神採買點；地下鐵天神站中央口徒步約 4 分。品項與庫存請以店內為準。',
    lat: 33.593929,
    lng: 130.398393,
    officialUrl: 'https://www.muji.com/jp/ja/shop/detail/046700',
    officialSources: [
      { label: '無印良品官方門市頁', url: 'https://www.muji.com/jp/ja/shop/detail/046700' }
    ],
    mapsQuery: '無印良品 天神ショッパーズ福岡 福岡県福岡市中央区天神 4-4-11'
  },
  {
    id: 'muji-sent-city-kitakyushu',
    name: '無印良品 セントシティ北九州',
    listName: '無印良品 セントシティ北九州',
    type: '生活雜貨',
    brand: '無印良品',
    category: 'daily',
    area: 'kokura',
    address: '福岡県北九州市小倉北区京町 3-1-1 セントシティ北九州 1F',
    hours: '10:00–20:00',
    note: '無印三層海綿等生活用品的小倉採買點；2025 年 7 月整修重新開幕，與 6F ベスト電器同棟。品項與庫存請以店內為準。',
    lat: 33.885056,
    lng: 130.88257,
    officialUrl: 'https://www.muji.com/jp/shop/045633',
    officialSources: [
      { label: '無印良品官方門市頁', url: 'https://www.muji.com/jp/shop/045633' }
    ],
    mapsQuery: '無印良品 セントシティ北九州 福岡県北九州市小倉北区京町 3-1-1'
  },
  {
    id: 'uniqlo-fukuoka-tenjin',
    name: 'UNIQLO 天神店',
    listName: 'UNIQLO 天神店',
    type: '服飾用品',
    brand: 'UNIQLO',
    category: 'clothing',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 4-3-8 ミーナ天神 1F・2F',
    hours: '10:00–20:00',
    note: '九州最大賣場面積的 UNIQLO 旗艦店，男女童裝與嬰兒用品齊全；與 3COINS+plus ミーナ天神店同棟。此店未連結任何清單商品，品項與庫存請以店內為準。',
    lat: 33.592609,
    lng: 130.398712,
    referenceOnly: true,
    officialUrl: 'https://map.uniqlo.com/jp/ja/detail/10101803',
    officialSources: [
      { label: 'UNIQLO 官方店舗檢索頁', url: 'https://map.uniqlo.com/jp/ja/detail/10101803' },
      { label: 'ミーナ天神官方店舗頁', url: 'https://www.mina-tenjin.com/shop/detail.php?shopId=074' }
    ],
    mapsQuery: 'UNIQLO 天神店 福岡県福岡市中央区天神 4-3-8 ミーナ天神 1F・2F'
  },
  {
    id: 'montbell-fukuoka-tenjin',
    name: 'mont-bell 福岡天神店',
    listName: 'mont-bell 福岡天神店',
    type: '服飾用品',
    brand: 'mont-bell',
    category: 'clothing',
    area: 'tenjin',
    address: '福岡県福岡市中央区天神 2-4-38 NTT-KFビル 1F',
    hours: '10:30–21:00',
    note: '警固公園旁路面店，登山、露營與機能服飾裝備齊全。此店未連結任何清單商品，品項與庫存請以店內為準。',
    lat: 33.587797,
    lng: 130.398413,
    referenceOnly: true,
    officialUrl: 'https://store.montbell.jp/search/shopinfo/?shop_no=618936',
    officialSources: [
      { label: 'mont-bell 官方店舗檢索頁', url: 'https://store.montbell.jp/search/shopinfo/?shop_no=618936' }
    ],
    mapsQuery: 'mont-bell 福岡天神店 福岡県福岡市中央区天神 2-4-38 NTT-KFビル 1F'
  }
];

/* 清單頁只需要「分類＋顯示名稱」，由 STORES 推導，不另外維護副本。 */
export const STORE_SUMMARIES = Object.fromEntries(
  STORES.map((store) => [store.id, { type: store.type, name: store.listName }])
);
