import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {cancelRender,staticFile,useBufferState,useDelayRender} from 'remotion';
import {Map as LibreMap,setWorkerUrl,type GeoJSONSource,type StyleSpecification} from 'maplibre-gl';
import * as turf from '@turf/turf';
import {installOpenFreeMapResources} from '../flight/openfreemap-resources';
import {coord,type TourProps,type TourState} from './tour-data';

export const useTourMap=(state:TourState,props:TourProps,frame:number,width:number,height:number)=>{
 const container=useRef<HTMLDivElement>(null),instance=useRef<LibreMap|null>(null);
 const {delayRender,continueRender}=useDelayRender();
 const {delayPlayback}=useBufferState();
 const openingMap=props.section==='full'||props.section==='paris-stage';
 const [initialHandle]=useState(()=>delayRender('欧洲旅程：等待 OpenFreeMap 初始化',{timeoutInMilliseconds:120000}));
 const [map,setMap]=useState<LibreMap|null>(null);
 const [projection,setProjection]=useState({ready:false,x:width/2,y:height*props.anchorY,angle:0,from:{x:0,y:0},to:{x:0,y:0}});
 const commit=useRef<number|null>(null),latest=useRef({state,props});latest.current={state,props};
 useEffect(()=>{
  if(!container.current||instance.current)return;
  let active=true;
  const initialPlayback=openingMap?delayPlayback():null;
  const fail=(error:unknown)=>{if(active)cancelRender(new Error(`欧洲地图资源加载失败：${String(error)}`));};
  Promise.all([
   fetch(staticFile('maps/openfreemap-flight.json')),
   openingMap?fetch(staticFile('maps/opening-cache/resources.json')).then(r=>r.ok?r.json():null):Promise.resolve(null),
  ]).then(async([response,cache])=>{
   if(!response.ok)throw new Error(`Map style HTTP ${response.status}`);
   const style=await response.json() as StyleSpecification;
   if(!active||!container.current)return;
   setWorkerUrl(staticFile('vendor/maplibre-gl-worker.mjs'));installOpenFreeMapResources();
   const {state:s,props:p}=latest.current;
   const m=new LibreMap({container:container.current,style,center:s.target,zoom:s.zoom,bearing:s.bearing,pitch:Math.max(0,Math.min(60,s.pitch+p.cameraPitch-32)),
    interactive:false,attributionControl:false,fadeDuration:0,renderWorldCopies:false,pixelRatio:1,
    canvasContextAttributes:{preserveDrawingBuffer:true,antialias:true},
    transformRequest:url=>({url:cache?.resources?.[decodeURI(url)]?staticFile(cache.resources[decodeURI(url)]):url.startsWith('https://tiles.openfreemap.org/')&&url.endsWith('.pbf')?url.replace('https://','ofm://'):url})});
   instance.current=m;m.on('error',e=>{if(!(e.error instanceof Error&&e.error.name==='AbortError'))fail(e.error);});
   m.on('load',()=>{
    m.addSource('tour-travelled',{type:'geojson',data:s.line});m.addSource('tour-ahead',{type:'geojson',data:s.ahead});
    m.addSource('tour-destination',{type:'geojson',data:turf.point(coord(s.step.to))});
    m.addLayer({id:'tour-ahead-line',type:'line',source:'tour-ahead',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':p.groundColor,'line-width':p.routeWidth+2,'line-dasharray':[1,1.4]}});
    m.addLayer({id:'tour-passed-line',type:'line',source:'tour-travelled',layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':p.flightColor,'line-width':p.routeWidth}});
    m.addLayer({id:'tour-destination-dot',type:'circle',source:'tour-destination',paint:{'circle-color':p.groundColor,'circle-radius':8,'circle-stroke-color':'white','circle-stroke-width':4}});
    m.once('idle',()=>{if(active){setMap(m);continueRender(initialHandle);initialPlayback?.unblock();}});m.triggerRepaint();
   });
  }).catch(fail);
  // Same canvas lifecycle as the validated standalone preview: no removal during capture.
  return()=>{active=false;initialPlayback?.unblock();};
 },[initialHandle,continueRender,openingMap,delayPlayback]);
 useLayoutEffect(()=>{
  if(!map)return;
  const playback=openingMap&&state.step.id==='pvg--cdg'?delayPlayback():null;
  const handle=delayRender(`欧洲地图：第 ${frame} 帧瓦片、路径与投影`,{timeoutInMilliseconds:120000});let done=false;
  const finish=()=>{if(!done){done=true;continueRender(handle);playback?.unblock();}};
  const ready=()=>{if(map.areTilesLoaded()&&map.isStyleLoaded()){if(container.current)container.current.dataset.tourIdleFrame=String(frame);finish();}};
  map.on('idle',ready);
  const anchor=state.anchorY+props.anchorY-.57;
  map.jumpTo({center:state.target,zoom:state.zoom,bearing:state.bearing,pitch:Math.max(0,Math.min(60,state.pitch+props.cameraPitch-32)),
   padding:{top:Math.max(0,(anchor-.5)*2*height),bottom:Math.max(0,(.5-anchor)*2*height),left:0,right:0}});
  (map.getSource('tour-travelled') as GeoJSONSource).setData(state.line);
  (map.getSource('tour-ahead') as GeoJSONSource).setData(state.ahead);
  (map.getSource('tour-destination') as GeoJSONSource).setData(turf.point(coord(state.step.to)));
  map.setPaintProperty('tour-passed-line','line-opacity',state.step.kind==='hold'?0:state.step.kind==='flight'?state.opacity:1);
  map.setPaintProperty('tour-ahead-line','line-opacity',state.step.kind==='tram'?.32:0);
  map.setPaintProperty('tour-ahead-line','line-color',props.groundColor);
  map.setPaintProperty('tour-passed-line','line-color',state.step.kind==='flight'?props.flightColor:props.groundColor);
  map.setPaintProperty('tour-destination-dot','circle-color',props.groundColor);
  map.setPaintProperty('tour-destination-dot','circle-opacity',state.step.kind==='flight'?0:1);
  map.setPaintProperty('tour-destination-dot','circle-stroke-opacity',state.step.kind==='flight'?0:1);
  const p=map.project(state.position),a=map.project(state.tangentBefore),b=map.project(state.tangentAfter);
  const from=map.project(coord(state.step.from)),to=map.project(coord(state.step.to));
  commit.current=delayRender('提交电车 / 飞机 / 建筑同一帧投影');
  setProjection({ready:true,x:p.x,y:p.y,angle:Math.atan2(b.x-a.x,-(b.y-a.y))*180/Math.PI,from:{x:from.x,y:from.y},to:{x:to.x,y:to.y}});
  map.triggerRepaint();return()=>{map.off('idle',ready);finish();};
 },[map,state,frame,width,height,props.anchorY,props.cameraPitch,props.flightColor,props.groundColor,continueRender,delayRender,openingMap,delayPlayback]);
 useEffect(()=>{
  if(!map)return;
  map.setPaintProperty('tour-passed-line','line-width',props.routeWidth);map.setPaintProperty('tour-ahead-line','line-width',props.routeWidth+2);
  for(const l of map.getStyle().layers)if(l.type==='symbol')map.setLayoutProperty(l.id,'visibility',props.showLabels?'visible':'none');
 },[map,props.routeWidth,props.showLabels]);
 useLayoutEffect(()=>{if(commit.current!==null){continueRender(commit.current);commit.current=null;}},[projection,continueRender]);
 return {container,projection};
};
