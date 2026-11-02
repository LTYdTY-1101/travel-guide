import * as turf from '@turf/turf';
import type {Feature, LineString, Position} from 'geojson';

export type Coordinate = [number, number];
export const EIFFEL: Coordinate = [2.2945, 48.8584];
export const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
export const smooth = (n: number) => {const t = clamp(n); return t * t * t * (10 + t * (-15 + 6 * t));};

// Monotone Hermite curve: continuous velocity at every intermediate keyframe.
export const curve = (x: number, xs: number[], ys: number[]) => {
  const n = xs.length;
  const slopes = xs.slice(1).map((v, i) => (ys[i + 1] - ys[i]) / (v - xs[i]));
  const tangent = (i: number) => {
    if (i === 0 || i === n - 1) return 0;
    const a = slopes[i - 1], b = slopes[i];
    if (a * b <= 0) return 0;
    const h0 = xs[i] - xs[i - 1], h1 = xs[i + 1] - xs[i];
    const w0 = 2 * h1 + h0, w1 = h1 + 2 * h0;
    return (w0 + w1) / (w0 / a + w1 / b);
  };
  const i = Math.max(0, Math.min(n - 2, xs.findIndex(v => v > x) - 1 < 0 ? n - 2 : xs.findIndex(v => v > x) - 1));
  const h = xs[i + 1] - xs[i], t = clamp((x - xs[i]) / h);
  return (2*t**3-3*t*t+1)*ys[i]+(t**3-2*t*t+t)*h*tangent(i)+(-2*t**3+3*t*t)*ys[i+1]+(t**3-t*t)*h*tangent(i+1);
};

export const makeRoute = (start: Coordinate, end: Coordinate) => {
  if (turf.distance(start, end) < 1) throw new Error('起终点距离必须大于 1 km');
  const route = turf.greatCircle(start, end, {npoints: 2048});
  if (route.geometry.type !== 'LineString') throw new Error('当前飞行镜头暂不支持跨越日期变更线的路线');
  const line = route as Feature<LineString>;
  return {line, km: turf.length(line)};
};
export type Route = ReturnType<typeof makeRoute>;
export const at = (route: Route, km: number) => turf.along(route.line, clamp(km, 0, route.km)).geometry.coordinates as Coordinate;
export const slice = (route: Route, km: number) => turf.lineSliceAlong(route.line, 0, Math.max(.000001, clamp(km, 0, route.km)));

export const flightState = (seconds: number, duration: number, route: Route, takeoffZoom: number, cruiseZoom: number, arrivalZoom: number) => {
  const u = clamp(seconds / duration);
  const progress = curve(u, [0,.045,.12,.24,.38,.5,.62,.76,.88,.96,1], [0,.00005,.0003,.006,.09,.5,.91,.994,.9997,.99997,1]);
  const km = progress * route.km;
  const position = at(route, km);
  const before = at(route, Math.max(0, km - .05));
  const after = at(route, Math.min(route.km, km + .05));
  let heading = turf.bearing(before, after);
  if (heading < 0) heading += 360;
  const zoom = curve(u, [0,.06,.12,.24,.38,.5,.62,.76,.88,.96,1],
    [takeoffZoom,takeoffZoom-.25,takeoffZoom-1.6,Math.max(9,cruiseZoom+2),Math.max(5.5,cruiseZoom+1),cruiseZoom,Math.max(5.5,cruiseZoom+1),Math.max(9,cruiseZoom+2),arrivalZoom-1.6,arrivalZoom-.1,arrivalZoom]);
  const altitude = smooth((u-.045)/.16) * (1-smooth((u-.84)/.14));
  return {u, km, progress, position, heading, zoom, altitude};
};
export const featureLine = (coordinates: Position[]): Feature<LineString> => turf.lineString(coordinates);
