import { PRODUCTS } from '../assets/products.js?v=20260901';
import { STORES } from '../assets/stores.js?v=20260901';
import { ITINERARY_DAYS } from '../assets/itinerary.js?v=20260901';
import { AREA_LABELS, createRoutePlanner, walkText } from '../assets/route-planner.js?v=20260901';
import { readStoredBool } from '../assets/app-utils.js';

const planner = createRoutePlanner({ stores: STORES, products: PRODUCTS, readStoredBool });
const storesById = new Map(STORES.map((store) => [store.id, store]));
let activeDate = defaultDate();
let activeRemainingArea = null;

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

/* 旅程在日本、人從台灣出發，兩地同為 UTC+9／+8 之外的判斷會讓「今天」跳掉一天；
 * 沿用既有的 Asia/Taipei 基準，只是把它抽出來讓分頁也標得出「今天」。 */
function todayDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());
}

function defaultDate() {
  const today = todayDate();
  return ITINERARY_DAYS.find((day) => day.date === today)?.date
    || ITINERARY_DAYS.find((day) => day.date > today)?.date
    || ITINERARY_DAYS.at(-1).date;
}

function shortDate(date) {
  const [, month, day] = date.split('-');
  return `${Number(month)}/${Number(day)}`;
}

function isDone(product) {
  const prefix = product.tracking === 'try' ? 'kij_tried_' : 'kij_bought_';
  return readStoredBool(`${prefix}${product.id}`, false);
}

function mapsUrl(store) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
}

function makeLink(label, href, className, { external = false } = {}) {
  const link = makeElement('a', className, label);
  link.href = href;
  if (external) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}

function renderDayTabs() {
  const tabs = document.getElementById('itineraryDayTabs');
  const today = todayDate();
  const fragment = document.createDocumentFragment();
  ITINERARY_DAYS.forEach((day) => {
    const button = makeElement('button', 'itinerary-day-tab', `${shortDate(day.date)}（${day.weekday}）`);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(day.date === activeDate));
    /* 四顆分頁長得一樣重，出門當天要先看得出自己在第幾天。
       徽章本身也是文字，讀螢幕閱讀器時會唸出來，不必另外加 aria-label。 */
    if (day.date === today) button.append(makeElement('span', 'day-tab-today', '今天'));
    button.addEventListener('click', () => {
      activeDate = day.date;
      renderDayTabs();
      renderActiveDay();
    });
    fragment.append(button);
  });
  tabs.replaceChildren(fragment);
}

function stopCompletion(products) {
  if (products.length === 0) return false;
  return products.every(isDone);
}

function minutesOf(time) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

/* 表定時刻只寫「幾點到、待多久」，沒有把站與站之間的移動算進去——
 * 實際上 12 段路程中有 4 段，上一站的離開時間就是下一站的抵達時間（留 0 分）。
 * 這裡不改動任何時刻（那是使用者的行程決定），只把「這段要走多久 / 排程留多久」
 * 顯示出來，讓人自己看得到哪一段其實趕不到。
 * 距離沿用全站一致的直線估算（walkText），與即時補買路線同一套標準。 */
function renderStopLeg(leg, index, segment, stops) {
  if (leg.meters === null || leg.meters === undefined) return null;
  /* 同座標＝同一棟樓（ミーナ天神的 LOFT 與 3COINS、博多站的茅乃舍與 HANDS）。
     這種「移動」只是搭電梯換樓層，排 0 分是合理的，不該當成排程過緊。 */
  const sameBuilding = leg.meters < 50;
  const element = makeElement('p', 'stop-leg');
  element.append(makeElement('span', '', sameBuilding
    ? '同一棟樓，直接移動'
    : `從${index === 0 ? (segment.anchor?.label || '起點') : '上一站'} ${walkText(leg.meters)}`));

  /* 只檢查站與站之間。第一站比的是「區段開始時間」，而區段本來就是從抵達第一站
     算起的，拿它當移動時間不足會整段誤報。 */
  if (!sameBuilding && index > 0) {
    const walkMinutes = Math.max(1, Math.round(leg.meters / 80));
    const previous = stops[index - 1];
    const slack = minutesOf(leg.arrivalTime) - (minutesOf(previous.arrivalTime) + previous.durationMinutes);
    if (slack < walkMinutes) {
      element.classList.add('is-tight');
      element.append(makeElement('span', 'stop-leg-tight', slack <= 0 ? '排程沒留移動時間' : `排程只留 ${slack} 分`));
    }
  }
  return element;
}

