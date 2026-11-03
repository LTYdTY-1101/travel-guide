import type React from 'react';
import {Interactive,useCurrentFrame,useVideoConfig,type InteractivitySchema} from 'remotion';
import {smooth} from '../flight/flight-path';

export type TourInfoCardProps={cardId:string;eyebrow:string;title:string;description:string;showPin:boolean;eyebrowStyle:React.CSSProperties;titleStyle:React.CSSProperties;descriptionStyle:React.CSSProperties;backgroundColor:string;backgroundOpacity:number;backgroundBlur:number;borderRadius:number;borderWidth:number;borderColor:string;shadow:string;paddingX:number;paddingY:number;rowGap:number;textOpacity:number;fadeInSeconds:number;fadeOutSeconds:number;style?:React.CSSProperties};
const TourInfoCardInner:React.FC<TourInfoCardProps>=(p)=>{
 const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const fade=smooth(frame/Math.max(1,p.fadeInSeconds*fps))*(1-smooth((frame-durationInFrames+p.fadeOutSeconds*fps)/Math.max(1,p.fadeOutSeconds*fps)));
 const description=p.description;
 return <div data-info-card={p.cardId} data-card-type={p.showPin?'city':'landmark'} data-card-frame={frame} style={{position:'absolute',boxSizing:'border-box',padding:p.paddingY+'px '+p.paddingX+'px',borderRadius:p.borderRadius,...p.style,opacity:fade*Number(p.style?.opacity??1)}}>
  <div data-card-background style={{position:'absolute',inset:0,borderRadius:'inherit',backgroundColor:p.backgroundColor,opacity:p.backgroundOpacity,backdropFilter:'blur('+p.backgroundBlur+'px)',border:p.borderWidth+'px solid '+p.borderColor,boxShadow:p.shadow}} />
  <div style={{position:'relative',display:'flex',flexDirection:'column',gap:p.rowGap,opacity:p.textOpacity}}>
   <div data-card-line="eyebrow" style={p.eyebrowStyle}>{p.eyebrow}</div>
   <div data-card-line="title" style={{...p.titleStyle,display:'flex',alignItems:'center',justifyContent:p.titleStyle.textAlign==='left'?'flex-start':p.titleStyle.textAlign==='right'?'flex-end':'center',gap:10}}>
    {p.showPin&&<svg width="26" height="30" viewBox="0 0 24 28" fill="none" aria-hidden="true" style={{flexShrink:0}}><path d="M12 26S3 16.8 3 10a9 9 0 1 1 18 0c0 6.8-9 16-9 16Z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>}
    <span>{p.title}</span>
   </div>
   {description&&<div data-card-line="description" style={p.descriptionStyle}>{description}</div>}
  </div>
 </div>;
};
export const tourInfoCardSchema={
 cardId:{type:'hidden'},
 eyebrow:{type:'text-content',default:'',description:'第一行 · 行程 / 城市英文'},
 title:{type:'text-content',default:'',description:'第二行 · 中文名称'},
 description:{type:'text-content',default:'',description:'第三行 · 景点简介（城市卡留空）'},
 showPin:{type:'boolean',default:false,description:'城市定位图标'},
 'eyebrowStyle.fontFamily':{type:'font-family',default:"PingFang SC, Arial, sans-serif",description:'行程 / 城市英文 · 字体'},
 'eyebrowStyle.fontSize':{type:'number',default:22,description:'行程 / 城市英文 · 字号',hiddenFromList:false,step:.05},
 'eyebrowStyle.fontWeight':{type:'font-weight',default:500,description:'行程 / 城市英文 · 字重'},
 'eyebrowStyle.color':{type:'color',default:"#858780",description:'行程 / 城市英文 · 颜色'},
 'eyebrowStyle.lineHeight':{type:'number',default:1.4,description:'行程 / 城市英文 · 行距',hiddenFromList:false,step:.05},
 'eyebrowStyle.textAlign':{type:'enum',default:"center",description:'行程 / 城市英文 · 对齐',variants:{left:{},center:{},right:{}}},
 'eyebrowStyle.letterSpacing':{type:'number',default:0,description:'行程 / 城市英文 · 字距',hiddenFromList:false,step:.05},
 'eyebrowStyle.opacity':{type:'number',default:1,description:'行程 / 城市英文 · 文字透明度',hiddenFromList:false,step:.05},
 'titleStyle.fontFamily':{type:'font-family',default:"PingFang SC, Arial, sans-serif",description:'中文标题 · 字体'},
 'titleStyle.fontSize':{type:'number',default:44,description:'中文标题 · 字号',hiddenFromList:false,step:.05},
 'titleStyle.fontWeight':{type:'font-weight',default:750,description:'中文标题 · 字重'},
 'titleStyle.color':{type:'color',default:"#25302c",description:'中文标题 · 颜色'},
 'titleStyle.lineHeight':{type:'number',default:1.4,description:'中文标题 · 行距',hiddenFromList:false,step:.05},
 'titleStyle.textAlign':{type:'enum',default:"center",description:'中文标题 · 对齐',variants:{left:{},center:{},right:{}}},
 'titleStyle.letterSpacing':{type:'number',default:0,description:'中文标题 · 字距',hiddenFromList:false,step:.05},
 'titleStyle.opacity':{type:'number',default:1,description:'中文标题 · 文字透明度',hiddenFromList:false,step:.05},
 'descriptionStyle.fontFamily':{type:'font-family',default:"PingFang SC, Arial, sans-serif",description:'景点简介 · 字体'},
 'descriptionStyle.fontSize':{type:'number',default:26,description:'景点简介 · 字号',hiddenFromList:false,step:.05},
 'descriptionStyle.fontWeight':{type:'font-weight',default:400,description:'景点简介 · 字重'},
 'descriptionStyle.color':{type:'color',default:"#737770",description:'景点简介 · 颜色'},
 'descriptionStyle.lineHeight':{type:'number',default:1.4,description:'景点简介 · 行距',hiddenFromList:false,step:.05},
 'descriptionStyle.textAlign':{type:'enum',default:"center",description:'景点简介 · 对齐',variants:{left:{},center:{},right:{}}},
 'descriptionStyle.letterSpacing':{type:'number',default:0,description:'景点简介 · 字距',hiddenFromList:false,step:.05},
 'descriptionStyle.opacity':{type:'number',default:1,description:'景点简介 · 文字透明度',hiddenFromList:false,step:.05},
 backgroundColor:{type:'color',default:'#fffdf8',description:'背景颜色'},
 backgroundOpacity:{type:'number',default:.94,min:0,max:1,step:.01,hiddenFromList:false,description:'背景透明度（独立于文字）'},
 backgroundBlur:{type:'number',default:16,min:0,max:60,hiddenFromList:false,description:'背景模糊'},
 borderRadius:{type:'number',default:28,min:0,hiddenFromList:false,description:'圆角'},
 borderWidth:{type:'number',default:0,min:0,hiddenFromList:false,description:'边框宽度'},
 borderColor:{type:'color',default:'#e6e3db',description:'边框颜色'},
 shadow:{type:'text-content',default:'0 16px 48px rgba(35,42,33,.16)',description:'阴影'},
 paddingX:{type:'number',default:30,min:0,hiddenFromList:false,description:'左右内边距'},
 paddingY:{type:'number',default:28,min:0,hiddenFromList:false,description:'上下内边距'},
 rowGap:{type:'number',default:8,min:0,hiddenFromList:false,description:'行间距'},
 textOpacity:{type:'number',default:1,min:0,max:1,step:.01,hiddenFromList:false,description:'全部文字透明度'},
 fadeInSeconds:{type:'number',default:.25,min:0,max:5,step:.05,hiddenFromList:false,description:'淡入秒数（出现时间见时间轴起点）'},
 fadeOutSeconds:{type:'number',default:.22,min:0,max:5,step:.05,hiddenFromList:false,description:'淡出秒数（停留时长见时间轴长度）'},
 'style.left':{type:'number',default:90,hiddenFromList:false,description:'横向位置'},
 'style.top':{type:'number',default:1630,hiddenFromList:false,description:'纵向位置'},
 'style.width':{type:'number',default:900,min:100,hiddenFromList:false,description:'卡片宽度'},
} as const satisfies InteractivitySchema;
export const TourInfoCard=Interactive.withSchema({Component:TourInfoCardInner,componentName:'<TourInfoCard>',schema:tourInfoCardSchema,wrapInSequence:true});
