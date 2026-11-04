import type React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from 'remotion';

export const POSTER_ENTRY_SECONDS=3.6;
export const POSTER_DEFAULT_HOLD_SECONDS=12;

type PosterRootProps={
  readonly entryEnabled:boolean;
  readonly holdSeconds:number;
  readonly fireworkCount:number;
  readonly fireworkFrequencySeconds:number;
  readonly fireworkOpacity:number;
  readonly fireworkGold:string;
  readonly fireworkOrange:string;
  readonly fireworkPink:string;
  readonly fireworkSize:number;
  readonly style?:React.CSSProperties;
};

type EntryProps={
  readonly entryEnabled:boolean;
  readonly entryDelaySeconds:number;
  readonly entryDurationSeconds:number;
};

const entryProgress=(frame:number,fps:number,enabled:boolean,delay:number,duration:number)=>enabled?interpolate(
  frame,
  [delay*fps,(delay+duration)*fps],
  [0,1],
  {extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)},
):1;

type PosterBackgroundProps=EntryProps&{
  readonly src:string;
  readonly topColor:string;
  readonly middleColor:string;
  readonly bottomColor:string;
  readonly mapOpacity:number;
  readonly cloudOpacity:number;
  readonly borderColor:string;
  readonly borderWidth:number;
  readonly borderRadius:number;
  readonly style?:React.CSSProperties;
};

const PosterBackgroundInner:React.FC<PosterBackgroundProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=entryProgress(frame,fps,p.entryEnabled,p.entryDelaySeconds,p.entryDurationSeconds);
  return <Interactive.Div data-poster-background style={{position:'absolute',inset:0,overflow:'hidden',...p.style}}>
    <div style={{position:'absolute',inset:0,opacity:progress,background:`linear-gradient(180deg,${p.topColor} 0%,${p.middleColor} 52%,${p.bottomColor} 100%)`}}>
      <Img name="终章背景 · 低对比欧洲地图" src={p.src} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',opacity:p.mapOpacity,filter:'saturate(.72) brightness(1.08) contrast(.88)'}}/>
      <div style={{position:'absolute',left:-150,top:130,width:570,height:310,borderRadius:'50%',background:'rgba(255,255,255,.72)',filter:'blur(46px)',opacity:p.cloudOpacity}}/>
      <div style={{position:'absolute',right:-170,top:430,width:600,height:350,borderRadius:'50%',background:'rgba(255,255,255,.66)',filter:'blur(54px)',opacity:p.cloudOpacity*.9}}/>
      <div style={{position:'absolute',left:100,top:1040,width:850,height:420,borderRadius:'50%',background:'rgba(238,248,230,.7)',filter:'blur(70px)',opacity:p.cloudOpacity*.72}}/>
      <div style={{position:'absolute',inset:22,border:`${p.borderWidth}px solid ${p.borderColor}`,borderRadius:p.borderRadius,boxShadow:'inset 0 0 48px rgba(255,255,255,.32)',pointerEvents:'none'}}/>
    </div>
  </Interactive.Div>;
};

const posterBackgroundSchema={
  src:{type:'asset',assetType:'image',default:'',description:'欧洲地图背景'},
  topColor:{type:'color',default:'#cfeaff',description:'顶部浅天蓝'},
  middleColor:{type:'color',default:'#fffdf3',description:'中部奶白'},
  bottomColor:{type:'color',default:'#dcefd7',description:'底部浅绿色'},
  mapOpacity:{type:'number',min:0,max:1,step:.01,default:.22,hiddenFromList:false,description:'地图透明度'},
  cloudOpacity:{type:'number',min:0,max:1,step:.01,default:.62,hiddenFromList:false,description:'云雾透明度'},
  borderColor:{type:'color',default:'rgba(255,255,255,.86)',description:'外边框颜色'},
  borderWidth:{type:'number',min:0,max:16,step:1,default:4,hiddenFromList:false,description:'外边框宽度'},
  borderRadius:{type:'number',min:0,max:60,step:1,default:24,hiddenFromList:false,description:'外边框圆角'},
  entryEnabled:{type:'boolean',default:true,description:'播放背景入场'},
  entryDelaySeconds:{type:'number',min:0,max:6,step:.05,default:0,hiddenFromList:false,description:'入场延迟（秒）'},
  entryDurationSeconds:{type:'number',min:.1,max:3,step:.05,default:.55,hiddenFromList:false,description:'入场时长（秒）'},
} as const satisfies InteractivitySchema;

export const PosterBackground=Interactive.withSchema({Component:PosterBackgroundInner,componentName:'<PosterBackground>',schema:posterBackgroundSchema,wrapInSequence:true});

type PosterTitleProps=EntryProps&{
  readonly line1:string;
  readonly line2:string;
  readonly subtitle:string;
  readonly fontFamily:string;
  readonly fontSize:number;
  readonly fontWeight:number;
  readonly color:string;
  readonly strokeColor:string;
  readonly strokeWidth:number;
  readonly shadow:string;
  readonly subtitleColor:string;
  readonly subtitleSize:number;
  readonly style?:React.CSSProperties;
};