function renderFixedStop(stop, index, legElement) {
  const item = makeElement('li', `stop-item${stop.optional ? ' is-optional' : ''}`);
  item.append(makeElement('span', 'stop-number', String(index + 1)));

  const body = makeElement('div', 'stop-body');
  if (legElement) body.append(legElement);
  const nameRow = makeElement('div', 'stop-name-row');
  nameRow.append(makeElement('span', 'stop-name', stop.store.name));
  if (stop.optional) nameRow.append(makeElement('span', 'optional-badge', '選配'));
  if (stopCompletion(stop.products)) nameRow.append(makeElement('span', 'done-badge', '已完成'));
  body.append(nameRow);
  body.append(makeElement('div', 'stop-meta', `${stop.arrivalTime} 抵達・停留約 ${stop.durationMinutes} 分・營業 ${stop.store.hours}`));
  if (stop.confirmedProducts.length > 0) {
    body.append(makeElement('p', 'stop-products', `找：${stop.confirmedProducts.map((product) => product.name).join('、')}`));
  }
  if (stop.candidateProducts.length > 0) {
    body.append(makeElement('p', 'stop-products stop-products-candidate', `到店確認：${stop.candidateProducts.map((product) => product.name).join('、')}`));
  }
  if (stop.products.length === 0) {
    body.append(makeElement('p', 'stop-products', '逛店／依現場需要選購'));
  }
  body.append(makeElement('p', 'stop-note', stop.note));
  item.append(body, makeLink('導航', mapsUrl(stop.store), 'store-nav-link', { external: true }));
  return item;
}

function renderSegment(segmentId) {
  const segment = planner.fixedSegment(segmentId);
  if (!segment) return document.createDocumentFragment();
  const card = makeElement('article', 'segment-card');
  const header = makeElement('header', 'segment-card-header');
  const heading = makeElement('div');
  heading.append(
    makeElement('span', 'segment-time', `${segment.startTime}–${segment.endTime}`),
    makeElement('h3', '', segment.title),
    makeElement('p', 'segment-note', segment.note)
  );
  header.append(heading, makeLink('在地圖查看', `map.html?plan=${encodeURIComponent(segment.id)}`, 'map-route-link'));
  card.append(header);
  const list = makeElement('ol', 'stop-list');
  /* routeLegs 已經會從 anchor 起算每一段的直線距離，固定行程與即時補買路線共用同一支。 */
  const legs = planner.routeLegs(segment);
  segment.stops.forEach((stop, index) => {
    const leg = renderStopLeg(legs[index], index, segment, segment.stops);
    list.append(renderFixedStop(stop, index, leg));
  });
  card.append(list);
  return card;
}

function renderActiveDay() {
  const day = ITINERARY_DAYS.find((item) => item.date === activeDate) || ITINERARY_DAYS[0];
  const container = document.getElementById('itineraryDayContent');
  const fragment = document.createDocumentFragment();
  const summary = makeElement('div', 'day-summary-card');
  summary.append(
    makeElement('h3', '', `${shortDate(day.date)}（${day.weekday}）${day.title}`),
    makeElement('p', '', day.summary)
  );
  fragment.append(summary);
  if (day.segmentIds.length === 0) {
    const free = makeElement('div', 'free-day-card');
    free.append(
      makeElement('h3', '', '不排固定購物站'),
      makeElement('p', '', '本日以景點行程為主；沿途遇到仍在營業的藥妝店或便利商店，有時間再進去逛。')
    );
    fragment.append(free);
  } else {
    const list = makeElement('div', 'segment-list');
    day.segmentIds.forEach((segmentId) => list.append(renderSegment(segmentId)));
    fragment.append(list);
  }
  container.replaceChildren(fragment);
}

