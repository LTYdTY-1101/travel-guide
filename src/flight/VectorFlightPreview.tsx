import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react';
import type React from 'react';
import {AbsoluteFill, Img, Interactive, cancelRender, staticFile, useCurrentFrame, useDelayRender, useVideoConfig, type InteractivitySchema} from 'remotion';
import {Map as LibreMap, setWorkerUrl, type GeoJSONSource, type StyleSpecification} from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';
import {at, EIFFEL, flightState, makeRoute, slice, smooth, type Coordinate} from './flight-path';
import {installOpenFreeMapResources} from './openfreemap-resources';

export type FlightProps = {
  startLongitude: number; startLatitude: number; endLongitude: number; endLatitude: number;
  flightSeconds: number; takeoffZoom: number; cruiseZoom: number; arrivalZoom: number;
  planeSize: number; routeColor: string; routeWidth: number; anchorX: number; anchorY: number;
  showLabels: boolean; cameraPitch: number; style?: React.CSSProperties;
};
type Projection = {x: number; y: number; angle: number; landmarkX: number; landmarkY: number; mapReady: boolean};

const VectorFlightInner: React.FC<FlightProps> = (props) => {
  const {startLongitude, startLatitude, endLongitude, endLatitude, flightSeconds, takeoffZoom, cruiseZoom, arrivalZoom,
    planeSize, routeColor, routeWidth, anchorX, anchorY, showLabels, cameraPitch, style} = props;
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const seconds = frame / fps;
  const {delayRender, continueRender} = useDelayRender();
  const [initialHandle] = useState(() => delayRender('OpenFreeMap：初始化道路、字体和瓦片', {timeoutInMilliseconds: 120000}));
  const [map, setMap] = useState<LibreMap | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [projection, setProjection] = useState<Projection>({x: width*anchorX, y: height*anchorY, angle: 0, landmarkX: -10000, landmarkY: -10000, mapReady: false});
  const container = useRef<HTMLDivElement>(null);
  const instance = useRef<LibreMap | null>(null);
  const pendingCommit = useRef<number | null>(null);
  const route = useMemo(() => makeRoute([startLongitude,startLatitude], [endLongitude,endLatitude]), [startLongitude,startLatitude,endLongitude,endLatitude]);
  const cityRoute = useMemo(() => makeRoute([endLongitude,endLatitude], EIFFEL), [endLongitude,endLatitude]);
  const state = useMemo(() => flightState(seconds, flightSeconds, route, takeoffZoom, cruiseZoom, arrivalZoom), [seconds,flightSeconds,route,takeoffZoom,cruiseZoom,arrivalZoom]);
  const cityProgress = smooth((seconds-flightSeconds-1.5)/6);
  const target: Coordinate = useMemo(() => seconds <= flightSeconds+1.5 ? state.position : at(cityRoute, cityProgress * cityRoute.km), [seconds, flightSeconds, state.position, cityRoute, cityProgress]);
  const cityZoom = arrivalZoom + (15.5-arrivalZoom)*cityProgress - 3.8*Math.sin(Math.PI*cityProgress)**2;
  const zoom = seconds <= flightSeconds+1.5 ? state.zoom : cityZoom;
  const cityTurn = smooth((seconds-flightSeconds-1.5)/6);
  const heading = (state.heading > 180 ? state.heading - 360 : state.heading) - 12*Math.sin(Math.PI*state.u)**2;
  // Unwrapped angles preserve direction across 0/360. The city camera finishes north-up.
  const cameraBearing = heading * (1-cityTurn);
  const pitch = cameraPitch * (1 - .6*Math.sin(Math.PI*state.u)**2);
  const planeOpacity = 1-smooth((seconds-flightSeconds-.35)/.85);
  const landmarkReveal = smooth((seconds-flightSeconds-7.5)/1.0);
  const params = useRef({target, zoom, cameraBearing, pitch});
  params.current = {target, zoom, cameraBearing, pitch};
  const initialData = useRef({route, routeColor, routeWidth, startLongitude, startLatitude, endLongitude, endLatitude});

  useEffect(() => {
    if (!container.current || instance.current) return;
    let active = true;
    const fail = (e: unknown) => {
      if (!active) return;
      const message = `OpenFreeMap / MapLibre 加载失败：${e instanceof Error ? e.message : String(e)}`;
      setFailure(message);
      cancelRender(new Error(message));
    };
    fetch(staticFile('maps/openfreemap-flight.json')).then(async response => {
      if (!response.ok) throw new Error(`Style HTTP ${response.status}`);
      const mapStyle = await response.json() as StyleSpecification;
      if (!active || !container.current) return;
      setWorkerUrl(staticFile('vendor/maplibre-gl-worker.mjs'));
      installOpenFreeMapResources();
      const initial = params.current;
      const {route, routeColor, routeWidth, startLongitude, startLatitude, endLongitude, endLatitude} = initialData.current;
      const m = new LibreMap({container: container.current, style: mapStyle,
        center: initial.target, zoom: initial.zoom, bearing: initial.cameraBearing, pitch: initial.pitch,
        interactive: false, attributionControl: false, fadeDuration: 0, renderWorldCopies: false,
        canvasContextAttributes: {preserveDrawingBuffer: true, antialias: true}, pixelRatio: 1,
        transformRequest: url => ({url:url.startsWith('https://tiles.openfreemap.org/') && url.endsWith('.pbf') ? url.replace('https://','ofm://') : url}),
      });
      instance.current = m;
      m.on('error', event => {if (!(event.error instanceof Error && event.error.name === 'AbortError')) fail(event.error);});
      m.on('load', () => {
        m.addSource('flight-trail', {type: 'geojson', data: slice(route, .000001)});
        m.addLayer({id:'flight-trail-line',type:'line',source:'flight-trail',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':routeColor,'line-width':routeWidth}});
        m.addSource('airports', {type:'geojson', data:turf.featureCollection([
          turf.point([startLongitude,startLatitude],{name:'上海 · 浦东 PVG'}),
          turf.point([endLongitude,endLatitude],{name:'巴黎 · 戴高乐 CDG'}),
          turf.point(EIFFEL,{name:'埃菲尔铁塔'}),
        ])});
        m.addLayer({id:'airport-pins',type:'circle',source:'airports',paint:{'circle-radius':8,'circle-color':routeColor,'circle-stroke-color':'#fff','circle-stroke-width':4}});
        m.addLayer({id:'airport-labels',type:'symbol',source:'airports',layout:{'text-field':['get','name'],'text-font':['Noto Sans Regular'],'text-size':26,'text-offset':[0,1.2],'text-anchor':'top','text-allow-overlap':true},paint:{'text-color':'#506272','text-halo-color':'#fff','text-halo-width':3}});
        m.once('idle', () => {if(active) {setMap(m);continueRender(initialHandle);}});
        m.triggerRepaint();
      });
    }).catch(fail);
    // Avoid destroying a canvas while Remotion is capturing it. Browser contexts own its lifetime.
    return () => {active = false;};
  }, [continueRender, initialHandle]);

  useEffect(() => {
    if (!map) return;
    const handle = delayRender(`OpenFreeMap：等待第 ${frame} 帧瓦片与航迹`, {timeoutInMilliseconds: 120000});
    let finished = false;
    const finish = () => {if(!finished) {finished=true;continueRender(handle);}};
    const ready = () => {if(map.areTilesLoaded() && map.isStyleLoaded()) {if(container.current) container.current.dataset.idleFrame=String(frame);finish();}};
    map.on('idle', ready);
    // jumpTo applies an independently evaluated camera; no flyTo, timer or accumulated state.
    map.jumpTo({center:target, zoom, bearing:cameraBearing, pitch,
      padding:{left:Math.max(0,(anchorX-.5)*2*width),right:Math.max(0,(.5-anchorX)*2*width),
        top:Math.max(0,(anchorY-.5)*2*height),bottom:Math.max(0,(.5-anchorY)*2*height)}});
    (map.getSource('flight-trail') as GeoJSONSource).setData(slice(route, state.km));
    map.setPaintProperty('flight-trail-line','line-opacity',1-smooth((seconds-flightSeconds-.5)/1));
    const p = map.project(state.position);
    const a = map.project(at(route, state.km-.02));
    const b = map.project(at(route, state.km+.02));
    const landmark = map.project(EIFFEL);
    const angle = Math.atan2(b.x-a.x, -(b.y-a.y))*180/Math.PI;
    pendingCommit.current = delayRender('提交飞机与地图同一帧投影');
    setProjection({x:p.x,y:p.y,angle,landmarkX:landmark.x,landmarkY:landmark.y,mapReady:true});
    map.triggerRepaint();
    return () => {map.off('idle',ready);finish();};
  }, [map, frame, fps, seconds, width, height, target, zoom, cameraBearing, pitch, anchorX, anchorY, route, state.km, flightSeconds, continueRender, delayRender, state.position]);

  useEffect(() => {
    if(!map) return;
    (map.getSource('airports') as GeoJSONSource).setData(turf.featureCollection([
      turf.point([startLongitude,startLatitude],{name:'上海 · 浦东 PVG'}),
      turf.point([endLongitude,endLatitude],{name:'巴黎 · 戴高乐 CDG'}),
      turf.point(EIFFEL,{name:'埃菲尔铁塔'}),
    ]));
    map.setPaintProperty('flight-trail-line','line-color',routeColor);
    map.setPaintProperty('flight-trail-line','line-width',routeWidth);
    for(const layer of map.getStyle().layers) {
      if(layer.type==='symbol') map.setLayoutProperty(layer.id,'visibility',showLabels?'visible':'none');
    }
  }, [map,routeColor,routeWidth,showLabels,startLongitude,startLatitude,endLongitude,endLatitude]);

  useLayoutEffect(() => {
    if(pendingCommit.current!==null) {continueRender(pendingCommit.current);pendingCommit.current=null;}
  }, [projection,continueRender]);

  const size = planeSize*(1+.12*state.altitude);
  return <AbsoluteFill data-flight-preview-frame={frame} data-map-ready={projection.mapReady} data-plane-x={projection.x} data-plane-y={projection.y} data-plane-angle={projection.angle} style={{backgroundColor:'#f4f0e7',overflow:'hidden',...style}}>
    <div ref={container} style={{position:'absolute',inset:0,width,height}} />
    {projection.mapReady && <>
      <Img name="飞行 · 高度投影" src={staticFile('plane-c4d.png')} style={{position:'absolute',left:projection.x-size/2+8+state.altitude*45,top:projection.y-size/2+10+state.altitude*58,width:size,height:size,objectFit:'contain',rotate:`${projection.angle}deg`,filter:`brightness(0) blur(${2+state.altitude*13}px)`,opacity:planeOpacity*(.3-.21*state.altitude)}} />
      <Img name="飞行 · 现有飞机素材" src={staticFile('plane-c4d.png')} style={{position:'absolute',left:projection.x-size/2,top:projection.y-size/2,width:size,height:size,objectFit:'contain',rotate:`${projection.angle}deg`,opacity:planeOpacity}} />
      {landmarkReveal>0 && <div style={{position:'absolute',left:projection.landmarkX-340,top:projection.landmarkY-620,width:680,height:640,transformOrigin:'50% 100%',transform:`perspective(1400px) rotateX(${-75*(1-landmarkReveal)}deg)`,opacity:landmarkReveal}}>
        <Img name="巴黎 · 埃菲尔铁塔景观" src={staticFile('landmarks/dioramas/eiffel.png')} style={{width:'100%',height:'100%',objectFit:'contain'}} />
      </div>}
    </>}
    <Interactive.Div name="飞行 · 阶段标签" style={{position:'absolute',left:58,top:75,padding:'18px 25px',borderRadius:22,backgroundColor:'rgba(255,255,255,.9)',fontFamily:'PingFang SC, Arial, sans-serif',fontSize:29,color:'#506272'}}>
      {seconds < flightSeconds ? '上海 PVG → 巴黎 CDG' : seconds < flightSeconds+1.5 ? '抵达 · 巴黎戴高乐机场' : seconds < flightSeconds+7.5 ? '地面衔接 · 机场 → 巴黎市区' : '巴黎 · 埃菲尔铁塔'}
    </Interactive.Div>
    <div style={{position:'absolute',bottom:16,right:18,padding:'8px 12px',backgroundColor:'rgba(255,255,255,.94)',color:'#59646c',fontFamily:'Arial, sans-serif',fontSize:18}}>OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors</div>
    {failure && <AbsoluteFill style={{backgroundColor:'#fff2f2',color:'#9c1717',padding:70,fontSize:32}}>{failure}</AbsoluteFill>}
  </AbsoluteFill>;
};

const schema = {
  startLongitude:{type:'number',hiddenFromList:false,default:121.8183,min:-180,max:180,step:.0001,description:'起点经度 · 浦东机场'},
  startLatitude:{type:'number',hiddenFromList:false,default:31.1303,min:-80,max:80,step:.0001,description:'起点纬度'},
  endLongitude:{type:'number',hiddenFromList:false,default:2.555,min:-180,max:180,step:.0001,description:'终点经度 · 戴高乐机场'},
  endLatitude:{type:'number',hiddenFromList:false,default:49.0097,min:-80,max:80,step:.0001,description:'终点纬度'},
  flightSeconds:{type:'number',hiddenFromList:false,default:22,min:12,max:60,step:1,description:'飞行时长（另加 10 秒巴黎衔接）'},
  takeoffZoom:{type:'number',hiddenFromList:false,default:15,min:12,max:17,step:.1,description:'起飞缩放'},
  cruiseZoom:{type:'number',hiddenFromList:false,default:3.4,min:2,max:6,step:.1,description:'巡航缩放'},
  arrivalZoom:{type:'number',hiddenFromList:false,default:14.5,min:12,max:17,step:.1,description:'抵达缩放'},
  planeSize:{type:'number',hiddenFromList:false,default:170,min:60,max:360,step:1,description:'飞机尺寸（屏幕像素）'},
  routeColor:{type:'color',default:'#378bb5',description:'蓝色实线航迹'},
  routeWidth:{type:'number',hiddenFromList:false,default:8,min:2,max:24,step:1,description:'航迹宽度（屏幕像素）'},
  anchorX:{type:'number',hiddenFromList:false,default:.5,min:.25,max:.75,step:.01,description:'飞机水平位置（画面比例）'},
  anchorY:{type:'number',hiddenFromList:false,default:.57,min:.35,max:.75,step:.01,description:'飞机垂直位置（画面比例）'},
  showLabels:{type:'boolean',default:true,description:'显示城市和机场地名'},
  cameraPitch:{type:'number',hiddenFromList:false,default:18,min:0,max:45,step:1,description:'相机俯仰（度）'},
} as const satisfies InteractivitySchema;
export const VectorFlightPreview = Interactive.withSchema({Component:VectorFlightInner,componentName:'<VectorFlightPreview>',schema,wrapInSequence:true});