const PosterTitleInner:React.FC<PosterTitleProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=entryProgress(frame,fps,p.entryEnabled,p.entryDelaySeconds,p.entryDurationSeconds);
  return <Interactive.Div data-poster-title style={{position:'absolute',left:80,top:70,width:920,textAlign:'center',...p.style}}>
    <div style={{opacity:progress,translate:`0 ${interpolate(progress,[0,1],[-46,0])}px`,scale:interpolate(progress,[0,1],[.93,1])}}>
      <div style={{fontFamily:p.fontFamily,fontSize:p.fontSize,fontWeight:p.fontWeight,lineHeight:.92,letterSpacing:-5,color:p.color,fontStyle:'italic',WebkitTextStroke:`${p.strokeWidth}px ${p.strokeColor}`,paintOrder:'stroke fill',textShadow:p.shadow}}>{p.line1}</div>
      <div style={{fontFamily:p.fontFamily,fontSize:p.fontSize,fontWeight:p.fontWeight,lineHeight:.98,letterSpacing:-5,color:p.color,fontStyle:'italic',WebkitTextStroke:`${p.strokeWidth}px ${p.strokeColor}`,paintOrder:'stroke fill',textShadow:p.shadow}}>{p.line2}</div>
      <div style={{marginTop:24,fontFamily:'Arial, sans-serif',fontSize:p.subtitleSize,fontWeight:800,letterSpacing:6,color:p.subtitleColor}}>{p.subtitle}</div>
    </div>
  </Interactive.Div>;
};

const posterTitleSchema={
  line1:{type:'text-content',default:'',description:'第一行中文标题'},
  line2:{type:'text-content',default:'',description:'第二行中文标题'},
  subtitle:{type:'text-content',default:'',description:'英文副标题'},
  fontFamily:{type:'font-family',default:'Arial Black, PingFang SC, sans-serif',description:'中文标题字体'},
  fontSize:{type:'number',min:48,max:170,step:1,default:112,hiddenFromList:false,description:'中文标题字号'},
  fontWeight:{type:'font-weight',default:900,description:'中文标题字重'},
  color:{type:'color',default:'#092f66',description:'中文标题颜色'},
  strokeColor:{type:'color',default:'#ffffff',description:'中文标题描边'},
  strokeWidth:{type:'number',min:0,max:12,step:.5,default:4,hiddenFromList:false,description:'中文标题描边宽度'},
  shadow:{type:'text-content',default:'0 13px 24px rgba(36,74,114,.22)',description:'中文标题阴影'},
  subtitleColor:{type:'color',default:'#315678',description:'英文副标题颜色'},
  subtitleSize:{type:'number',min:16,max:64,step:1,default:29,hiddenFromList:false,description:'英文副标题字号'},
  entryEnabled:{type:'boolean',default:true,description:'播放标题入场'},
  entryDelaySeconds:{type:'number',min:0,max:6,step:.05,default:.3,hiddenFromList:false,description:'入场延迟（秒）'},
  entryDurationSeconds:{type:'number',min:.1,max:3,step:.05,default:.85,hiddenFromList:false,description:'入场时长（秒）'},
  ...Interactive.textSchema,
} as const satisfies InteractivitySchema;

export const PosterTitle=Interactive.withSchema({Component:PosterTitleInner,componentName:'<PosterTitle>',schema:posterTitleSchema,wrapInSequence:true});

type PosterCardProps=EntryProps&{
  readonly label:string;
  readonly region:string;
  readonly src:string;
  readonly accentColor:string;
  readonly labelColor:string;
  readonly skyColor:string;
  readonly groundColor:string;
  readonly cardColor:string;
  readonly borderColor:string;
  readonly borderWidth:number;
  readonly radius:number;
  readonly shadow:string;
  readonly imageScale:number;
  readonly imageOffsetX:number;
  readonly imageOffsetY:number;
  readonly style?:React.CSSProperties;
};

const PinIcon:React.FC<{color:string}>=({color})=><svg width="25" height="31" viewBox="0 0 25 31" aria-hidden="true"><path d="M12.5 1.5C6.45 1.5 1.6 6.2 1.6 12.1c0 7.4 10.9 17.4 10.9 17.4s10.9-10 10.9-17.4c0-5.9-4.85-10.6-10.9-10.6Z" fill={color}/><circle cx="12.5" cy="11.8" r="4.3" fill="#fff"/></svg>;