function renderRemainingStop(leg, index) {
  const item = makeElement('li', 'remaining-stop');
  item.append(makeElement('span', 'stop-number', String(index + 1)));
  const body = makeElement('div');
  body.append(makeElement('strong', '', leg.store.name));
  if (leg.meters !== null) body.append(makeElement('span', '', `${index === 0 ? '距起點' : '距上一站'}約 ${walkText(leg.meters)}`));
  if (leg.candidateProducts.length > 0) body.append(makeElement('span', 'candidate-note', '候選商品需到店確認'));
  const candidateIds = new Set(leg.candidateProducts.map((product) => product.id));
  const names = leg.products.slice(0, 4)
    .map((product) => `${product.name}${candidateIds.has(product.id) ? '（到店確認）' : ''}`);
  if (leg.products.length > 4) names.push(`另 ${leg.products.length - 4} 項`);
  body.append(makeElement('span', '', names.join('、')));
  item.append(body);
  return item;
}

function renderRemainingTabs(groups) {
  const tabs = document.getElementById('remainingRouteTabs');
  const fragment = document.createDocumentFragment();
  groups.forEach((group) => {
    const button = makeElement('button', 'remaining-route-tab', `${AREA_LABELS[group.area]} ${group.stops.length} 站`);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(group.area === activeRemainingArea));
    button.addEventListener('click', () => {
      activeRemainingArea = group.area;
      renderRemainingRoutes();
    });
    fragment.append(button);
  });
  tabs.replaceChildren(fragment);
}

function renderRemainingRoutes() {
  const groups = planner.remainingGroups();
  const total = groups.reduce((sum, group) => sum + group.stops.length, 0);
  document.getElementById('remainingRouteCount').textContent = total > 0 ? `${groups.length} 區・${total} 站` : '';
  document.getElementById('remainingRouteEmpty').hidden = total !== 0;
  if (groups.length === 0) {
    document.getElementById('remainingRouteTabs').replaceChildren();
    document.getElementById('remainingRouteGroups').replaceChildren();
    return;
  }
  if (!groups.some((group) => group.area === activeRemainingArea)) activeRemainingArea = groups[0].area;
  renderRemainingTabs(groups);
  const group = groups.find((item) => item.area === activeRemainingArea);
  const card = makeElement('article', 'remaining-route-card');
  card.append(makeElement('h3', '', `${AREA_LABELS[group.area]}即時路線`));
  const legs = planner.routeLegs(group);
  const totalMeters = legs.reduce((sum, leg) => sum + (leg.meters || 0), 0);
  card.append(
    makeElement('p', 'route-total', `共 ${group.stops.length} 站・直線約 ${walkText(totalMeters)}`),
    makeElement('p', 'route-start', `起點：${group.anchor?.label || '區域內第一站'}`)
  );
  const list = makeElement('ol', 'remaining-stop-list');
  legs.forEach((leg, index) => list.append(renderRemainingStop(leg, index)));
  card.append(list);
  const actions = makeElement('div', 'route-actions');
  actions.append(makeLink('在地圖查看', `map.html?route=${encodeURIComponent(group.area)}`, 'map-route-link'));
  planner.routeDirectionsSegments(group).forEach((segment, index, all) => {
    const label = all.length === 1 ? 'Google Maps 整段導航' : `Google Maps 第 ${index + 1} 段`;
    actions.append(makeLink(label, segment.url, 'maps-link', { external: true }));
  });
  card.append(actions);
  document.getElementById('remainingRouteGroups').replaceChildren(card);
}

function renderAll() {
  renderDayTabs();
  renderActiveDay();
  renderRemainingRoutes();
}

renderAll();
window.addEventListener('pageshow', (event) => {
  if (event.persisted) renderAll();
});
