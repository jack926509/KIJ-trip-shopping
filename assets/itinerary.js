/* 固定購物行程的唯一執行期來源。
 * 店名、營業時間、座標與商品名稱一律以 storeId／productIds 連回共用資料。
 *
 * 排入原則（2026-09-01 使用者最新決定）：
 * 只排「特定店家才買得到」的品項——鞋店、家電量販、茅乃舍、超市的指定調味料等。
 * 9/3 下午只買輕便品，晚上依關門時間排 HOKA → BicCamera → 晚餐 → 24 小時 MaxValu。
 * 藥妝不綁品項或單一門市：9/5、9/6 的固定段只放彈性進店的代表站，
 * 實際要看尚未購買的商品仍使用 route-planner 的 remainingGroups。 */

export const ITINERARY_DAYS = [
  { date: '2026-09-03', weekday: '四', title: '天神主攻', summary: '約 14:00 先買輕便品，寄放後先試 HOKA、再買電器，晚餐後到 24 小時超市。', segmentIds: ['2026-09-03-tenjin-am', '2026-09-03-tenjin-pm'] },
  { date: '2026-09-04', weekday: '五', title: '博多鞋類與限定品', summary: '上午先在運河城試 On 與逛 Alpen，再到博多站買茅乃舍與必要備案。', segmentIds: ['2026-09-04-hakata'] },
  { date: '2026-09-05', weekday: '六', title: '小倉藥妝第一輪', summary: '唐戶、門司港與皿倉山為主；回小倉後若體力與時間允許，先完成一輪藥妝。', segmentIds: ['2026-09-05-kokura-pm'] },
  { date: '2026-09-06', weekday: '日', title: '小倉藥妝補漏', summary: '小倉市區散步時只補尚未買到的藥妝，16:30 收尾準備晚餐與返程。', segmentIds: ['2026-09-06-kokura'] },
];

