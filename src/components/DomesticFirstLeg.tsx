import type React from 'react';
import {Img, Interactive, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LandmarkLayer, Plane} from './EditableLayers';

const X = 540;
const Y = 998;
const RAD = Math.PI / 180;
const SANYA = [109.4901, 18.2612] as const;
const WANNING = [110.19415, 18.73432] as const;
type Key = readonly [time: number, lon: number, lat: number, zoom: number, pitch: number, bearing: number];
type Camera = {lon: number; lat: number; zoom: number; pitch: number; bearing: number};
type View = {name: string; lon: number; lat: number; zoom: number; width: number; height: number};

// All geography, height and pitch are sampled from the same C1 continuous camera curve.
// Derivatives at interior knots come from neighboring knots; the camera does not stop there.
const flight: readonly Key[] = [
  [0, 121.8183, 31.1303, 15.585, 25, 0],
  [.9, 121.8174, 31.146, 15.2, 25, 0],
  [1.7, 121.8163, 31.181, 13.5, 21, 1],
  [2.5, 121.28, 30.75, 10.3, 16, 3],
  [3.5, 119.4, 28.5, 7.4, 9, 2],
  [4.5, 116.1, 24.8, 5.9, 5, -2],
  [5.35, 112.8, 21.2, 5.8, 5, -4],
  [6.15, 110.6, 19.1, 8.7, 10, -2],
  [6.85, 109.72, 18.42, 12.2, 18, 0],
  [7.4, SANYA[0], SANYA[1], 14.85, 24, 0],
];
const car: readonly Key[] = [
  [11.4, SANYA[0], SANYA[1], 14.95, 24, 0],
  [12.2, 109.59, 18.29, 12.0, 18, -2],
  [13.2, 109.73, 18.39, 10.0, 10, -3],
  [14.2, 109.93, 18.52, 9.7, 8, -2],
  [15.2, 110.09, 18.64, 11.2, 13, 0],
  [16.6, WANNING[0], WANNING[1], 15.0, 24, 0],
];

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (v: number) => {const p = clamp(v); return p * p * (3 - 2 * p);};
const sample = (keys: readonly Key[], t: number): Camera => {
  if (t <= keys[0][0]) return {lon: keys[0][1], lat: keys[0][2], zoom: keys[0][3], pitch: keys[0][4], bearing: keys[0][5]};
  if (t >= keys[keys.length - 1][0]) {
    const k = keys[keys.length - 1];
    return {lon: k[1], lat: k[2], zoom: k[3], pitch: k[4], bearing: k[5]};
  }
  const i = keys.findIndex((k) => k[0] >= t);
  const a = keys[i - 1];
  const b = keys[i];
  const dt = b[0] - a[0];
  const u = (t - a[0]) / dt;
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
  const h10 = u ** 3 - 2 * u ** 2 + u;
  const h01 = -2 * u ** 3 + 3 * u ** 2;
  const h11 = u ** 3 - u ** 2;
  const get = (component: 1 | 2 | 3 | 4 | 5) => {
    const previous = keys[Math.max(0, i - 2)];
    const next = keys[Math.min(keys.length - 1, i + 1)];
    const m0 = i === 1 ? 0 : (b[component] - previous[component]) / (b[0] - previous[0]);
    const m1 = i === keys.length - 1 ? 0 : (next[component] - a[component]) / (next[0] - a[0]);
    return h00 * a[component] + h10 * dt * m0 + h01 * b[component] + h11 * dt * m1;
  };
  return {lon: get(1), lat: get(2), zoom: get(3), pitch: get(4), bearing: get(5)};
};
const getCamera = (t: number): Camera => {
  if (t < 7.4) return sample(flight, t);
  if (t < 11.4) return {lon: SANYA[0], lat: SANYA[1], zoom: 14.85 + .10 * smooth((t - 7.4) / 4), pitch: 24, bearing: 0};
  if (t < 16.6) return sample(car, t);
  return {lon: WANNING[0], lat: WANNING[1], zoom: 15 + .10 * smooth((t - 16.6) / 4.2), pitch: 24, bearing: 0};
};
const mercator = (lon: number, lat: number, z: number) => {
  const size = 256 * 2 ** z;
  return {x: (lon + 180) / 360 * size, y: (1 - Math.asinh(Math.tan(lat * RAD)) / Math.PI) / 2 * size};
};

