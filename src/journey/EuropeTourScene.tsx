import {useEffect,useMemo} from 'react';
import type React from 'react';
import {Img,Interactive,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import 'maplibre-gl/dist/maplibre-gl.css';
import {buildTour,evaluateStep,OPENING_SECONDS,type Stop,type TourProps} from './tour-data';
import {smooth} from '../flight/flight-path';
import {useTourMap} from './use-tour-map';
import {Tram} from './Tram';
import {TourInfoCards} from '../cards/TourInfoCards';
import {mapOpeningStyle,openingState} from '../opening/opening-state';
import {EuropeTravelPoster,POSTER_DEFAULT_HOLD_SECONDS,POSTER_ENTRY_SECONDS} from '../closing/EuropeTravelPoster';

export const modelWidth=(stop:Stop,zoom:number,scale:number)=>Math.min(1040,stop.size*2**(zoom-stop.zoom))*scale;
const Model:React.FC<{stop:Stop;x:number;y:number;zoom:number;scale:number;reveal:number;small?:boolean}>=({stop,x,y,zoom,scale,reveal,small=false})=>{
 const w=modelWidth(stop,zoom,scale),h=w/stop.aspect,x0=x+stop.offsetX,y0=y+stop.offsetY;
 const rise=stop.id==='eiffel'||stop.id==='notre-dame',fold=stop.id==='casa'||stop.id==='mila';
 const unfold=smooth((reveal-.14)/.86);
 const settled=smooth((reveal-.76)/.24);
 const modelTransform=rise?`translateY(${(1-reveal)*h*stop.groundY}px)`:fold?`perspective(1800px) rotateX(${78*(1-unfold)}deg) scaleY(${.24+.76*unfold})`:`perspective(1800px) translateY(${(1-reveal)*220}px) scale(${.38+.62*reveal}) rotateX(${-78*(1-reveal)}deg)`;
 const imageStyle:React.CSSProperties={position:'absolute',left:x0-w*stop.groundX,top:y0-h*stop.groundY,width:w,height:h,objectFit:'fill',transformOrigin:`${stop.groundX*100}% ${stop.groundY*100}%`};
 return <Interactive.Div name={`景观 · ${stop.name} · 底座锚定`} data-model={stop.id} data-model-scale={scale} data-entrance={rise?'rise':fold?'fold':'scale'} data-reveal={reveal} data-ground-x={x0} data-ground-y={y0} style={{position:'absolute',inset:0,opacity:rise?smooth(reveal):smooth(reveal*(fold?8:4)),pointerEvents:'none'}}>
  <Img name={`景观 · ${stop.name} · 阳光方向远投影`} src={staticFile(stop.image)} style={{...imageStyle,transform:`translate(${settled*26}px,${settled*34}px) matrix(1,0,-.36,-.17,0,0)`,filter:`brightness(0) blur(${small?7:17}px)`,mixBlendMode:'multiply',opacity:.03*reveal+.22*settled}} />
  <svg width={1080} height={1920} style={{position:'absolute',inset:0,overflow:'visible'}} aria-hidden="true">
   <ellipse cx={x0+7} cy={y0+8+settled*9} rx={w*stop.groundWidth*.47} ry={w*stop.groundWidth*.12} fill="#866f52" opacity={.05*reveal+.15*settled} style={{filter:`blur(${small?4:12}px)`}} />
   <ellipse cx={x0} cy={y0+3+settled*5} rx={w*stop.groundWidth*.39} ry={w*stop.groundWidth*.075} fill="#5d4933" opacity={.08*reveal+.2*settled} style={{filter:`blur(${small?2:5}px)`}} />
  </svg>
  <div style={{position:'absolute',inset:0,clipPath:rise?`inset(0 0 ${Math.max(0,1920-y0-h*(1-stop.groundY))}px 0)`:undefined}}>
   <Img name={`建筑素材 · ${stop.name}`} src={staticFile(stop.image)} style={{...imageStyle,transform:modelTransform,backfaceVisibility:'hidden',filter:`saturate(.96) brightness(${1.015+settled*.035}) drop-shadow(${-settled*4}px ${-settled*3}px ${4+settled*4}px rgba(255,244,210,${settled*.2})) drop-shadow(${settled*7}px ${8+settled*16}px ${8+settled*14}px rgba(76,54,32,${.12+settled*.22}))`}} />
  </div>
 </Interactive.Div>;
};

export const EuropeTourScene:React.FC<TourProps&{onMapReady?:(ready:boolean)=>void}>=(props)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),isFull=props.section==='full',hasOpening=isFull||props.section==='paris-stage',opening=hasOpening?OPENING_SECONDS:0;
 const {stops,legs,section}=props,tour=useMemo(()=>buildTour({stops,legs,section}),[stops,legs,section]);
 const seconds=Math.max(0,Math.min(tour.seconds-.00001,frame/fps-opening));
 const step=tour.steps.find(s=>seconds<s.end)??tour.steps[tour.steps.length-1];
 const activeCity=step.kind==='hold'?step.to.city:step.from.city;
 const openingView=openingState(frame/fps);
 const state=useMemo(()=>{
  const base=evaluateStep(step,seconds);
  if(!hasOpening||frame/fps>=OPENING_SECONDS)return base;
  return {...base,anchorY:openingView.anchorY,pitch:openingView.push*base.pitch-(1-openingView.push)*(props.cameraPitch-32)};
 },[step,seconds,frame,fps,hasOpening,openingView.anchorY,openingView.push,props.cameraPitch]);
 const {container,projection:p}=useTourMap(state,props,frame,width,height);
 const {onMapReady}=props;
 useEffect(()=>{onMapReady?.(p.ready);},[onMapReady,p.ready]);
 const openingPlane=1;
 const openingPlaneOffsetY=hasOpening&&frame/fps<OPENING_SECONDS?150*(1-openingView.push):0;
 const flight=step.kind==='flight',tram=step.kind==='tram',hold=step.kind==='hold';
 const vehicleSize=flight?props.planeSize*(step.id==='pvg--cdg'?1.08-.08*smooth((state.local-.55)/1.3):1+.12*state.altitude):props.tramSize;
 const vehicleSrc=staticFile('plane-c4d.png'),vehicleAngle=p.angle;
 return <>
  <div data-opening-map={hasOpening?true:undefined} data-opening-push={hasOpening?openingView.push:undefined} data-tour-step={step.id} data-tour-kind={step.kind} data-tour-frame={frame} data-tour-ready={p.ready} data-camera-pitch={state.pitch+props.cameraPitch-32} data-camera-bearing={state.bearing} data-camera-zoom={state.zoom} style={{...(hasOpening?mapOpeningStyle(openingView):{position:'absolute',inset:0,width,height}),visibility:hasOpening&&!p.ready?'hidden':undefined,zIndex:2}}>
   <div ref={container} style={{position:'absolute',inset:0,width,height}} />
   <div data-landmark-dim={state.dim} style={{position:'absolute',inset:0,backgroundColor:'#000',opacity:state.dim}} />
   {p.ready&&<>
    {hold&&step.to.image&&state.modelScale>0&&<Model stop={step.to} x={p.to.x} y={p.to.y} zoom={state.zoom} scale={state.modelScale} reveal={state.reveal} />}
    {tram&&<Tram x={p.x} y={p.y} size={vehicleSize} heading={state.vehicleHeading+props.tramArtBearing} cameraBearing={state.bearing} pitch={Math.max(0,Math.min(60,state.pitch+props.cameraPitch-32))} opacity={state.opacity} />}
    {flight&&<>
     <Img name="交通工具 · 接触投影" src={vehicleSrc} style={{position:'absolute',left:p.x-vehicleSize/2+8+state.altitude*45,top:p.y-vehicleSize/2+10+state.altitude*58+openingPlaneOffsetY,width:vehicleSize,height:vehicleSize,objectFit:'contain',rotate:`${vehicleAngle}deg`,filter:`brightness(0) blur(${2+state.altitude*13}px)`,opacity:state.opacity*(.3-.21*state.altitude)*openingPlane}} />
     <Img data-vehicle="plane" name="交通工具 · 飞机" src={vehicleSrc} style={{position:'absolute',left:p.x-vehicleSize/2,top:p.y-vehicleSize/2+openingPlaneOffsetY,width:vehicleSize,height:vehicleSize,objectFit:'contain',rotate:`${vehicleAngle}deg`,opacity:state.opacity*openingPlane}} />
    </>}
   </>}

   <div style={{position:'absolute',bottom:16,right:18,padding:'8px 12px',backgroundColor:'rgba(255,255,255,.94)',color:'#59646c',fontFamily:'Arial,sans-serif',fontSize:18}}>OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors</div>
  </div>
  <Sequence name="城市与景点 · 屏幕定位卡" from={Math.round((opening-tour.offset)*fps)} premountFor={fps} style={{zIndex:3}}><TourInfoCards activeCity={activeCity==='上海'?undefined:activeCity}/></Sequence>
  {isFull&&<EuropeTravelPoster name="终章 · 欧洲旅行纪念海报" from={Math.round((opening+tour.seconds)*fps)} durationInFrames={Math.round((POSTER_ENTRY_SECONDS+(props.posterHoldSeconds??POSTER_DEFAULT_HOLD_SECONDS))*fps)} premountFor={fps} entryEnabled={true} holdSeconds={props.posterHoldSeconds??POSTER_DEFAULT_HOLD_SECONDS} fireworkCount={6} fireworkFrequencySeconds={3} fireworkOpacity={1} fireworkGold="#ffd979" fireworkOrange="#ffad72" fireworkPink="#ffbdc8" fireworkSize={250} style={{zIndex:4}}/>}
 </>;
};