const PosterCardInner:React.FC<PosterCardProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=entryProgress(frame,fps,p.entryEnabled,p.entryDelaySeconds,p.entryDurationSeconds);
  return <Interactive.Div data-poster-card={p.label} style={{position:'absolute',width:440,height:228,...p.style}}>
    <div style={{position:'absolute',inset:0,overflow:'hidden',borderRadius:p.radius,border:`${p.borderWidth}px solid ${p.borderColor}`,backgroundColor:p.cardColor,boxShadow:p.shadow,opacity:progress,translate:`0 ${interpolate(progress,[0,1],[48,0])}px`,scale:interpolate(progress,[0,1],[.92,1])}}>
      <div style={{position:'absolute',inset:0,background:`linear-gradient(180deg,${p.skyColor} 0%,rgba(255,255,255,.86) 72%,${p.groundColor} 100%)`}}/>
      <div style={{position:'absolute',left:32,top:60,width:115,height:48,borderRadius:'50%',background:'rgba(255,255,255,.56)',filter:'blur(12px)'}}/>
      <div style={{position:'absolute',right:28,top:48,width:132,height:58,borderRadius:'50%',background:'rgba(255,255,255,.48)',filter:'blur(14px)'}}/>
      <div style={{position:'absolute',left:-20,right:-20,bottom:-38,height:92,borderRadius:'50% 50% 0 0',background:p.groundColor,opacity:.72}}/>
      <Img name={`终章卡片景观 · ${p.label}`} src={p.src} style={{position:'absolute',left:`${p.imageOffsetX}%`,top:`${p.imageOffsetY}%`,width:`${p.imageScale}%`,height:`${p.imageScale}%`,objectFit:'contain',objectPosition:'center bottom',filter:'drop-shadow(0 9px 8px rgba(53,68,74,.2))'}}/>
      <div style={{position:'absolute',left:15,top:12,display:'flex',alignItems:'center',gap:8,padding:'7px 14px 7px 10px',borderRadius:18,background:'rgba(255,255,255,.9)',boxShadow:'0 7px 17px rgba(54,75,96,.12)'}}>
        <PinIcon color={p.accentColor}/><span style={{fontFamily:'PingFang SC, Arial, sans-serif',fontSize:24,fontWeight:850,color:p.labelColor,whiteSpace:'nowrap'}}>{p.label}</span>
      </div>
      <div style={{position:'absolute',right:16,top:18,fontFamily:'Arial, PingFang SC, sans-serif',fontSize:14,fontWeight:750,letterSpacing:1.4,color:'#64819b'}}>{p.region}</div>
    </div>
  </Interactive.Div>;
};

const posterCardSchema={
  label:{type:'text-content',default:'',description:'景点名称'},
  region:{type:'text-content',default:'',description:'城市 / 国家'},
  src:{type:'asset',assetType:'image',default:'',description:'卡片景点素材'},
  accentColor:{type:'color',default:'#ef3f45',description:'定位图标颜色'},
  labelColor:{type:'color',default:'#143b68',description:'景点名称颜色'},
  skyColor:{type:'color',default:'#bfe1fb',description:'卡片天空颜色'},
  groundColor:{type:'color',default:'#bcdcae',description:'卡片地面颜色'},
  cardColor:{type:'color',default:'#ffffff',description:'卡片背景颜色'},
  borderColor:{type:'color',default:'rgba(255,255,255,.96)',description:'卡片边框颜色'},
  borderWidth:{type:'number',min:0,max:14,step:1,default:6,hiddenFromList:false,description:'卡片边框宽度'},
  radius:{type:'number',min:0,max:48,step:1,default:24,hiddenFromList:false,description:'卡片圆角'},
  shadow:{type:'text-content',default:'0 18px 42px rgba(45,77,108,.2)',description:'卡片阴影'},
  imageScale:{type:'number',min:45,max:130,step:1,default:88,hiddenFromList:false,description:'卡内景观尺寸（%）'},
  imageOffsetX:{type:'number',min:-40,max:55,step:1,default:6,hiddenFromList:false,description:'卡内景观横向位置（%）'},
  imageOffsetY:{type:'number',min:-30,max:60,step:1,default:12,hiddenFromList:false,description:'卡内景观纵向位置（%）'},
  entryEnabled:{type:'boolean',default:true,description:'播放卡片入场'},
  entryDelaySeconds:{type:'number',min:0,max:6,step:.05,default:1,hiddenFromList:false,description:'入场延迟（秒）'},
  entryDurationSeconds:{type:'number',min:.1,max:3,step:.05,default:.62,hiddenFromList:false,description:'入场时长（秒）'},
  ...Interactive.borderRadiusSchema,
} as const satisfies InteractivitySchema;

export const PosterCard=Interactive.withSchema({Component:PosterCardInner,componentName:'<PosterCard>',schema:posterCardSchema,wrapInSequence:true});

type PosterGroundProps=EntryProps&{
  readonly groundColor:string;
  readonly grassColor:string;
  readonly waterColor:string;
  readonly shadowColor:string;
  readonly style?:React.CSSProperties;
};

