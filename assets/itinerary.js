/* 固定購物行程的唯一執行期來源。
 * 店名、營業時間、座標與商品名稱一律以 storeId／productIds 連回共用資料。 */

export const ITINERARY_DAYS = [
  { date: '2026-09-03', weekday: '四', title: '天神主攻', summary: '中午先買輕小物，寄放後傍晚再買電器、鞋與食品。', segmentIds: ['2026-09-03-tenjin-am', '2026-09-03-tenjin-pm'] },
  { date: '2026-09-04', weekday: '五', title: '博多補齊', summary: '上午完成博多站與運河城採買，下午銜接ゆめタウン博多及前往小倉。', segmentIds: ['2026-09-04-hakata'] },
  { date: '2026-09-05', weekday: '六', title: '沿途隨手逛', summary: '唐戶市場、門司港與皿倉山為主，不排固定購物站。', segmentIds: [] },
  { date: '2026-09-06', weekday: '日', title: '小倉彈性採買', summary: '小倉市區散步時順路逛藥妝，17:00 左右收尾準備返程。', segmentIds: ['2026-09-06-kokura'] },
];

export const ITINERARY_SEGMENTS = [
  {
    id: '2026-09-03-tenjin-am', date: '2026-09-03', area: 'tenjin', startTime: '12:00', endTime: '14:15',
    title: '輕小物｜ミーナ天神為主',
    note: '上午戰利品在下午休息時放回天神南附近飯店，晚上盡量空手重新出發。',
    anchor: { storeId: 'lawson-nishitetsu-fukuoka-tenjin-south', label: '西鐵福岡（天神）站 南口' },
    stops: [
      { storeId: 'uniqlo-fukuoka-tenjin', arrivalTime: '12:15', durationMinutes: 40, optional: false, productIds: [], note: '逛店、選衣。' },
      { storeId: 'loft-mina-tenjin', arrivalTime: '12:55', durationMinutes: 25, optional: false, productIds: ['protect-u-folding-umbrella', 'wpc-iza-cool-compact'], note: '與 UNIQLO 同棟，直接上樓。' },
      { storeId: '3coins-plus-mina-tenjin', arrivalTime: '13:20', durationMinutes: 30, optional: false, productIds: ['3coins-luggage-band', '3coins-defrosting-plate', '3coins-folding-camp-chair', 'seasoning-container-pair', 'belt-fan'], note: '同棟 B1F，一次處理生活小物。' },
      { storeId: 'muji-tenjin-shoppers-fukuoka', arrivalTime: '13:50', durationMinutes: 25, optional: false, productIds: ['muji-3layer-sponge-grey'], note: '買完回飯店或置物櫃寄放。' },
    ],
  },
  {
    id: '2026-09-03-tenjin-pm', date: '2026-09-03', area: 'tenjin', startTime: '17:00', endTime: '20:50',
    title: '電器、鞋與食品｜回天神南收尾',
    note: '先處理較早打烊的 DAISO 與 HOKA，再北上買超市商品，最後往天神南附近飯店方向收尾。',
    anchor: { storeId: 'lawson-nishitetsu-fukuoka-tenjin-south', label: '西鐵福岡（天神）站 南口' },
    stops: [
      {
        storeId: 'biccamera-tenjin-1', arrivalTime: '17:00', durationMinutes: 60, optional: false,
        productIds: ['elecom-ex-g', 'elecom-ex-g-pro', 'logicool-ergo-m575-sp', 'logicool-mx-ergo-s', 'logicool-mx-anywhere-3s', 'logicool-pebble-mouse-2-m350s', 'buffalo-bsmbw318bk', 'cio-smartcoby-pro-slim-ss-10k', 'cio-smartcoby-slimii-wireless-2-2-pro-ss10k', 'cio-smartcoby-slimii-wireless-2-2-8k-special-edition', 'cio-smartcoby-pro-slim-cable', 'cio-smartcoby-pro-cable-c', 'ne7n', 'ne5n'],
        note: '確認型號、電壓、保固及免稅結帳時間。',
      },
      { storeId: 'daiso-lachic-fukuoka-tenjin', arrivalTime: '18:00', durationMinutes: 30, optional: false, productIds: ['findmy', 'hasameru-sponge', 'daiso-toy-story-pendulum-clock', 'daiso-basin-cleaner-cloth'], note: '防丟器相容性與現貨以店內為準。' },
      { storeId: 'hoka-fukuoka-tenjin', arrivalTime: '18:35', durationMinutes: 55, optional: false, productIds: ['clifton11', 'bondi9', 'skyflow', 'transport2', 'gaviota5'], note: '建議 19:40 前完成選購，尺碼與顏色以現場為準。' },
      { storeId: 'aeon-shoppers-fukuoka-tenjin', arrivalTime: '19:30', durationMinutes: 25, optional: false, productIds: ['jurokucha-630ml', 'gogo-no-kocha-ice-milk-tea', 'calbee-satsumaimo-chips'], note: '飲料有重量，只買預計攜回飯店的數量。' },
      { storeId: 'reganet-tenjin', arrivalTime: '20:00', durationMinutes: 30, optional: false, productIds: ['kombu', 'hanamidori-kiwami-spice', 'jojoen-salad-sauce', 'fundokin-ao-yuzu-kosho', 'higashimaru-oyster-dashi-shoyu', 'horinishi-new-lemon'], note: '最重的食品放在最後買，再往天神南方向回飯店。' },
      { storeId: 'cosmos-tenjin-daimaru-mae', arrivalTime: '20:30', durationMinutes: 20, optional: true, productIds: [], note: '有時間、體力且仍在營業才順路進店，不必特地趕。' },
    ],
  },
  {
    id: '2026-09-04-hakata', date: '2026-09-04', area: 'hakata', startTime: '10:00', endTime: '13:30',
    title: '博多站與運河城補齊',
    note: '13:30 後銜接ゆめタウン博多，傍晚回天神領行李並前往小倉。',
    anchor: { storeId: 'familymart-hakata-station', label: 'JR 博多站' },
    stops: [
      { storeId: 'kayanoya-hakata-station-daitos', arrivalTime: '10:00', durationMinutes: 30, optional: false, productIds: ['kayanoya-dashi', 'chawanmushi-no-moto'], note: '先處理博多站內商品。' },
      { storeId: 'hands-hakata', arrivalTime: '10:30', durationMinutes: 30, optional: true, productIds: ['sanwa-400-ma092', 'sanwa-ma-ergw19', 'sanwa-trackball-400-mawbttb190'], note: '只有 BicCamera 未選到合適滑鼠才加入。' },
      { storeId: 'murasaki-sports-canal-city-hakata', arrivalTime: '11:30', durationMinutes: 60, optional: false, productIds: ['cloudtilt', 'cloudsurfermax', 'cloudsurfer2', 'cloud6', 'cloudrunner3'], note: '型號、顏色與尺碼以現場庫存為準。' },
      { storeId: 'alpen-fukuoka-canal-city-hakata', arrivalTime: '12:35', durationMinutes: 40, optional: false, productIds: ['golden-seasoning', 'cloudsurfermax'], note: '買白松露鹽，也可再確認 Cloudsurfer Max。' },
    ],
  },
  {
    id: '2026-09-06-kokura', date: '2026-09-06', area: 'kokura', startTime: '12:30', endTime: '17:00',
    title: '小倉市區順路逛藥妝',
    note: '不綁定單一門市；17:00 左右收尾，18:40 前回飯店領行李。',
    anchor: { storeId: 'familymart-kokura-station', label: 'JR 小倉站' },
    stops: [
      {
        storeId: 'matsumoto-kiyoshi-kokura-station-south', arrivalTime: '12:30', durationMinutes: 30, optional: true,
        productIds: ['jinmart', 'roihi', 'nature', 'anelon', 'pabron-ace-pro-x-36', 'lulu-attack-ex-24', 'taisho-kampo-stomach-48', 'ohta-isan-s-50', 'hareno-toothbrush', 'toothbrush-p61', 'salonpas-ae-240', 'passtime-lx-premium-21', 'kobayashi-harenurse-spray', 'kobayashi-harenurse-18', 'lion-stain-rescue', 'kobayashi-zukkinon-ointment', 'cp-lip-lip-essence', 'kinui-calm-7-soothing-serum'],
        note: '只是順路候選；沿途任何仍在營業的藥妝店都可以逛。',
      },
    ],
  },
];

export const ITINERARY_SEGMENTS_BY_ID = new Map(ITINERARY_SEGMENTS.map((segment) => [segment.id, segment]));
