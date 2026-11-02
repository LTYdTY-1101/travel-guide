import {useMemo} from 'react';
import type React from 'react';
import {AbsoluteFill,Easing,Img,Interactive,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import 'maplibre-gl/dist/maplibre-gl.css';
import {buildTour,evaluateStep,OPENING_SECONDS,openingLegacySeconds,type Stop,type TourProps} from './tour-data';
import {smooth,clamp} from '../flight/flight-path';
import {useTourMap} from './use-tour-map';

const mapOpeningStyle=(seconds:number):React.CSSProperties=>{
 const legacy=openingLegacySeconds(seconds);
 const interp=(keys:number[],values:number[])=>interpolate(legacy,keys,values,{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)});
 if(seconds>=OPENING_SECONDS)return {position:'absolute',inset:0,width:1080,height:1920};
 return {position:'absolute',left:interp([3.8,4.35,6.8,7.8],[90,105,105,0]),top:interp([3.8,4.35,6.8,7.8],[685,240,240,0]),width:1080,height:1920,transformOrigin:'50% 50%',
  transform:`perspective(1450px) rotateY(${interp([3.8,4.35],[-88,0])}deg) rotateX(${interp([4.35,4.9,6.8,7.8],[0,25,25,0])}deg) scale(${interp([3.8,4.35,6.8,7.8],[900,870,870,1080])/1080},${interp([3.8,4.35,6.8,7.8],[234,1440,1440,1920])/1920})`,
  opacity:interp([3.75,3.95],[0,1]),borderRadius:interp([6.8,7.8],[44,0]),overflow:'hidden',boxShadow:'0 45px 110px rgba(56,62,104,.27)'};
};
export const modelWidth=(stop:Stop,zoom:number,scale:number)=>Math.min(1040,stop.size*2**(zoom-stop.zoom))*scale;
const Model:React.FC<{stop:Stop;x:number;y:number;zoom:number;scale:number;reveal:number;small?:boolean}>=({stop,x,y,zoom,scale,reveal,small=false})=>{
 const w=modelWidth(stop,zoom,scale),h=w/stop.aspect,x0=x+stop.offsetX,y0=y+stop.offsetY;
 const imageStyle:React.CSSProperties={position:'absolute',left:x0-w*stop.groundX,top:y0-h*stop.groundY,width:w,height:h,objectFit:'fill',transformOrigin:`${stop.groundX*100}% ${stop.groundY*100}%`};
 return <Interactive.Div name={`景观 · ${stop.name} · 底座锚定`} data-model={stop.id} data-ground-x={x0} data-ground-y={y0} style={{position:'absolute',inset:0,opacity:smooth(reveal*4),pointerEvents:'none'}}>
  <Img name={`景观 · ${stop.name} · 柔和远投影`} src={staticFile(stop.image)} style={{...imageStyle,transform:'matrix(1,0,-.35,-.16,0,0)',filter:`brightness(0) blur(${small?7:17}px)`,opacity:.10*reveal}} />
  <svg width={1080} height={1920} style={{position:'absolute',inset:0,overflow:'visible'}} aria-hidden="true">
   <ellipse cx={x0+7} cy={y0+8} rx={w*stop.groundWidth*.47} ry={w*stop.groundWidth*.12} fill="#746c60" opacity={.11} style={{filter:`blur(${small?4:12}px)`}} />
   <ellipse cx={x0} cy={y0+3} rx={w*stop.groundWidth*.39} ry={w*stop.groundWidth*.075} fill="#534d43" opacity={.18} style={{filter:`blur(${small?2:5}px)`}} />
  </svg>
  <Img name={`建筑素材 · ${stop.name}`} src={staticFile(stop.image)} style={{...imageStyle,transform:`perspective(1800px) translateY(${(1-reveal)*220}px) scale(${.38+.62*reveal}) rotateX(${-78*(1-reveal)}deg)`,filter:'saturate(.94) brightness(1.015) drop-shadow(0 8px 8px rgba(57,49,38,.15))'}} />
 </Interactive.Div>;
};

