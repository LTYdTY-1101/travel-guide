import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Pin, Plane, RouteLayer} from './EditableLayers';
import {ShanghaiParisCamera} from './ShanghaiParisCamera';

// Natural Earth geometry, in the projection used by the checked-in camera maps.
const routes = {
  eurasia: {view: [62, 47, 3.1], from: [121.4737, 31.2304], to: [2.3522, 48.8566], labels: ['上海', '巴黎'], origin: 'shanghai.png', destination: 'paris.jpg'},
  'france-spain': {view: [2.26, 45.2, 6.8], from: [2.3522, 48.8566], to: [2.1734, 41.3851], labels: ['巴黎', '巴塞罗那'], origin: 'paris.jpg', destination: 'barcelona.jpg'},
  mediterranean: {view: [7.35, 41.9, 6.1], from: [2.1734, 41.3851], to: [12.4964, 41.9028], labels: ['巴塞罗那', '罗马'], origin: 'barcelona.jpg', destination: 'rome.jpg'},
} as const;

const mercator = (lon: number, lat: number, zoom: number) => {
  const size = 256 * 2 ** zoom;
  return {x: ((lon + 180) / 360) * size, y: ((1 - Math.asinh(Math.tan((lat * Math.PI) / 180)) / Math.PI) / 2) * size};
};