const views: Record<string, View> = {
  'china-overview': {name: 'china-overview', lon: 115.5, lat: 25, zoom: 5.5, width: 3240, height: 3840},
  'china-coast': {name: 'china-coast', lon: 119, lat: 32, zoom: 8.2, width: 3240, height: 3840},
  'shanghai-region-wide': {name: 'shanghai-region-wide', lon: 121.64, lat: 31.19, zoom: 10.5, width: 3240, height: 3840},
  'pvg-district-wide': {name: 'pvg-district-wide', lon: 121.805, lat: 31.1434, zoom: 12.6, width: 3240, height: 3840},
  'pvg-runway': {name: 'pvg-runway', lon: 121.805, lat: 31.1434, zoom: 15, width: 3240, height: 3840},
  'hainan-island': {name: 'hainan-island', lon: 110, lat: 19.1, zoom: 8.5, width: 3240, height: 3840},
  'hainan-route': {name: 'hainan-route', lon: 109.86, lat: 18.5, zoom: 10.7, width: 3240, height: 3840},
  'sanya-area': {name: 'sanya-area', lon: 109.49, lat: 18.26, zoom: 13, width: 3240, height: 3840},
  'sanya-bay-close': {name: 'sanya-bay-close', lon: 109.489, lat: 18.26, zoom: 15, width: 2160, height: 3840},
  'wanning-area': {name: 'wanning-area', lon: 110.193, lat: 18.735, zoom: 13, width: 3240, height: 3840},
  'wanning-xinglong-close': {name: 'wanning-xinglong-close', lon: 110.193, lat: 18.735, zoom: 15, width: 2160, height: 3840},
};
const shanghai = ['china-overview', 'china-coast', 'shanghai-region-wide', 'pvg-district-wide', 'pvg-runway'];
const sanya = ['china-overview', 'hainan-island', 'hainan-route', 'sanya-area', 'sanya-bay-close'];
const wanning = ['china-overview', 'hainan-island', 'hainan-route', 'wanning-area', 'wanning-xinglong-close'];

const MapImage: React.FC<{view: View; camera: Camera; opacity: number}> = ({view, camera, opacity}) => {
  const factor = 2 ** (camera.zoom - view.zoom);
  const c = mercator(camera.lon, camera.lat, view.zoom);
  const m = mercator(view.lon, view.lat, view.zoom);
  return <Img src={staticFile(`maps/${view.name}.jpg`)} style={{position: 'absolute', left: X + (m.x - c.x) * factor - view.width * factor / 2, top: Y + (m.y - c.y) * factor - view.height * factor / 2, width: view.width * factor, height: view.height * factor, maxWidth: 'none', opacity}} />;
};
const selectedMaps = (t: number, zoom: number) => {
  const chain = t < 4.8 ? shanghai : t < 13.0 ? sanya : wanning;
  const list = chain.map((name) => views[name]);
  const hi = list.findIndex((v) => v.zoom > zoom);
  if (hi === -1) return [{view: list[list.length - 1], opacity: 1}];
  if (hi === 0) return [{view: list[0], opacity: 1}];
  const low = list[hi - 1];
  const high = list[hi];
  const reveal = smooth((zoom - (high.zoom - .9)) / .75);
  return [{view: low, opacity: 1}, {view: high, opacity: reveal}];
};

