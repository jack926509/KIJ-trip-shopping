import assert from 'node:assert/strict';
import { ITINERARY_DAYS, ITINERARY_SEGMENTS } from '../assets/itinerary.js';
import { STORES } from '../assets/stores.js';
import { PRODUCTS } from '../assets/products.js';
import { createRoutePlanner, haversineMeters } from '../assets/route-planner.js';

assert.deepEqual(
  ITINERARY_DAYS.map((day) => day.date),
  ['2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06'],
  '行程日期必須完整涵蓋 9/3–9/6'
);

const segmentIds = ITINERARY_SEGMENTS.map((segment) => segment.id);
assert.equal(new Set(segmentIds).size, segmentIds.length, '行程 segment id 不得重複');
assert.deepEqual(
  ITINERARY_SEGMENTS.find((segment) => segment.id === '2026-09-03-tenjin-pm').stops.map((stop) => stop.storeId),
  [
    'biccamera-tenjin-1',
    'daiso-lachic-fukuoka-tenjin',
    'hoka-fukuoka-tenjin',
    'aeon-shoppers-fukuoka-tenjin',
    'reganet-tenjin',
    'cosmos-tenjin-daimaru-mae',
  ],
  '天神晚間固定順序不得被距離排序改寫'
);

const state = new Map();
const planner = createRoutePlanner({
  stores: STORES,
  products: PRODUCTS,
  readStoredBool: (key, fallback) => state.has(key) ? state.get(key) : fallback,
});

const fixed = planner.fixedSegment('2026-09-03-tenjin-pm');
assert.equal(fixed.stops.length, 6, '固定行程應包含 Cosmos 選配站');
assert.equal(fixed.stops.at(-1).optional, true, 'Cosmos 必須標成選配');
assert.ok(planner.routeLegs(fixed).every((leg) => Number.isFinite(leg.meters)), '每段固定路線都應可計算距離');
assert.ok(planner.routeDirectionsSegments(fixed).length > 0, '固定路線應可產生 Google Maps 導航');

const groups = planner.remainingGroups();
assert.deepEqual(groups.map((group) => group.area), ['tenjin', 'hakata', 'kokura'], '即時路線區域順序固定');
assert.ok(groups.every((group) => group.stops.length > 0), '每個即時路線區域都應有站點');

assert.equal(Math.round(haversineMeters({ lat: 33.586903, lng: 130.401108 }, { lat: 33.587925, lng: 130.400894 })), 115);

console.log('✓ 行程資料與路線規劃契約通過');