const PosterGroundInner:React.FC<PosterGroundProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=entryProgress(frame,fps,p.entryEnabled,p.entryDelaySeconds,p.entryDurationSeconds);
  return <Interactive.Div data-poster-ground style={{position:'absolute',left:20,top:1330,width:1040,height:570,opacity:progress,...p.style}}>
    <div style={{position:'absolute',left:-20,top:15,width:1080,height:510,borderRadius:'48% 52% 12% 12%',background:`radial-gradient(ellipse at 50% 62%,rgba(255,253,243,.96) 0%,${p.groundColor} 53%,rgba(255,255,255,0) 79%)`,filter:'blur(4px)'}}/>
    <div style={{position:'absolute',left:75,top:120,width:890,height:190,borderRadius:'50%',background:'rgba(255,255,255,.58)',filter:'blur(34px)'}}/>
    <div style={{position:'absolute',left:35,top:190,width:970,height:280,borderRadius:'50%',background:p.groundColor,boxShadow:`0 35px 60px ${p.shadowColor}`}}/>
    <div style={{position:'absolute',left:180,top:395,width:700,height:155,borderRadius:'50%',background:`linear-gradient(180deg,rgba(255,255,255,.78),${p.waterColor})`,border:'7px solid rgba(255,255,255,.72)',boxShadow:'inset 0 12px 25px rgba(255,255,255,.56)'}}/>
    {[[55,320,70],[145,245,55],[875,260,66],[960,335,54],[260,360,44],[780,355,48]].map(([left,top,size],i)=><div key={i} style={{position:'absolute',left,top,width:size,height:size,borderRadius:'50%',background:p.grassColor,boxShadow:'inset -10px -12px 18px rgba(30,83,43,.18),0 8px 15px rgba(53,86,59,.18)'}}/>)}
  </Interactive.Div>;
};

const posterGroundSchema={
  groundColor:{type:'color',default:'#d7e6c3',description:'建筑地面颜色'},
  grassColor:{type:'color',default:'#79a866',description:'绿植颜色'},
  waterColor:{type:'color',default:'#9bd9df',description:'水面颜色'},
  shadowColor:{type:'color',default:'rgba(63,83,91,.2)',description:'地面阴影颜色'},
  entryEnabled:{type:'boolean',default:true,description:'播放地景入场'},
  entryDelaySeconds:{type:'number',min:0,max:6,step:.05,default:1.9,hiddenFromList:false,description:'入场延迟（秒）'},
  entryDurationSeconds:{type:'number',min:.1,max:3,step:.05,default:1,hiddenFromList:false,description:'入场时长（秒）'},
} as const satisfies InteractivitySchema;

export const PosterGround=Interactive.withSchema({Component:PosterGroundInner,componentName:'<PosterGround>',schema:posterGroundSchema,wrapInSequence:true});

type PosterForegroundProps=EntryProps&{
  readonly grassDark:string;
  readonly grassLight:string;
  readonly bankColor:string;
  readonly waterColor:string;
  readonly style?:React.CSSProperties;
};

const PosterForegroundInner:React.FC<PosterForegroundProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=entryProgress(frame,fps,p.entryEnabled,p.entryDelaySeconds,p.entryDurationSeconds);
  const shrubs=[
    [8,1688,112],[58,1760,146],[154,1816,102],[248,1792,78],
    [735,1810,84],[812,1776,118],[905,1715,142],[995,1658,112],
    [322,1840,64],[672,1842,70],
  ] as const;
  return <Interactive.Div data-poster-foreground style={{position:'absolute',inset:0,opacity:progress,pointerEvents:'none',...p.style}}>
    <div style={{position:'absolute',left:-45,top:1645,width:1170,height:270,borderRadius:'48% 52% 0 0',background:`radial-gradient(ellipse at 50% 96%,${p.bankColor} 0%,rgba(231,239,211,.88) 42%,rgba(255,255,255,0) 76%)`,filter:'blur(5px)'}}/>
    <div style={{position:'absolute',left:116,top:1766,width:850,height:178,borderRadius:'50% 50% 8% 8%',background:`linear-gradient(180deg,rgba(255,255,255,.92) 0%,${p.waterColor} 35%,rgba(89,176,195,.72) 100%)`,border:'8px solid rgba(255,255,255,.76)',boxShadow:'inset 0 14px 24px rgba(255,255,255,.65),0 -9px 20px rgba(78,111,78,.15)'}}/>
    <div style={{position:'absolute',left:183,top:1742,width:714,height:70,borderRadius:'50%',borderTop:`18px solid ${p.bankColor}`,borderBottom:'7px solid rgba(255,255,255,.7)',boxShadow:'0 13px 18px rgba(71,92,72,.14)'}}/>
    <div style={{position:'absolute',left:230,top:1810,width:620,height:35,borderRadius:'50%',borderTop:'7px solid rgba(255,255,255,.88)',opacity:.82}}/>
    {shrubs.map(([left,top,size],i)=><div key={i} style={{position:'absolute',left,top,width:size,height:size*.72,filter:'drop-shadow(0 8px 9px rgba(53,86,59,.23))',rotate:`${i%2===0?-5:6}deg`}}>
      {[[-3,36,55],[18,18,58],[43,5,54],[62,30,49],[27,40,62]].map(([x,y,s],j)=><div key={j} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:`${s}%`,aspectRatio:'1',borderRadius:'50%',background:`radial-gradient(circle at 31% 26%,${p.grassLight} 0%,#8fbd71 31%,${p.grassDark} 72%,#3f7350 100%)`,boxShadow:'inset -6px -7px 10px rgba(35,80,45,.16)'}}/>)}
    </div>)}
    <div style={{position:'absolute',left:0,right:0,bottom:-8,height:66,background:`linear-gradient(180deg,rgba(79,124,77,0),${p.grassDark})`,filter:'blur(7px)',opacity:.72}}/>
  </Interactive.Div>;
};

