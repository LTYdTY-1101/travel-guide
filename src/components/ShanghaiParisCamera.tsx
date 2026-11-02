import type React from 'react';
import {Img, Interactive, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Pin, Plane, RouteLayer} from './EditableLayers';

const DEG = Math.PI / 180;
const PLANE_X = 540;
const PLANE_Y = 998;
const RUNWAY_START = [121.8183, 31.1303] as const;
const RUNWAY_END = [121.8166, 31.1625] as const;
const PARIS = [2.3522, 48.8566] as const;

type View = {name: string; lon: number; lat: number; zoom: number; width: number; height: number};
const VIEWS: View[] = [
  {name: 'eurasia-camera-esri', lon: 62, lat: 47, zoom: 3.1, width: 3240, height: 3840},
  {name: 'east-asia-camera', lon: 100, lat: 35, zoom: 5.8, width: 3240, height: 3840},
  {name: 'europe-region', lon: 2.5, lat: 49, zoom: 5.8, width: 3240, height: 3840},
  {name: 'shanghai-region', lon: 121.64, lat: 31.19, zoom: 10.5, width: 1080, height: 1920},
  {name: 'china-coast', lon: 119, lat: 32, zoom: 8.2, width: 3240, height: 3840},
  {name: 'paris-region', lon: 2.45, lat: 48.94, zoom: 10.5, width: 1080, height: 1920},
  {name: 'france-region', lon: 2.45, lat: 48.94, zoom: 8.2, width: 3240, height: 3840},
  {name: 'pvg-district', lon: 121.805, lat: 31.1434, zoom: 12.6, width: 1080, height: 1920},
  {name: 'paris-city', lon: PARIS[0], lat: PARIS[1], zoom: 14, width: 1080, height: 1920},
  {name: 'pvg-runway', lon: 121.805, lat: 31.1434, zoom: 15, width: 3240, height: 3840},
];

const clamp = (value: number, a = 0, b = 1) => Math.min(b, Math.max(a, value));
const smooth = (value: number) => {const v = clamp(value); return v * v * (3 - 2 * v);};
const mix = (a: number, b: number, progress: number) => a + (b - a) * progress;

const keyValue = (time: number, keys: readonly (readonly [number, number])[]) => {
  if (time <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (time <= keys[i][0]) return mix(keys[i - 1][1], keys[i][1], smooth((time - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])));
  }
  return keys[keys.length - 1][1];
};

const mercator = (lon: number, lat: number, zoom: number) => {
  const size = 256 * 2 ** zoom;
  return {x: ((lon + 180) / 360) * size, y: ((1 - Math.asinh(Math.tan(lat * DEG)) / Math.PI) / 2) * size};
};

const spherical = (start: readonly [number, number], end: readonly [number, number], progress: number): [number, number] => {
  const vector = ([lon, lat]: readonly [number, number]) => [Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.cos(lat * DEG) * Math.sin(lon * DEG), Math.sin(lat * DEG)];
  const a = vector(start);
  const b = vector(end);
  const omega = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
  const sin = Math.sin(omega);
  const wa = Math.sin((1 - progress) * omega) / sin;
  const wb = Math.sin(progress * omega) / sin;
  const x = a[0] * wa + b[0] * wb;
  const y = a[1] * wa + b[1] * wb;
  const z = a[2] * wa + b[2] * wb;
  return [Math.atan2(y, x) / DEG, Math.atan2(z, Math.hypot(x, y)) / DEG];
};

export const FLIGHT_HANDOFF = {planeX: PLANE_X, planeY: PLANE_Y, runwayStart: RUNWAY_START, startingZoom: 15.585} as const;

export const getShanghaiParisCamera = (time: number) => {
  const runwayMotion = Math.pow(clamp(time / 1.25), 2.25);
  const runway: [number, number] = [mix(RUNWAY_START[0], RUNWAY_END[0], runwayMotion), mix(RUNWAY_START[1], RUNWAY_END[1], runwayMotion)];
  const routeProgress = keyValue(time, [[0, 0], [1.05, 0], [2.45, .002], [3.75, .12], [4.8, .55], [5.65, .88], [6.55, .98], [7.25, 1]]);
  const route = spherical(RUNWAY_END, PARIS, routeProgress);
  const routeBlend = smooth((time - 1.04) / .38);
  const lon = mix(runway[0], route[0], routeBlend);
  const lat = mix(runway[1], route[1], routeBlend);
  const next = spherical(RUNWAY_END, PARIS, clamp(routeProgress + .002));
  const current = spherical(RUNWAY_END, PARIS, routeProgress);
  const p0 = mercator(current[0], current[1], 4);
  const p1 = mercator(next[0], next[1], 4);
  const routeHeading = -90 - Math.atan2(p1.y - p0.y, p1.x - p0.x) / DEG;
  return {
    lon,
    lat,
    routeProgress,
    zoom: keyValue(time, [[0, 15.585], [1.15, 15.35], [2.45, 10.5], [3.75, 5.8], [4.8, 3.25], [5.65, 3.5], [6.55, 6.3], [7.25, 10.5], [7.98, 14]]),
    pitch: keyValue(time, [[0, 25], [1.15, 23], [2.5, 12], [4.8, 3], [7.2, 0]]),
    rotation: routeHeading * smooth((time - 1.05) / 1.7),
    bank: keyValue(time, [[0, 0], [1.35, 0], [2.1, -3], [3.4, 2], [5.8, -2], [7.1, 0]]),
    height: keyValue(time, [[0, 0], [.9, 0], [1.45, .18], [2.4, .67], [3.25, 1]]),
    arrival: smooth((time - 7.15) / .72),
  };
};

