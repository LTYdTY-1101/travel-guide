import type React from 'react';
import {useVideoConfig} from 'remotion';
import {TourInfoCard} from './TourInfoCard';

// Landmark cards keep independent editable ranges. The city card is a single
// stable overlay driven by the current journey step so overlapping ranges can
// never make it flicker between cities.
export const TourInfoCards:React.FC<{activeCity?:string}>=({activeCity})=>{
 const {fps}=useVideoConfig();
 const city=activeCity==='巴黎'?{cardId:'paris',eyebrow:'PARIS',title:'巴黎'}:
  activeCity==='巴塞罗那'?{cardId:'barcelona',eyebrow:'BARCELONA',title:'巴塞罗那'}:
  activeCity==='梵蒂冈'?{cardId:'vatican-city',eyebrow:'VATICAN CITY',title:'梵蒂冈'}:
  activeCity==='罗马'?{cardId:'rome',eyebrow:'ROME',title:'罗马'}:undefined;
 return <>
  <TourInfoCard
   name="景点介绍 · 埃菲尔铁塔"
   from={280}
   durationInFrames={127}
   premountFor={fps}
   cardId={"eiffel"}
   eyebrow={"第1天 · 01 / EIFFEL TOWER"}
   title={'埃菲尔铁塔'}
   description={"从塞纳河畔，开启巴黎的第一站。"}
   showPin={false}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":22,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":1.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":44,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":26,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={28}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={28}
   rowGap={8}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":255,"top":1630,"width":570}}
  />
  <TourInfoCard
   name="景点介绍 · 巴黎圣母院"
   from={578}
   durationInFrames={96}
   premountFor={fps}
   cardId={"notre-dame"}
   eyebrow={"第2天 · 02 / NOTRE-DAME DE PARIS"}
   title={"巴黎圣母院"}
   description={"双塔与玫瑰窗，留住一眼巴黎。"}
   showPin={false}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":22,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":1.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":44,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":26,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={28}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={28}
   rowGap={8}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":255,"top":1630,"width":570}}
  />
  <TourInfoCard
   name="景点介绍 · 巴特罗之家"
   from={1010}
   durationInFrames={85}
   premountFor={fps}
   cardId={"casa"}
   eyebrow={"第4天 · 03 / CASA BATLLÓ"}
   title={"巴特罗之家"}
   description={"走进彩色立面，感受高迪的奇妙想象。"}
   showPin={false}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":22,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":1.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":44,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":26,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={28}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={28}
   rowGap={8}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":255,"top":1630,"width":570}}
  />
  <TourInfoCard
   name="景点介绍 · 米拉之家"
   from={1242}
   durationInFrames={116}
   premountFor={fps}
   cardId={"mila"}
   eyebrow={"第4天 · 04 / CASA MILÀ"}
   title={"米拉之家"}
   description={"沿街继续漫游，看石墙起伏成波浪。"}
   showPin={false}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":22,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":1.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":44,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":26,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor="#fffdf8"
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={28}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={28}
   rowGap={8}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":255,"top":1630,"width":570}}
  />
  <TourInfoCard
   name="景点介绍 · 圣彼得大教堂"
   from={1942}
   durationInFrames={155}
   premountFor={fps}
   cardId={"vatican"}
   eyebrow={"第7天 · 06 / ST. PETER’S BASILICA"}
   title={"圣彼得大教堂"}
   description={"穿过广场，抬头看穹顶展开的恢宏。"}
   showPin={false}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":22,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":1.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":44,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":26,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={28}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={28}
   rowGap={8}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":255,"top":1630,"width":570}}
  />
  <TourInfoCard
   name="景点介绍 · 特莱维喷泉"
   from={1690}
   durationInFrames={126}
   premountFor={fps}
   cardId={"trevi"}
   eyebrow={"第6天 · 05 / TREVI FOUNTAIN"}
   title={"特莱维喷泉"}
   description={"把最后一个心愿，留在罗马的水声里。"}
   showPin={false}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":22,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":1.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":44,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":26,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={28}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={28}
   rowGap={8}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":255,"top":1630,"width":570}}
  />
  {/* Legacy fixed-frame city cards are retained here only as migration history.
  <TourInfoCard
   name="城市定位 · 巴黎"
   from={159}
   durationInFrames={694}
   premountFor={fps}
   cardId={"paris"}
   eyebrow={"PARIS"}
   title={"巴黎"}
   description={""}
   showPin={true}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":19,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":2.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":32,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":21,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.94}
   backgroundBlur={16}
   borderRadius={24}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={20}
   rowGap={7}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":370,"top":70,"width":340}}
  />
  <TourInfoCard
   name="城市定位 · 巴塞罗那"
   from={853}
   durationInFrames={684}
   premountFor={fps}
   cardId={"barcelona"}
   eyebrow={"BARCELONA"}
   title={"巴塞罗那"}
   description={""}
   showPin={true}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":19,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":2.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":32,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":21,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.94}
   backgroundBlur={16}
   borderRadius={24}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={20}
   rowGap={7}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":370,"top":70,"width":340}}
  />
  <TourInfoCard
   name="城市定位 · 罗马"
   from={1537}
   durationInFrames={90}
   premountFor={fps}
   cardId={"rome-airport"}
   eyebrow={"ROME"}
   title={"罗马"}
   description={""}
   showPin={true}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":19,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":2.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":32,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":21,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.94}
   backgroundBlur={16}
   borderRadius={24}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={20}
   rowGap={7}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":370,"top":70,"width":340}}
  />
  <TourInfoCard
   name="城市定位 · 梵蒂冈"
   from={1627}
   durationInFrames={343}
   premountFor={fps}
   cardId={"vatican-city"}
   eyebrow={"VATICAN CITY"}
   title={"梵蒂冈"}
   description={""}
   showPin={true}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":19,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":2.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":32,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":21,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.94}
   backgroundBlur={16}
   borderRadius={24}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={20}
   rowGap={7}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":370,"top":70,"width":340}}
  />
  <TourInfoCard
   name="城市定位 · 罗马 · 再抵罗马"
   from={1970}
   durationInFrames={179}
   premountFor={fps}
   cardId={"rome-trevi"}
   eyebrow={"ROME"}
   title={"罗马"}
   description={""}
   showPin={true}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":19,"fontWeight":500,"color":"#858780","lineHeight":1.4,"textAlign":"center","letterSpacing":2.2,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":32,"fontWeight":750,"color":"#25302c","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":21,"fontWeight":400,"color":"#737770","lineHeight":1.4,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor={"#fffdf8"}
   backgroundOpacity={0.94}
   backgroundBlur={16}
   borderRadius={24}
   borderWidth={0}
   borderColor={"#e6e3db"}
   shadow={"0 16px 48px rgba(35,42,33,.16)"}
   paddingX={26}
   paddingY={20}
   rowGap={7}
   textOpacity={1}
   fadeInSeconds={0.25}
   fadeOutSeconds={0.22}
   style={{"left":370,"top":70,"width":340}}
  /> */}
  {city&&<TourInfoCard
   name="城市定位 · 当前城市"
   premountFor={fps}
   cardId={city.cardId}
   eyebrow={city.eyebrow}
   title={city.title}
   description=""
   showPin={true}
   eyebrowStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":18,"fontWeight":500,"color":"#858780","lineHeight":1.35,"textAlign":"center","letterSpacing":2.1,"opacity":1}}
   titleStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":30,"fontWeight":750,"color":"#25302c","lineHeight":1.35,"textAlign":"center","letterSpacing":0,"opacity":1}}
   descriptionStyle={{"fontFamily":"PingFang SC, Arial, sans-serif","fontSize":20,"fontWeight":400,"color":"#737770","lineHeight":1.35,"textAlign":"center","letterSpacing":0,"opacity":1}}
   backgroundColor="#fffdf8"
   backgroundOpacity={0.8}
   backgroundBlur={16}
   borderRadius={22}
   borderWidth={0}
   borderColor="#e6e3db"
   shadow="0 14px 42px rgba(35,42,33,.15)"
   paddingX={22}
   paddingY={18}
   rowGap={6}
   textOpacity={1}
   fadeInSeconds={0}
   fadeOutSeconds={0}
   style={{left:427.5,top:70,width:225}}
  />}
 </>;
};