const posterForegroundSchema={
  grassDark:{type:'color',default:'#5e955e',description:'前景绿植深色'},
  grassLight:{type:'color',default:'#a6c978',description:'前景绿植亮色'},
  bankColor:{type:'color',default:'#dce7c7',description:'水岸与地台颜色'},
  waterColor:{type:'color',default:'#98d8e3',description:'前景水面颜色'},
  entryEnabled:{type:'boolean',default:true,description:'播放前景融合层入场'},
  entryDelaySeconds:{type:'number',min:0,max:6,step:.05,default:0,hiddenFromList:false,description:'入场延迟（秒）'},
  entryDurationSeconds:{type:'number',min:.1,max:3,step:.05,default:.55,hiddenFromList:false,description:'入场时长（秒）'},
} as const satisfies InteractivitySchema;

export const PosterForeground=Interactive.withSchema({Component:PosterForegroundInner,componentName:'<PosterForeground>',schema:posterForegroundSchema,wrapInSequence:true});

type PosterBuildingProps=EntryProps&{
  readonly src:string;
  readonly label:string;
  readonly shadowOpacity:number;
  readonly colorTemperature:string;
  readonly style?:React.CSSProperties;
};

const PosterBuildingInner:React.FC<PosterBuildingProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const progress=entryProgress(frame,fps,p.entryEnabled,p.entryDelaySeconds,p.entryDurationSeconds);
  return <Interactive.Div data-poster-building={p.label} style={{position:'absolute',...p.style}}>
    <div style={{position:'absolute',left:'10%',right:'10%',bottom:'2%',height:'14%',borderRadius:'50%',background:'#42565d',filter:'blur(14px)',opacity:p.shadowOpacity*progress}}/>
    <Img name={`终章建筑 · ${p.label}`} src={p.src} style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'contain',objectPosition:'center bottom',opacity:progress,filter:`${p.colorTemperature} drop-shadow(0 12px 12px rgba(53,59,52,.2))`}}/>
  </Interactive.Div>;
};

const posterBuildingSchema={
  src:{type:'asset',assetType:'image',default:'',description:'建筑 PNG 素材'},
  label:{type:'text-content',default:'',description:'建筑名称'},
  shadowOpacity:{type:'number',min:0,max:1,step:.01,default:.2,hiddenFromList:false,description:'接触阴影透明度'},
  colorTemperature:{type:'text-content',default:'saturate(.96) brightness(1.03)',description:'统一色温滤镜'},
  entryEnabled:{type:'boolean',default:true,description:'播放建筑入场'},
  entryDelaySeconds:{type:'number',min:0,max:6,step:.05,default:2.1,hiddenFromList:false,description:'入场延迟（秒）'},
  entryDurationSeconds:{type:'number',min:.1,max:3,step:.05,default:1,hiddenFromList:false,description:'入场时长（秒）'},
} as const satisfies InteractivitySchema;

export const PosterBuilding=Interactive.withSchema({Component:PosterBuildingInner,componentName:'<PosterBuilding>',schema:posterBuildingSchema,wrapInSequence:true});

type FireworkFieldProps={
  readonly count:number;
  readonly frequencySeconds:number;
  readonly opacity:number;
  readonly gold:string;
  readonly orange:string;
  readonly pink:string;
  readonly size:number;
  readonly startSeconds:number;
  readonly style?:React.CSSProperties;
};