const MapLevel: React.FC<{view: View; lon: number; lat: number; zoom: number}> = ({view, lon, lat, zoom}) => {
  if (Math.abs(zoom - view.zoom) > 2.15) return null;
  const factor = 2 ** (zoom - view.zoom);
  const center = mercator(lon, lat, view.zoom);
  const imageCenter = mercator(view.lon, view.lat, view.zoom);
  const left = PLANE_X + (imageCenter.x - center.x) * factor - view.width * factor / 2;
  const top = PLANE_Y + (imageCenter.y - center.y) * factor - view.height * factor / 2;
  const feather = view.width === 3240 ? 'radial-gradient(ellipse at center,black 52%,transparent 79%)' : 'radial-gradient(ellipse at center,black 48%,transparent 82%)';
  return <Img src={staticFile(`maps/${view.name}.jpg`)} style={{position: 'absolute', left, top, width: view.width * factor, height: view.height * factor, maxWidth: 'none', maskImage: view.name === 'eurasia-camera-esri' ? undefined : feather}} />;
};

export const ShanghaiParisCamera: React.FC<{planeSize: number; style?: React.CSSProperties}> = ({planeSize, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = getShanghaiParisCamera(frame / fps);
  const center = mercator(camera.lon, camera.lat, camera.zoom);
  const linePoints: string[] = [];
  const pointCount = Math.max(1, Math.ceil(camera.routeProgress * 80));
  for (let index = 0; index <= pointCount; index++) {
    const point = spherical(RUNWAY_END, PARIS, camera.routeProgress * index / pointCount);
    const xy = mercator(point[0], point[1], camera.zoom);
    linePoints.push(`${index === 0 ? 'M' : 'L'} ${PLANE_X + xy.x - center.x} ${PLANE_Y + xy.y - center.y}`);
  }

  return (
    <Interactive.Div name="上海 → 巴黎 · 连续飞行镜头" style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#9fb7bc', perspective: 1600, ...style}}>
      <Interactive.Div name="Camera · 经纬度与高度统一驱动" premountFor={fps} style={{position: 'absolute', inset: 0, transformOrigin: `${PLANE_X}px ${PLANE_Y}px`, transform: `rotateX(${camera.pitch}deg) rotateZ(${camera.rotation}deg)`}}>
        {VIEWS.map((view) => <MapLevel key={view.name} view={view} lon={camera.lon} lat={camera.lat} zoom={camera.zoom} />)}
        <RouteLayer name="Route · 飞机机尾至巴黎" premountFor={fps} path={linePoints.join(' ')} progress={1} color="#e43d37" width={Math.max(5, 11 - camera.zoom * .3)} />
      </Interactive.Div>
      <Interactive.Div name="Shadow · 飞机轮廓随高度分离" premountFor={fps} style={{position: 'absolute', left: PLANE_X - planeSize / 2, top: PLANE_Y - planeSize / 2, width: planeSize, height: planeSize, opacity: (1 - camera.arrival) * (1 - camera.height * .76), translate: `${camera.height * 76}px ${10 + camera.height * 150}px`, scale: 1 - camera.height * .28, filter: `brightness(0) blur(${4 + camera.height * 23}px)`}}>
        <Img src={staticFile('plane-c4d.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
      </Interactive.Div>
      <Plane name="Plane · 中央锁定的 C4D 飞机" premountFor={fps} color="#ffffff" size={planeSize} style={{left: PLANE_X - planeSize / 2, top: PLANE_Y - planeSize / 2, rotate: `${camera.bank}deg`, opacity: 1 - camera.arrival, transform: `rotateX(${-camera.height * 11}deg)`, transformOrigin: 'center center'}} />
      <Pin name="Landing · 巴黎实际位置" premountFor={fps} label="巴黎" color="#ef3b32" style={{left: PLANE_X - 31, top: PLANE_Y - 31, opacity: camera.arrival, scale: .7 + camera.arrival * .3, transformOrigin: 'center bottom'}} />
      <Interactive.Div name="地图 · Esri 影像署名" style={{position: 'absolute', right: 16, bottom: 16, padding: '7px 11px', borderRadius: 5, backgroundColor: 'rgba(255,255,255,.86)', color: '#24313c', font: '14px Arial, sans-serif'}}>Imagery © Esri, Maxar, Earthstar Geographics, GIS User Community</Interactive.Div>
    </Interactive.Div>
  );
};