export const ITINERARY_SEGMENTS = [
  {
    id: '2026-09-03-tenjin-am', date: '2026-09-03', area: 'tenjin', startTime: '14:00', endTime: '16:15',
    title: '輕小物｜ミーナ天神為主',
    note: '太宰府回程後約 14:00 再開始；只買輕便品，約 16:15 回天神南附近飯店放下戰利品。',
    anchor: { storeId: 'lawson-nishitetsu-fukuoka-tenjin-south', label: '西鐵福岡（天神）站 南口' },
    stops: [
      { storeId: 'uniqlo-fukuoka-tenjin', arrivalTime: '14:00', durationMinutes: 35, optional: false, productIds: [], note: '逛店、選衣；太宰府回程延誤時可先略過。' },
      { storeId: 'loft-mina-tenjin', arrivalTime: '14:35', durationMinutes: 25, optional: false, productIds: ['protect-u-folding-umbrella', 'wpc-iza-cool-compact'], note: '與 UNIQLO 同棟，優先找旅途中就能使用的晴雨傘。' },
      { storeId: '3coins-plus-mina-tenjin', arrivalTime: '15:00', durationMinutes: 30, optional: false, productIds: ['3coins-luggage-band', 'belt-fan'], note: '只買固定綁帶與腰間風扇等輕便品；解凍盤、折疊椅與調味盒留給即時補買路線。' },
      { storeId: 'muji-tenjin-shoppers-fukuoka', arrivalTime: '15:35', durationMinutes: 25, optional: true, productIds: ['muji-3layer-sponge-grey'], note: '時間與體力允許才進店；16:15 左右開始返回飯店。' },
    ],
  },
  {
    id: '2026-09-03-tenjin-pm', date: '2026-09-03', area: 'tenjin', startTime: '17:00', endTime: '22:45',
    title: 'HOKA、電器與 24 小時超市',
    note: '依關門時間排 HOKA → BicCamera；約 20:00 在中洲吃晚餐，餐後再到 24 小時 MaxValu 一次處理一般超市商品。',
    mapTitle: '天神 → 博多祇園・3 個購物站',
    mapNote: '地圖只標 HOKA、BicCamera 與 MaxValu 3 個購物站；約 20:00 的中洲晚餐依實際訂位地點移動。',
    anchor: { storeId: 'lawson-nishitetsu-fukuoka-tenjin-south', label: '西鐵福岡（天神）站 南口' },
    stops: [
      {
        storeId: 'hoka-fukuoka-tenjin', arrivalTime: '17:00', durationMinutes: 60, optional: false,
        productIds: ['clifton11', 'bondi9', 'skyflow', 'transport2', 'gaviota5', 'mach-remastered'],
        note: '店家 20:00 關門，晚間必須先買；建議預先選 2–3 款試穿，尺碼與顏色以現場為準。',
      },
      {
        storeId: 'biccamera-tenjin-1', arrivalTime: '18:10', durationMinutes: 85, optional: false,
        productIds: ['elecom-ex-g', 'elecom-ex-g-pro', 'logicool-ergo-m575-sp', 'logicool-mx-ergo-s', 'logicool-mx-anywhere-3s', 'logicool-pebble-mouse-2-m350s', 'buffalo-bsmbw318bk', 'cio-smartcoby-pro-slim-ss-10k', 'cio-smartcoby-slimii-wireless-2-2-pro-ss10k', 'cio-smartcoby-slimii-wireless-2-2-8k-special-edition', 'cio-smartcoby-pro-slim-cable', 'cio-smartcoby-pro-cable-c', 'ne7n', 'ne5n'],
        note: '一號館先處理行動電源、滑鼠與吹風機；確認型號、AC 100V、保固及免稅結帳時間。',
      },
      {
        storeId: 'maxvalu-express-hakata-gion', arrivalTime: '21:45', durationMinutes: 60, optional: false,
        productIds: ['kombu', 'hanamidori-kiwami-spice', 'jojoen-salad-sauce', 'fundokin-ao-yuzu-kosho', 'higashimaru-oyster-dashi-shoyu', 'horinishi-new-lemon', 'jurokucha-630ml', 'calbee-satsumaimo-chips'],
        note: '約 20:00 在中洲吃完晚餐後再前往。所有一般超市品一次找齊；減鹽鹽昆布已有暫停販售記錄，沒看到就略過，不跨店追貨。專門店與 LAWSON／7-ELEVEN 限定品不列入。',
      },
    ],
  },
  {
    id: '2026-09-04-hakata', date: '2026-09-04', area: 'hakata', startTime: '10:00', endTime: '13:30',
    title: 'On、Alpen 與博多限定品',
    note: '一般超市品已在 9/3 晚上買完；先到運河城試 On、逛 Alpen，再回博多站買茅乃舍，13:30 後保留彈性並準備前往小倉。',
    anchor: { storeId: 'familymart-hakata-station', label: 'JR 博多站' },
    stops: [
      { storeId: 'murasaki-sports-canal-city-hakata', arrivalTime: '10:00', durationMinutes: 75, optional: false, productIds: ['cloudtilt', 'cloudsurfermax', 'cloudsurfer2', 'cloud6', 'cloudrunner3'], note: '開店先試 On；建議預先選 2–3 款，型號、顏色與尺碼均以現場庫存為準。' },
      { storeId: 'alpen-fukuoka-canal-city-hakata', arrivalTime: '11:20', durationMinutes: 40, optional: false, productIds: ['golden-seasoning', 'cloudsurfermax'], note: '買白松露鹽，也可再確認 Cloudsurfer Max；這是專門店商品，不列入 9/3 的一般超市採買。' },
      { storeId: 'kayanoya-hakata-station-daitos', arrivalTime: '12:20', durationMinutes: 30, optional: false, productIds: ['kayanoya-dashi', 'chawanmushi-no-moto'], note: '回博多站後處理茅乃舍限定品，不列入 9/3 的一般超市採買。' },
      /* 400-MA092 不列在這裡：它的商品資料註明是 Sanwa Direct 網路限定（WEB 限定），
         天神、博多實體門市不鋪貨，寫進來只會讓人在 HANDS 白找一輪。 */
      { storeId: 'hands-hakata', arrivalTime: '12:50', durationMinutes: 30, optional: true, productIds: ['sanwa-ma-ergw19', 'sanwa-trackball-400-mawbttb190'], note: '只有 BicCamera 未選到合適滑鼠才加入；400-MA092 是網路限定，門市買不到。' },
    ],
  },
  {
    id: '2026-09-05-kokura-pm', date: '2026-09-05', area: 'kokura', startTime: '21:00', endTime: '22:00',
    title: '回小倉後｜藥妝第一輪',
    note: '不壓縮唐戶、門司港與皿倉山；回小倉後若時間、體力允許，先買高優先且規格明確的藥妝。',
    anchor: { storeId: 'familymart-kokura-station', label: 'JR 小倉站' },
    stops: [
      {
        storeId: 'matsumoto-kiyoshi-kokura-station-south', arrivalTime: '21:00', durationMinutes: 60, optional: true,
        productIds: [],
        note: '這只是小倉站周邊的代表站，不綁定單一門市或庫存；若回程較晚或已疲累就略過，剩餘品項留到 9/6 用搜尋或「即時補買路線」處理。',
      },
    ],
  },
  {
    id: '2026-09-06-kokura', date: '2026-09-06', area: 'kokura', startTime: '12:30', endTime: '16:30',
    title: '小倉市區｜藥妝最後補漏',
    note: '不綁定單一門市；只補 9/5 尚未買到的藥妝，16:30 收尾，預留晚餐、整理與 18:40 前回飯店領行李的時間。',
    anchor: { storeId: 'familymart-kokura-station', label: 'JR 小倉站' },
    stops: [
      /* 藥妝刻意不綁品項：福岡與小倉的藥妝店密度極高，把整份清單釘在某一家門市
       * 反而是過度規劃，也無法保證指定品牌、規格或庫存。
       * 藥妝改為沿途遇到就買，要看還缺什麼請用清單頁的搜尋或「即時補買路線」。 */
      {
        storeId: 'matsumoto-kiyoshi-kokura-station-south', arrivalTime: '16:00', durationMinutes: 30, optional: true,
        productIds: [],
        note: '12:30 起沿小倉市區行程彈性進店；此站只是 16:00 回到車站前的代表性最後補漏點。要看還缺哪些，請用清單頁搜尋或「即時補買路線」。',
      },
    ],
  },
];

export const ITINERARY_SEGMENTS_BY_ID = new Map(ITINERARY_SEGMENTS.map((segment) => [segment.id, segment]));