const FireworkBurst:React.FC<{frame:number;fps:number;phase:number;cycle:number;x:number;y:number;size:number;color:string;opacity:number}>=({frame,fps,phase,cycle,x,y,size,color,opacity})=>{
  const local=((frame-phase)%cycle+cycle)%cycle;
  const launch=interpolate(local,[0,.42*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.3,0,.2,1)});
  const burst=interpolate(local,[.38*fps,1.05*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp',easing:Easing.bezier(.16,1,.3,1)});
  const fade=interpolate(local,[.82*fps,1.35*fps],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const burstOpacity=local<.34*fps?0:fade*opacity;
  const twinkle=.68+.32*Math.sin((local/fps)*Math.PI*12);
  return <svg style={{position:'absolute',left:x-size/2,top:y-size/2,width:size,height:size+150,overflow:'visible',filter:'drop-shadow(0 0 10px rgba(255,184,92,.72))'}} viewBox={`0 0 ${size} ${size+150}`} aria-hidden="true">
    <line x1={size/2} y1={size+132} x2={size/2} y2={size+132-launch*142} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={local<.48*fps?opacity*(1-launch*.28):0}/>
    <circle cx={size/2} cy={size+132-launch*142} r={3.2} fill="#fffce8" opacity={local<.48*fps?opacity:0}/>
    {Array.from({length:20},(_,i)=>{
      const angle=(Math.PI*2*i)/20-Math.PI/2;
      const radius=size*(i%2===0?.48:.42)*burst;
      const gravity=size*.18*burst*burst;
      const startRadius=radius*.2;
      const x1=size/2+Math.cos(angle)*startRadius;
      const y1=size/2+Math.sin(angle)*startRadius+gravity*.04;
      const x2=size/2+Math.cos(angle)*radius;
      const y2=size/2+Math.sin(angle)*radius+gravity;
      const cx=size/2+Math.cos(angle)*radius*.62;
      const cy=size/2+Math.sin(angle)*radius*.62+gravity*.3;
      const sparkOpacity=burstOpacity*(.55+.45*Math.max(0,Math.sin((local/fps*8+i*.67)*Math.PI)));
      return <g key={i}>
        <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={i%2===0?4.6:3.2} strokeLinecap="round" opacity={burstOpacity*(i%3===0?.82:1)}/>
        <circle cx={x2} cy={y2} r={i%4===0?3.4:2} fill={i%4===0?'#fffce8':color} opacity={sparkOpacity}/>
        {i%5===0&&<circle cx={x2+Math.cos(angle+.8)*10*burst} cy={y2+Math.sin(angle+.8)*10*burst} r={1.8} fill="#ffffff" opacity={sparkOpacity*.8}/>}
      </g>;
    })}
    <path d={`M ${size/2} ${size/2-13*burst} L ${size/2+4*burst} ${size/2-4*burst} L ${size/2+13*burst} ${size/2} L ${size/2+4*burst} ${size/2+4*burst} L ${size/2} ${size/2+13*burst} L ${size/2-4*burst} ${size/2+4*burst} L ${size/2-13*burst} ${size/2} L ${size/2-4*burst} ${size/2-4*burst} Z`} fill="#fffce8" opacity={burstOpacity*twinkle}/>
    <circle cx={size/2} cy={size/2} r={5+burst*5} fill="#fff8d6" opacity={burstOpacity*.78}/>
  </svg>;
};

const FireworkFieldInner:React.FC<FireworkFieldProps>=(p)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const activeFrame=Math.max(0,frame-p.startSeconds*fps),cycle=Math.max(fps*1.6,p.frequencySeconds*fps);
  const beforeStart=frame<p.startSeconds*fps;
  return <Interactive.Div data-firework-field style={{position:'absolute',inset:0,pointerEvents:'none',opacity:beforeStart?0:1,...p.style}}>
    {p.count>=1&&<FireworkBurst frame={activeFrame} fps={fps} phase={0} cycle={cycle} x={105} y={280} size={p.size*.88} color={p.gold} opacity={p.opacity}/>}
    {p.count>=2&&<FireworkBurst frame={activeFrame} fps={fps} phase={cycle*.25} cycle={cycle} x={956} y={238} size={p.size} color={p.pink} opacity={p.opacity}/>}
    {p.count>=3&&<FireworkBurst frame={activeFrame} fps={fps} phase={cycle*.5} cycle={cycle} x={76} y={870} size={p.size*.75} color={p.orange} opacity={p.opacity*.92}/>}
    {p.count>=4&&<FireworkBurst frame={activeFrame} fps={fps} phase={cycle*.75} cycle={cycle} x={1000} y={820} size={p.size*.78} color={p.gold} opacity={p.opacity*.9}/>}
    {p.count>=5&&<FireworkBurst frame={activeFrame} fps={fps} phase={cycle*.12} cycle={cycle} x={92} y={1120} size={p.size*.82} color={p.pink} opacity={p.opacity*.95}/>}
    {p.count>=6&&<FireworkBurst frame={activeFrame} fps={fps} phase={cycle*.62} cycle={cycle} x={990} y={1090} size={p.size*.86} color={p.orange} opacity={p.opacity*.95}/>}
  </Interactive.Div>;
};

const fireworkFieldSchema={
  count:{type:'number',min:1,max:6,step:1,integer:true,default:6,hiddenFromList:false,description:'烟花位置数量'},
  frequencySeconds:{type:'number',min:1.6,max:6,step:.1,default:3,hiddenFromList:false,description:'单个位置循环频率（秒）'},
  opacity:{type:'number',min:0,max:1,step:.01,default:1,hiddenFromList:false,description:'烟花透明度'},
  gold:{type:'color',default:'#f5c86e',description:'浅金烟花'},
  orange:{type:'color',default:'#f0a86e',description:'暖橙烟花'},
  pink:{type:'color',default:'#efb3b7',description:'淡粉烟花'},
  size:{type:'number',min:70,max:360,step:1,default:250,hiddenFromList:false,description:'烟花大小'},
  startSeconds:{type:'number',min:0,max:8,step:.05,default:3,hiddenFromList:false,description:'烟花开始时间（秒）'},
} as const satisfies InteractivitySchema;

export const FireworkField=Interactive.withSchema({Component:FireworkFieldInner,componentName:'<FireworkField>',schema:fireworkFieldSchema,wrapInSequence:true});

const EuropeTravelPosterInner:React.FC<PosterRootProps>=(p)=>{
  const {fps}=useVideoConfig();
  return <AbsoluteFill data-europe-travel-poster data-entry-enabled={p.entryEnabled} data-hold-seconds={p.holdSeconds} style={{overflow:'hidden',fontFamily:'PingFang SC, Arial, sans-serif',...p.style}}>
    <PosterBackground name="终章 · 欧洲地图与云雾背景" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('maps/europe.svg')} topColor="#cfeaff" middleColor="#fffdf3" bottomColor="#dcefd7" mapOpacity={.24} cloudOpacity={.62} borderColor="rgba(255,255,255,.9)" borderWidth={4} borderRadius={24} style={{zIndex:1}}/>
    <FireworkField name="终章 · 持续烟花" premountFor={fps} count={p.fireworkCount} frequencySeconds={p.fireworkFrequencySeconds} opacity={p.fireworkOpacity} gold={p.fireworkGold} orange={p.fireworkOrange} pink={p.fireworkPink} size={p.fireworkSize} startSeconds={p.entryEnabled?3:0} style={{zIndex:9}}/>
    <PosterTitle name="终章 · 海报标题" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={.28} entryDurationSeconds={.88} line1="国庆欧洲" line2="7日建筑巡礼" subtitle="7 DAYS · 6 LANDMARKS" fontFamily="Arial Black, PingFang SC, sans-serif" fontSize={112} fontWeight={900} color="#092f66" strokeColor="#ffffff" strokeWidth={4} shadow="0 13px 24px rgba(36,74,114,.22)" subtitleColor="#315678" subtitleSize={29} style={{zIndex:20}}/>

    <PosterCard name="景点卡 · 埃菲尔铁塔" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={.95} entryDurationSeconds={.62} label="埃菲尔铁塔" region="PARIS · FRANCE" src={staticFile('landmarks/dioramas/eiffel.png')} accentColor="#ef3f45" labelColor="#143b68" skyColor="#bfe1fb" groundColor="#b7daa8" cardColor="#ffffff" borderColor="rgba(255,255,255,.98)" borderWidth={6} radius={24} shadow="0 18px 42px rgba(45,77,108,.2)" imageScale={86} imageOffsetX={8} imageOffsetY={11} style={{left:58,top:500,width:444,height:228,rotate:'-3deg',zIndex:10}}/>
    <PosterCard name="景点卡 · 巴黎圣母院" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={1.1} entryDurationSeconds={.62} label="巴黎圣母院" region="PARIS · FRANCE" src={staticFile('landmarks/dioramas/notre-dame.png')} accentColor="#ef3f45" labelColor="#143b68" skyColor="#c8e5fb" groundColor="#c3dfae" cardColor="#ffffff" borderColor="rgba(255,255,255,.98)" borderWidth={6} radius={24} shadow="0 18px 42px rgba(45,77,108,.2)" imageScale={92} imageOffsetX={4} imageOffsetY={15} style={{left:566,top:482,width:452,height:234,rotate:'2.4deg',zIndex:11}}/>
    <PosterCard name="景点卡 · 巴特罗之家" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={1.25} entryDurationSeconds={.62} label="巴特罗之家" region="BARCELONA · SPAIN" src={staticFile('landmarks/dioramas/casa.png')} accentColor="#ef3f45" labelColor="#143b68" skyColor="#b9dcf7" groundColor="#b6d7a8" cardColor="#ffffff" borderColor="rgba(255,255,255,.98)" borderWidth={6} radius={24} shadow="0 18px 42px rgba(45,77,108,.2)" imageScale={83} imageOffsetX={10} imageOffsetY={15} style={{left:82,top:741,width:438,height:228,rotate:'2deg',zIndex:12}}/>
    <PosterCard name="景点卡 · 米拉之家" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={1.4} entryDurationSeconds={.62} label="米拉之家" region="BARCELONA · SPAIN" src={staticFile('landmarks/dioramas/mila.png')} accentColor="#ef3f45" labelColor="#143b68" skyColor="#c5e2f5" groundColor="#bed9a9" cardColor="#ffffff" borderColor="rgba(255,255,255,.98)" borderWidth={6} radius={24} shadow="0 18px 42px rgba(45,77,108,.2)" imageScale={92} imageOffsetX={4} imageOffsetY={16} style={{left:552,top:730,width:458,height:232,rotate:'-2.2deg',zIndex:13}}/>
    <PosterCard name="景点卡 · 圣彼得大教堂" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={1.55} entryDurationSeconds={.62} label="圣彼得大教堂" region="VATICAN CITY" src={staticFile('landmarks/dioramas/vatican.png')} accentColor="#ef3f45" labelColor="#143b68" skyColor="#beddf4" groundColor="#b7d6a2" cardColor="#ffffff" borderColor="rgba(255,255,255,.98)" borderWidth={6} radius={24} shadow="0 18px 42px rgba(45,77,108,.2)" imageScale={95} imageOffsetX={2} imageOffsetY={14} style={{left:62,top:981,width:454,height:230,rotate:'-2.2deg',zIndex:11}}/>
    <PosterCard name="景点卡 · 特莱维喷泉" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={1.7} entryDurationSeconds={.62} label="特莱维喷泉" region="ROME · ITALY" src={staticFile('landmarks/dioramas/trevi.png')} accentColor="#ef3f45" labelColor="#143b68" skyColor="#c2e0f4" groundColor="#a8d8c8" cardColor="#ffffff" borderColor="rgba(255,255,255,.98)" borderWidth={6} radius={24} shadow="0 18px 42px rgba(45,77,108,.2)" imageScale={94} imageOffsetX={3} imageOffsetY={15} style={{left:562,top:969,width:452,height:234,rotate:'3deg',zIndex:12}}/>

    <PosterBuilding name="终章建筑 · 埃菲尔铁塔" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('landmarks/dioramas/eiffel.png')} label="埃菲尔铁塔" shadowOpacity={.18} colorTemperature="saturate(.96) brightness(1.03)" style={{left:-95,top:1040,width:430,height:840,scale:1.4,transformOrigin:'center bottom',zIndex:6}}/>
    <PosterBuilding name="终章建筑 · 巴黎圣母院" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('landmarks/dioramas/notre-dame.png')} label="巴黎圣母院" shadowOpacity={.18} colorTemperature="saturate(.96) brightness(1.03)" style={{left:112,top:1320,width:500,height:500,scale:1.4,transformOrigin:'center bottom',zIndex:7}}/>
    <PosterBuilding name="终章建筑 · 巴特罗之家" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('landmarks/dioramas/casa.png')} label="巴特罗之家" shadowOpacity={.2} colorTemperature="saturate(.96) brightness(1.03)" style={{left:312,top:1120,width:350,height:650,scale:1.4,transformOrigin:'center bottom',zIndex:6}}/>
    <PosterBuilding name="终章建筑 · 米拉之家" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('landmarks/dioramas/mila.png')} label="米拉之家" shadowOpacity={.18} colorTemperature="saturate(.96) brightness(1.03)" style={{left:458,top:1390,width:500,height:385,scale:1.4,transformOrigin:'center bottom',zIndex:7}}/>
    <PosterBuilding name="终章建筑 · 圣彼得大教堂" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('landmarks/dioramas/vatican.png')} label="圣彼得大教堂" shadowOpacity={.2} colorTemperature="saturate(.96) brightness(1.03)" style={{left:670,top:1360,width:470,height:430,scale:1.4,transformOrigin:'center bottom',zIndex:7}}/>
    <PosterBuilding name="终章建筑 · 特莱维喷泉" premountFor={fps} entryEnabled={p.entryEnabled} entryDelaySeconds={0} entryDurationSeconds={.55} src={staticFile('landmarks/dioramas/trevi.png')} label="特莱维喷泉" shadowOpacity={.22} colorTemperature="saturate(.96) brightness(1.03)" style={{left:205,top:1370,width:650,height:570,scale:1.4,transformOrigin:'center bottom',zIndex:8}}/>
  </AbsoluteFill>;
};