const Trail: React.FC<{camera: Camera; points: readonly Key[]; endTime: number; color: string}> = ({camera, points, endTime, color}) => {
  const center = mercator(camera.lon, camera.lat, camera.zoom);
  const d: string[] = [];
  const start = points[0][0];
  const end = Math.min(points[points.length - 1][0], endTime);
  for (let i = 0; i <= 110; i++) {
    const time = start + (end - start) * i / 110;
    const place = sample(points, time);
    const p = mercator(place.lon, place.lat, camera.zoom);
    d.push(`${i ? 'L' : 'M'} ${X + p.x - center.x} ${Y + p.y - center.y}`);
  }
  return <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width="1080" height="1920"><path d={d.join(' ')} fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/><path d={d.join(' ')} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
};

const Car: React.FC<{opacity: number}> = ({opacity}) => (
  <Interactive.Div name="汽车 · 中央锁定" style={{position: 'absolute', left: X - 63, top: Y - 95, width: 126, height: 190, opacity, filter: 'drop-shadow(13px 16px 10px rgba(24,33,40,.33))'}}>
    <svg width="126" height="190" viewBox="0 0 126 190" aria-hidden="true"><defs><linearGradient id="carbody" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff1d9"/><stop offset=".5" stopColor="#f8faf9"/><stop offset="1" stopColor="#b5c4c8"/></linearGradient></defs><rect x="13" y="7" width="100" height="176" rx="33" fill="#253946"/><rect x="18" y="11" width="90" height="168" rx="31" fill="url(#carbody)"/><path d="M29 55Q63 39 97 55L104 111Q63 129 22 111Z" fill="#6c8795"/><path d="M33 58Q63 45 93 58L96 102Q63 114 30 102Z" fill="#a1bdc8"/><rect x="27" y="14" width="20" height="10" rx="4" fill="#fff4bd"/><rect x="79" y="14" width="20" height="10" rx="4" fill="#fff4bd"/><rect x="26" y="161" width="22" height="8" rx="3" fill="#ed5d54"/><rect x="78" y="161" width="22" height="8" rx="3" fill="#ed5d54"/></svg>
  </Interactive.Div>
);

