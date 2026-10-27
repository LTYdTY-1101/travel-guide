import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Pin, Plane, RouteLayer} from './EditableLayers';

// Coordinates and projection match the local map generator.
const routes = {
  eurasia: {view: [62, 47, 3.1], from: [121.4737, 31.2304], to: [2.3522, 48.8566], labels: ['上海', '巴黎'], origin: 'shanghai.png', destination: 'paris.jpg'},
  'france-spain': {view: [2.26, 45.2, 6.8], from: [2.3522, 48.8566], to: [2.1734, 41.3851], labels: ['巴黎', '巴塞罗那'], origin: 'paris.jpg', destination: 'barcelona.jpg'},
  mediterranean: {view: [7.35, 41.9, 6.1], from: [2.1734, 41.3851], to: [12.4964, 41.9028], labels: ['巴塞罗那', '罗马'], origin: 'barcelona.jpg', destination: 'rome.jpg'},
} as const;

const mercator = (lon: number, lat: number, zoom: number) => {
  const size = 256 * 2 ** zoom;
  return {x: ((lon + 180) / 360) * size, y: ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * size};
};

type FlightProps = {readonly style?: React.CSSProperties; readonly region: keyof typeof routes; readonly departureZoom: number; readonly cruiseZoom: number; readonly arrivalZoom: number};
const GeographicFlightInner: React.FC<FlightProps> = ({region, departureZoom, cruiseZoom, arrivalZoom, style}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const route = routes[region];
  const center = mercator(route.view[0], route.view[1], route.view[2]);
  const project = (point: readonly [number, number]) => {
    const p = mercator(point[0], point[1], route.view[2]);
    return {x: p.x - center.x + 540, y: p.y - center.y + 960};
  };
  const start = project(route.from);
  const end = project(route.to);
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  const control = {x: (start.x + end.x) / 2 + (dy / length) * 125, y: (start.y + end.y) / 2 - (dx / length) * 125};
  const endFrame = durationInFrames - 1;
  const departEnd = .75 * fps;
  const landStart = endFrame - .8 * fps;
  const progress = interpolate(frame, [departEnd, landStart], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.4, 0, .25, 1)});
  const x = (1 - progress) ** 2 * start.x + 2 * (1 - progress) * progress * control.x + progress ** 2 * end.x;
  const y = (1 - progress) ** 2 * start.y + 2 * (1 - progress) * progress * control.y + progress ** 2 * end.y;
  // De Casteljau subdivision keeps the drawn route tip exactly under the camera.
  const partialControl = {x: start.x + (control.x - start.x) * progress, y: start.y + (control.y - start.y) * progress};
  const angle = Math.atan2((1 - progress) * (control.y - start.y) + progress * (end.y - control.y), (1 - progress) * (control.x - start.x) + progress * (end.x - control.x)) * 180 / Math.PI;
  const scale = interpolate(frame, [0, departEnd, landStart - .4 * fps, landStart, endFrame], [departureZoom, cruiseZoom, cruiseZoom, arrivalZoom, arrivalZoom * 1.2], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.4, 0, .25, 1)});
  const arrivalFade = interpolate(frame, [landStart + .2 * fps, endFrame], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <Interactive.Div name="飞行镜头" style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#c8e5ed', ...style}}>
    <Interactive.Div name="Camera · 沿航线跟随" premountFor={fps} style={{position: 'absolute', width: 1080, height: 1920, transformOrigin: '540px 960px', scale, translate: `${(540 - x) * scale}px ${(960 - y) * scale}px`}}>
      <Img src={staticFile(`maps/${region}-camera.svg`)} style={{position: 'absolute', left: -1080, top: -960, width: 3240, height: 3840}} />
      <RouteLayer name={`Route · ${route.labels.join(' → ')}`} premountFor={fps} path={`M ${start.x} ${start.y} Q ${partialControl.x} ${partialControl.y} ${x} ${y}`} progress={1} color="#ef3b32" width={12 / scale} />
      <Pin name={`Pin · ${route.labels[0]}`} premountFor={fps} label={route.labels[0]} color="#ef3b32" style={{left: start.x - 28 / scale, top: start.y - 28 / scale, scale: 1 / scale, transformOrigin: 'left top'}} />
      <Pin name={`Pin · ${route.labels[1]}`} premountFor={fps} label={route.labels[1]} color="#ef3b32" style={{left: end.x - 28 / scale, top: end.y - 28 / scale, scale: 1 / scale, transformOrigin: 'left top'}} />
      <Plane name={`Plane · ${route.labels.join(' → ')}`} premountFor={fps} color="#ffffff" style={{left: x - 43, top: y - 43, rotate: `${angle}deg`, scale: 1 / scale, transformOrigin: '43px 43px', opacity: 1 - arrivalFade}} />
    </Interactive.Div>
    <Img src={staticFile(`maps/${route.origin}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center', scale: interpolate(frame, [0, .5 * fps], [1.05, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), opacity: interpolate(frame, [0, .45 * fps], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
    <Img src={staticFile(`maps/${route.destination}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transformOrigin: 'center', opacity: arrivalFade, scale: interpolate(frame, [landStart, endFrame], [1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.4, 0, .25, 1)})}} />
    <div style={{position: 'absolute', bottom: 14, right: 14, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,.94)', color: '#425466', fontFamily: 'Arial, sans-serif', fontSize: 16, textAlign: 'right'}}>
      Map data: Natural Earth (public domain)<br />
      {region === 'eurasia' && <>© 高德地图 · GS(2018)1709号<br /></>}
      Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan<br />Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC<br />© OpenStreetMap contributors and the GIS User Community
    </div>
  </Interactive.Div>;
};

const schema = {
  region: {type: 'enum', default: 'eurasia', variants: {eurasia: {}, 'france-spain': {}, mediterranean: {}}, description: '航段'},
  departureZoom: {type: 'number', hiddenFromList: false, default: 3.1, min: 1.1, max: 5, step: .05, description: '起飞近景倍率'},
  cruiseZoom: {type: 'number', hiddenFromList: false, default: 1.25, min: 1.1, max: 2, step: .05, description: '飞行远景倍率'},
  arrivalZoom: {type: 'number', hiddenFromList: false, default: 1.8, min: 1.1, max: 3, step: .05, description: '抵达聚焦倍率'},
} as const satisfies InteractivitySchema;
export const GeographicFlight = Interactive.withSchema({Component: GeographicFlightInner, componentName: '<GeographicFlight>', schema, wrapInSequence: true});