export const EuropeTourScene:React.FC<TourProps>=(props)=>{
 const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),isFull=props.section==='full',hasOpening=isFull||props.section==='paris-stage',opening=hasOpening?OPENING_SECONDS:0;
 const {stops,legs,section}=props,tour=useMemo(()=>buildTour({stops,legs,section}),[stops,legs,section]);
 const seconds=Math.max(0,Math.min(tour.seconds-.00001,frame/fps-opening));
 const step=tour.steps.find(s=>seconds<s.end)??tour.steps[tour.steps.length-1];
 const state=useMemo(()=>evaluateStep(step,seconds),[step,seconds]);
 const {container,projection:p}=useTourMap(state,props,frame,width,height);
 const closing=isFull?clamp((frame/fps-opening-tour.seconds)/.75):0;
 const openingPlane=hasOpening?smooth((openingLegacySeconds(frame/fps)-5.3)/.4):1;
 const flight=step.kind==='flight',tram=step.kind==='tram',hold=step.kind==='hold';
 const vehicleSize=flight?props.planeSize*(step.id==='pvg--cdg'?1.42-.42*smooth((state.local-.55)/1.3):1+.12*state.altitude):props.tramSize;
 const vehicleSrc=staticFile(flight?'plane-c4d.png':'tram-c4d.png'),vehicleAngle=p.angle-(tram?props.tramArtBearing:0);
 const title=flight?`${step.from.city} → ${step.to.city}`:tram?`有轨电车 · 前往${step.to.name.replace(/ [A-Z]+$/,'')}`:step.to.city;
 const dateStop=step.to.day===step.day?step.to:step.from.day===step.day?step.from:props.stops.find(s=>s.day===step.day);
 const sites=props.stops.filter(s=>!s.airport),index=Math.max(0,sites.findIndex(s=>s.id===step.to.id||s.id===step.from.id));
 const leave=step.departing?smooth((state.local-step.seconds+1.1)/.7):0;
 const labelAlpha=hold?smooth((state.local-step.to.revealDelay-.8)/.27)*(1-leave):1-smooth((state.t-.92)/.08);
 const buildingWidth=hold?modelWidth(step.to,state.zoom,state.modelScale):0;
 const labelY=hold?p.to.y+step.to.offsetY+buildingWidth/step.to.aspect*(1-step.to.groundY)+26:p.to.y+30;
 return <>
  <div data-tour-step={step.id} data-tour-kind={step.kind} data-tour-frame={frame} data-tour-ready={p.ready} data-camera-pitch={state.pitch} data-camera-bearing={state.bearing} data-camera-zoom={state.zoom} style={{...(hasOpening?mapOpeningStyle(frame/fps):{position:'absolute',inset:0,width,height}),zIndex:2}}>
   <div ref={container} style={{position:'absolute',inset:0,width,height}} />
   <div style={{position:'absolute',inset:0,backgroundColor:'#283330',opacity:state.dim}} />
   {p.ready&&<>
    {tram&&step.from.image&&state.backdropScale>.002&&<Model stop={step.from} x={p.from.x} y={p.from.y} zoom={state.zoom} scale={state.backdropScale} reveal={1} small />}
    {flight&&step.from.image&&state.local<.7&&<Model stop={step.from} x={p.from.x} y={p.from.y} zoom={state.zoom} scale={.3*(1-smooth(state.local/.7))} reveal={1} small />}
    {hold&&step.to.image&&<Model stop={step.to} x={p.to.x} y={p.to.y} zoom={state.zoom} scale={state.modelScale} reveal={state.reveal} />}
    {!hold&&<>
     <Img name="交通工具 · 接触投影" src={vehicleSrc} style={{position:'absolute',left:p.x-vehicleSize/2+(flight?8+state.altitude*45:3),top:p.y-vehicleSize/2+(flight?10+state.altitude*58:6),width:vehicleSize,height:vehicleSize,objectFit:'contain',rotate:`${vehicleAngle}deg`,filter:`brightness(0) blur(${flight?2+state.altitude*13:3}px)`,opacity:state.opacity*(flight?.3-.21*state.altitude:.22)*openingPlane}} />
     <Img name={flight?'交通工具 · 飞机':'交通工具 · 有轨电车'} src={vehicleSrc} style={{position:'absolute',left:p.x-vehicleSize/2,top:p.y-vehicleSize/2,width:vehicleSize,height:vehicleSize,objectFit:'contain',rotate:`${vehicleAngle}deg`,opacity:state.opacity*openingPlane}} />
    </>}
    {!flight&&<Interactive.Div name="目的地 · 白色圆角名称牌" style={{position:'absolute',left:hold?p.to.x+step.to.offsetX:p.to.x,top:labelY,translate:'-50% 0',padding:hold?'19px 30px':'15px 23px',borderRadius:22,backgroundColor:'rgba(255,255,255,.97)',boxShadow:'0 9px 24px rgba(38,49,40,.13)',fontFamily:'PingFang SC, Arial, sans-serif',fontSize:hold?40:30,fontWeight:650,color:'#293d43',whiteSpace:'nowrap',opacity:labelAlpha}}>{step.to.name}</Interactive.Div>}
    {hold&&<Interactive.Div name="景点 · 短字幕" style={{position:'absolute',left:70,right:70,top:labelY+104,textAlign:'center',fontFamily:'PingFang SC, Arial, sans-serif',fontSize:29,color:'#4d625f',opacity:smooth((state.local-step.to.revealDelay-1.12)/.35)*(1-leave)}}>{step.to.subtitle}</Interactive.Div>}
   </>}
   {(!hasOpening||frame>=opening*fps)&&<>
    <Interactive.Div name="交通与地点 · 信息条" style={{position:'absolute',left:48,top:66,maxWidth:980,padding:'17px 24px',backgroundColor:'rgba(255,255,255,.94)',borderRadius:21,boxShadow:'0 10px 32px rgba(40,60,60,.08)',fontFamily:'PingFang SC, Arial, sans-serif',fontSize:30,fontWeight:650,color:'#33485a'}}>{title}</Interactive.Div>
    <Interactive.Div name="行程 · 日期" style={{position:'absolute',left:52,top:150,padding:'10px 18px',borderRadius:16,color:'#5c7080',backgroundColor:'rgba(255,255,255,.9)',fontFamily:'PingFang SC, Arial, sans-serif',fontSize:26}}>{`D${step.day} · ${dateStop?.date??''}`}{tram?' · 市内移动示意':''}</Interactive.Div>
    {hold&&<div style={{position:'absolute',bottom:88,left:52,right:52,display:'flex',alignItems:'center',gap:16,opacity:labelAlpha}}><span style={{fontFamily:'Arial,sans-serif',fontSize:26,fontWeight:600,color:'#52675f',marginRight:12}}>{String(index+1).padStart(2,'0')} / {String(sites.length).padStart(2,'0')}</span>{sites.map((s,i)=><div key={s.id} style={{height:4,width:100,borderRadius:2,backgroundColor:i<=index?'#9b967c':'rgba(119,135,124,.22)'}}/>)}</div>}
   </>}
   <div style={{position:'absolute',bottom:16,right:18,padding:'8px 12px',backgroundColor:'rgba(255,255,255,.94)',color:'#59646c',fontFamily:'Arial,sans-serif',fontSize:18}}>OpenFreeMap · © OpenMapTiles · Data © OpenStreetMap contributors</div>
  </div>
  {closing>0&&<AbsoluteFill style={{zIndex:4,backgroundColor:`rgba(242,243,235,${closing*.96})`,opacity:closing,padding:82,fontFamily:'PingFang SC, Arial, sans-serif',color:'#2b403d',justifyContent:'center'}}>
   <Interactive.Div name="终章 · 六站风景" style={{fontSize:31,letterSpacing:7,color:'#7b887c',marginBottom:35}}>国庆 · 六站风景</Interactive.Div>
   <Interactive.Div name="终章 · 一路向前" style={{fontSize:88,fontWeight:750,lineHeight:1.45}}>一路向前，<br/>风景继续。</Interactive.Div>
   <div style={{width:90,height:5,backgroundColor:'#b49c74',margin:'48px 0'}} />
   <Interactive.Div name="终章 · 欧洲路线" style={{fontSize:31,lineHeight:1.9,color:'#677b70'}}>巴黎 → 巴塞罗那 → 罗马 / 梵蒂冈</Interactive.Div>
   <Interactive.Div name="终章 · 旅程日期" style={{fontSize:26,marginTop:18,color:'#879286'}}>10.01 — 10.07 · 旅程停在特莱维喷泉</Interactive.Div>
  </AbsoluteFill>}
 </>;
};