const Landmark: React.FC<{t: number; from: number; until: number; title: string; location: string; kind: 'eiffel' | 'louvre'; width: number; height: number}> = ({t, from, until, title, location, kind, width, height}) => {
  const enter = smooth((t - from) / .92);
  const exit = 1 - smooth((t - (until - .62)) / .62);
  const show = enter * exit;
  const label = smooth((t - from - .65) / .42) * (1 - smooth((t - until + .83) / .34));
  const wobbleT = clamp((t - from - .98) / .8);
  const wobble = wobbleT >= 1 ? 0 : Math.sin(wobbleT * 4 * Math.PI) * 8 * (1 - wobbleT);
  return <>
    <Interactive.Div name={`${location} · 地图压暗`} style={{position: 'absolute', inset: 0, backgroundColor: '#182237', opacity: .21 * smooth((t - from + .2) / .35) * exit}} />
    <Interactive.Div name={`${title} · 底座接触投影`} style={{position: 'absolute', left: X - width * .45, top: 1180, width: width * .9, height: 90, borderRadius: '50%', backgroundColor: '#141d26', filter: 'blur(30px)', opacity: .30 * show}} />
    <LandmarkLayer name={`${location} · ${title}完整模型`} kind={kind} src={staticFile(`landmarks/dioramas/${kind}.png`)} label={title} tilt={-57 * (1 - enter) - 40 * (1 - exit)} style={{left: X - width / 2, top: 1250 - height, width, height, opacity: show, translate: `0px ${(1 - enter) * 108 + (1 - exit) * 72}px`, scale: .83 + .19 * enter - .12 * (1 - exit), transformOrigin: '50% 100%'}} />
    <Interactive.Div name={`${title} · 地点名称`} style={{position: 'absolute', left: '50%', top: 1295, transform: `translateX(-50%) translateY(${(1 - label) * 22}px)`, minWidth: 360, height: 108, padding: '0 35px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 17, borderRadius: 22, backgroundColor: 'rgba(255,255,255,.97)', boxShadow: '0 17px 42px rgba(14,30,46,.25)', opacity: label}}>
      <Interactive.Div name={`${title} · 摇摆定位图标`} style={{width: 34, height: 45, transform: `rotate(${wobble}deg)`, transformOrigin: '50% 100%'}}><svg width="34" height="45" viewBox="0 0 34 45"><path d="M17 2C8 2 2 9 2 17c0 11 15 25 15 25s15-14 15-25C32 9 26 2 17 2Z" fill="#e83d36"/><circle cx="17" cy="17" r="6" fill="white"/></svg></Interactive.Div>
      <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.18}}><span style={{font: '700 23px Arial, sans-serif', color: '#718297', letterSpacing: 2}}>{location}</span><span style={{fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif', fontSize: 40, fontWeight: 800, color: '#17243a', whiteSpace: 'nowrap'}}>{title}</span></div>
    </Interactive.Div>
  </>;
};

export const DomesticFirstLeg: React.FC<{frozen?: boolean}> = ({frozen = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frozen ? 0 : frame / fps;
  const camera = getCamera(t);
  const planeAlpha = 1 - smooth((t - 7.30) / .50);
  const carAlpha = smooth((t - 11.25) / .30) * (1 - smooth((t - 16.50) / .45));
  const height = smooth((t - .75) / 2.8);
  const maps = selectedMaps(t, camera.zoom);
  return <Interactive.Div name="国内路线第一段 · 统一相机曲线" style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#7d9dab', perspective: 1600}}>
    <Interactive.Div name="卫星地图 · 随交通工具移动" style={{position: 'absolute', inset: 0, transformOrigin: `${X}px ${Y}px`, transform: `rotateX(${camera.pitch}deg) rotateZ(${camera.bearing}deg)`}}>
      {maps.map(({view, opacity}) => opacity > .001 && <MapImage key={view.name} view={view} camera={camera} opacity={opacity} />)}
      {t <= 8 && <Trail camera={camera} points={flight} endTime={t} color="#e43d37" />}
      {t >= 11.4 && t <= 17 && <Trail camera={camera} points={car} endTime={t} color="#ffcd60" />}
    </Interactive.Div>
    <Interactive.Div name="飞机 · 地面轮廓投影" style={{position: 'absolute', left: X - 99, top: Y - 96, width: 198, height: 198, opacity: planeAlpha * (1 - height * .75), translate: `${height * 72}px ${10 + height * 125}px`, scale: 1 - height * .25, filter: `brightness(0) blur(${4 + height * 22}px)`}}><Img src={staticFile('plane-c4d.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></Interactive.Div>
    <Plane name="飞机 · PVG 到三亚中央跟拍" size={200} color="#ffffff" style={{left: X - 100, top: Y - 100, opacity: planeAlpha, transform: `rotateX(${-height * 11}deg)`, transformOrigin: '50% 50%'}} />
    <Car opacity={carAlpha} />
    {t >= 7.3 && t < 11.4 && <Landmark t={t} from={7.65} until={11.25} title="埃菲尔铁塔" location="三亚湾" kind="eiffel" width={770} height={1120} />}
    {t >= 16.5 && <Landmark t={t} from={16.85} until={20.75} title="卢浮宫" location="万宁兴隆" kind="louvre" width={920} height={660} />}
    <Interactive.Div name="地图影像来源" style={{position: 'absolute', right: 14, bottom: 14, padding: '6px 9px', borderRadius: 5, backgroundColor: 'rgba(255,255,255,.82)', color: '#24313c', font: '13px Arial, sans-serif'}}>Imagery © Esri, Maxar, Earthstar Geographics, GIS User Community</Interactive.Div>
  </Interactive.Div>;
};
