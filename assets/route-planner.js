import { createCatalogIndex } from './catalog-index.js';
import { ITINERARY_SEGMENTS_BY_ID } from './itinerary.js';

export const ROUTE_AREA_ORDER = ['tenjin', 'hakata', 'kokura'];
export const AREA_LABELS = { tenjin: '天神', hakata: '博多', kokura: '小倉' };

const ROUTE_START_ANCHORS = {
  tenjin: { storeId: 'lawson-nishitetsu-fukuoka-tenjin-south', label: '西鐵福岡（天神）站 南口' },
  hakata: { storeId: 'familymart-hakata-station', label: 'JR 博多站' },
  kokura: { storeId: 'familymart-kokura-station', label: 'JR 小倉站' },
};
const GMAPS_MAX_WAYPOINTS = 9;

export function haversineMeters(a, b) {
  const radius = 6371000;
  const toRad = (degrees) => (degrees * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

export function walkText(meters) {
  const distance = meters < 1000 ? `${Math.round(meters)} 公尺` : `${(meters / 1000).toFixed(1)} 公里`;
  return `${distance}・步行約 ${Math.max(1, Math.round(meters / 80))} 分`;
}

function orderByProximity(stops, anchor) {
  const remaining = stops.slice();
  const ordered = [];
  while (remaining.length > 0) {
    const from = ordered.length === 0 ? anchor : ordered.at(-1).store;
    if (!from) {
      ordered.push(remaining.shift());
      continue;
    }
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    remaining.forEach((stop, index) => {
      const distance = haversineMeters(from, stop.store);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    ordered.push(remaining.splice(nearestIndex, 1)[0]);
  }
  return ordered;
}

export function createRoutePlanner({ stores, products, readStoredBool = (_key, fallback) => fallback }) {
  const storesById = new Map(stores.map((store) => [store.id, store]));
  const productsById = new Map(products.map((product) => [product.id, product]));
  const catalog = createCatalogIndex(products);

  const anchorFrom = (config) => {
    if (!config) return null;
    const store = storesById.get(config.storeId);
    return store ? { lat: store.lat, lng: store.lng, label: config.label } : null;
  };
  const isRemaining = (product) => product.tracking === 'try'
    ? !readStoredBool(`kij_tried_${product.id}`, false)
    : !readStoredBool(`kij_bought_${product.id}`, false);
  const remainingProductsForStore = (storeId) => {
    const confirmedProducts = catalog.productsForStore(storeId, 'confirmed').filter(isRemaining);
    const confirmedIds = new Set(confirmedProducts.map((product) => product.id));
    const candidateProducts = catalog.productsForStore(storeId, 'candidate')
      .filter((product) => isRemaining(product) && !confirmedIds.has(product.id));
    return { confirmedProducts, candidateProducts, products: [...confirmedProducts, ...candidateProducts] };
  };

  function remainingGroups() {
    return ROUTE_AREA_ORDER.map((area) => {
      const anchor = anchorFrom(ROUTE_START_ANCHORS[area]);
      const stops = stores
        .filter((store) => store.area === area)
        .map((store) => ({ store, ...remainingProductsForStore(store.id), optional: false }))
        .filter((stop) => stop.products.length > 0);
      return { id: `remaining-${area}`, kind: 'remaining', area, anchor, stops: orderByProximity(stops, anchor) };
    }).filter((group) => group.stops.length > 0);
  }

  function fixedSegment(segmentId) {
    const segment = ITINERARY_SEGMENTS_BY_ID.get(segmentId);
    if (!segment) return null;
    const stops = segment.stops.map((stop) => ({
      ...stop,
      store: storesById.get(stop.storeId),
      products: stop.productIds.map((productId) => productsById.get(productId)).filter(Boolean),
    })).filter((stop) => stop.store);
    return { ...segment, kind: 'fixed', anchor: anchorFrom(segment.anchor), stops };
  }

  function remainingGroup(area) {
    return remainingGroups().find((group) => group.area === area) || null;
  }

  function routeLegs(group) {
    let previous = group?.anchor || null;
    return (group?.stops || []).map((stop) => {
      const meters = previous ? haversineMeters(previous, stop.store) : null;
      previous = stop.store;
      return { ...stop, meters };
    });
  }

  function routeDirectionsSegments(group) {
    const points = [];
    if (group?.anchor) points.push({ label: '起點', lat: group.anchor.lat, lng: group.anchor.lng });
    (group?.stops || []).forEach((stop, index) => points.push({ label: `第 ${index + 1} 站`, lat: stop.store.lat, lng: stop.store.lng }));
    if (points.length < 2) return [];

    const coords = (point) => `${point.lat},${point.lng}`;
    const perSegment = GMAPS_MAX_WAYPOINTS + 2;
    const segments = [];
    for (let start = 0; start < points.length - 1; start += perSegment - 1) {
      const chunk = points.slice(start, start + perSegment);
      const last = chunk.at(-1);
      const waypoints = chunk.slice(1, -1).map(coords);
      const url = 'https://www.google.com/maps/dir/?api=1&travelmode=walking'
        + `&origin=${coords(chunk[0])}&destination=${coords(last)}`
        + (waypoints.length > 0 ? `&waypoints=${waypoints.join('|')}` : '');
      segments.push({ url, from: chunk[0].label, to: last.label });
    }
    return segments;
  }

  return { fixedSegment, remainingGroup, remainingGroups, routeLegs, routeDirectionsSegments };
}
