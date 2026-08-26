import { PRODUCTS } from '../assets/products.js';
import { STORES } from '../assets/stores.js';
import { ITINERARY_DAYS } from '../assets/itinerary.js';
import { AREA_LABELS, createRoutePlanner, walkText } from '../assets/route-planner.js';
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

function defaultDate() {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());
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
  const fragment = document.createDocumentFragment();
  ITINERARY_DAYS.forEach((day) => {
    const button = makeElement('button', 'itinerary-day-tab', `${shortDate(day.date)}（${day.weekday}）`);
    button.type = 'button';
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(day.date === activeDate));
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

function renderFixedStop(stop, index) {
  const item = makeElement('li', `stop-item${stop.optional ? ' is-optional' : ''}`);
  item.append(makeElement('span', 'stop-number', String(index + 1)));

  const body = makeElement('div', 'stop-body');
  const nameRow = makeElement('div', 'stop-name-row');
  nameRow.append(makeElement('span', 'stop-name', stop.store.name));
  if (stop.optional) nameRow.append(makeElement('span', 'optional-badge', '選配'));
  if (stopCompletion(stop.products)) nameRow.append(makeElement('span', 'done-badge', '已完成'));
  body.append(nameRow);
  body.append(makeElement('div', 'stop-meta', `${stop.arrivalTime} 抵達・停留約 ${stop.durationMinutes} 分・營業 ${stop.store.hours}`));
  if (stop.products.length > 0) {
    body.append(makeElement('p', 'stop-products', `找：${stop.products.map((product) => product.name).join('、')}`));
  } else {
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
  segment.stops.forEach((stop, index) => list.append(renderFixedStop(stop, index)));
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
  const names = leg.products.slice(0, 4).map((product) => product.name);
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