const posterRootSchema={
  entryEnabled:{type:'boolean',default:true,description:'播放标题、卡片与建筑入场'},
  holdSeconds:{type:'number',min:3,max:30,step:.5,default:12,hiddenFromList:false,description:'海报稳定停留时长（秒）'},
  fireworkCount:{type:'number',min:1,max:6,step:1,integer:true,default:6,hiddenFromList:false,description:'烟花位置数量'},
  fireworkFrequencySeconds:{type:'number',min:1.6,max:6,step:.1,default:3,hiddenFromList:false,description:'烟花循环频率（秒）'},
  fireworkOpacity:{type:'number',min:0,max:1,step:.01,default:1,hiddenFromList:false,description:'烟花透明度'},
  fireworkGold:{type:'color',default:'#f5c86e',description:'浅金烟花颜色'},
  fireworkOrange:{type:'color',default:'#f0a86e',description:'暖橙烟花颜色'},
  fireworkPink:{type:'color',default:'#efb3b7',description:'淡粉烟花颜色'},
  fireworkSize:{type:'number',min:70,max:360,step:1,default:250,hiddenFromList:false,description:'烟花大小'},
} as const satisfies InteractivitySchema;

export const EuropeTravelPoster=Interactive.withSchema({Component:EuropeTravelPosterInner,componentName:'<EuropeTravelPoster>',schema:posterRootSchema,wrapInSequence:true});

export const EuropeTravelPosterLoop:React.FC<PosterRootProps>=(p)=><EuropeTravelPoster {...p} entryEnabled={false}/>;