type FlightProps = {readonly style?: React.CSSProperties; readonly region: keyof typeof routes; readonly departureZoom: number; readonly cruiseZoom: number; readonly arrivalZoom: number; readonly flightDuration: number; readonly planeSize: number};
const GeographicFlightInner: React.FC<FlightProps> = ({region, departureZoom, cruiseZoom, arrivalZoom, flightDuration, planeSize, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (region === 'eurasia') return <ShanghaiParisCamera planeSize={planeSize} style={style} />;
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
  const control = {x: (start.x + end.x) / 2 + (dy / length) * 100, y: (start.y + end.y) / 2 - (dx / length) * 100};
  const endFrame = flightDuration - 1;
  const takeoffEnd = Math.min(1.05 * fps, endFrame * .25);
  const landStart = endFrame - .8 * fps;
  const progress = interpolate(frame, [.18 * fps, landStart], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.36, 0, .28, 1)});
  const x = (1 - progress) ** 2 * start.x + 2 * (1 - progress) * progress * control.x + progress ** 2 * end.x;
  const y = (1 - progress) ** 2 * start.y + 2 * (1 - progress) * progress * control.y + progress ** 2 * end.y;
  const partialControl = {x: start.x + (control.x - start.x) * progress, y: start.y + (control.y - start.y) * progress};
  const angle = Math.atan2((1 - progress) * (control.y - start.y) + progress * (end.y - control.y), (1 - progress) * (control.x - start.x) + progress * (end.x - control.x)) * 180 / Math.PI + 90;
  const scale = interpolate(frame, [0, takeoffEnd, Math.max(takeoffEnd + .1 * fps, landStart - .7 * fps), landStart, endFrame], [departureZoom, departureZoom * .8, cruiseZoom, arrivalZoom, arrivalZoom * 1.23], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.3, 0, .25, 1)});
  const anchorY = interpolate(frame, [0, Math.min(1.65 * fps, landStart), landStart, endFrame], [1370, 1000, 1000, 960], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.25, 0, .3, 1)});
  const localFade = interpolate(frame, [.15 * fps, Math.min(1.1 * fps, landStart)], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const arrivalFade = interpolate(frame, [landStart + .28 * fps, endFrame], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const landingPulse = interpolate(frame, [landStart, landStart + .16 * fps, endFrame], [0.2, 1.3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});


  return (
    <Interactive.Div name="飞行镜头" style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#c8e5ed', perspective: 1700, ...style}}>
      <Interactive.Div name="Camera · 贴地起飞后拉高" premountFor={fps} style={{position: 'absolute', width: 1080, height: 1920, transformOrigin: '540px 960px', scale, translate: `${(540 - x) * scale}px ${(anchorY - y) * scale}px`, transform: `rotateX(${interpolate(frame, [0, 1.3 * fps], [18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}deg)`}}>
        <Img src={staticFile(`maps/${region}-camera.svg`)} style={{position: 'absolute', left: -1080, top: -960, width: 3240, height: 3840}} />
        <RouteLayer name={`Route · ${route.labels.join(' → ')}`} premountFor={fps} path={`M ${start.x} ${start.y} Q ${partialControl.x} ${partialControl.y} ${x} ${y}`} progress={1} color="#ef3b32" width={11 / scale} />
        <Pin name={`Pin · ${route.labels[0]}`} premountFor={fps} label={route.labels[0]} color="#ef3b32" style={{left: start.x - 28 / scale, top: start.y - 28 / scale, scale: 1 / scale, transformOrigin: 'left top', opacity: Math.max(.2, 1 - progress * 2)}} />
        <Pin name={`Pin · ${route.labels[1]}`} premountFor={fps} label={route.labels[1]} color="#ef3b32" style={{left: end.x - 28 / scale, top: end.y - 28 / scale, scale: 1 / scale, transformOrigin: 'left top', opacity: interpolate(frame, [landStart - .4 * fps, landStart], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
        <Plane name={`Plane · ${route.labels.join(' → ')}`} premountFor={fps} color="#ffffff" size={planeSize} style={{left: x - planeSize / 2, top: y - planeSize / 2, rotate: `${angle}deg`, scale: 1 / scale, transformOrigin: 'center', opacity: (1 - localFade) * (1 - arrivalFade), zIndex: 5}} />
      </Interactive.Div>
      <Img src={staticFile(`maps/${route.origin}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: localFade, scale: interpolate(frame, [0, 1.1 * fps], [1.35, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `rotateX(${interpolate(frame, [0, 1.1 * fps], [25, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}deg)`}} />
      <Plane name="Plane · 近景起飞" premountFor={fps} color="#ffffff" size={Math.round(planeSize * 1.08)} style={{left: 540 - planeSize * .54, top: interpolate(frame, [0, takeoffEnd], [1320, 1150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), rotate: `${angle}deg`, opacity: localFade}} />
      <Img src={staticFile(`maps/${route.destination}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: arrivalFade, scale: interpolate(frame, [landStart, endFrame], [1.05, 1.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.3, 0, .25, 1)})}} />
      <Pin name={`Landing · ${route.labels[1]}`} premountFor={fps} label={route.labels[1]} color="#ef3b32" style={{left: 476, top: 922, opacity: interpolate(frame, [landStart + .25 * fps, landStart + .55 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: landingPulse, transformOrigin: 'center bottom'}} />
      <Interactive.Div name="地图 · 来源标注" style={{position: 'absolute', bottom: 16, right: 16, padding: '8px 12px', borderRadius: 6, background: 'rgba(255,255,255,.88)', color: '#425466', fontFamily: 'Arial, sans-serif', fontSize: 15, textAlign: 'right', lineHeight: 1.35}}>
        Map data: Natural Earth (public domain)<br />
        Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan<br />© OpenStreetMap contributors and the GIS User Community
      </Interactive.Div>
    </Interactive.Div>
  );
};

const schema = {
  region: {type: 'enum', default: 'eurasia', variants: {eurasia: {}, 'france-spain': {}, mediterranean: {}}, description: '航段'},
  departureZoom: {type: 'number', hiddenFromList: false, default: 3.1, min: 1.1, max: 5, step: .05, description: '起飞近景倍率'},
  cruiseZoom: {type: 'number', hiddenFromList: false, default: 1.25, min: 1.1, max: 2, step: .05, description: '飞行远景倍率'},
  arrivalZoom: {type: 'number', hiddenFromList: false, default: 1.8, min: 1.1, max: 3, step: .05, description: '抵达聚焦倍率'},
  flightDuration: {type: 'number', hiddenFromList: false, default: 120, min: 60, max: 300, step: 1, description: '航段总帧数'},
  planeSize: {type: 'number', hiddenFromList: false, default: 165, min: 60, max: 400, step: 1, description: '飞机尺寸：三段航线可分别调整并设置关键帧'},
} as const satisfies InteractivitySchema;
export const GeographicFlight = Interactive.withSchema({Component: GeographicFlightInner, componentName: '<GeographicFlight>', schema, wrapInSequence: true});
