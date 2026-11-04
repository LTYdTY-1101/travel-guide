import {useMemo} from 'react';
import {Audio} from '@remotion/media';
import {whip,whoosh} from '@remotion/sfx';
import {staticFile,useVideoConfig, Track} from 'remotion';
import newMusic from '../../public/journey/feel-free-beats.json';
import {buildTour,OPENING_SECONDS,type TourProps} from './tour-data';
import {BackgroundMusicTrack} from '../audio/BackgroundMusicTrack';
import {EditableAudioClip} from '../audio/EditableAudioClip';
import {OPENING_TIMES} from '../opening/opening-state';

const snapToNewMusic=(seconds:number,limit=.14)=>{
 const nearest=(newMusic.beats as number[]).reduce((best,value)=>Math.abs(value-seconds)<Math.abs(best-seconds)?value:best,newMusic.beats[0]);
 return Math.abs(nearest-seconds)<=limit?nearest:seconds;
};

export const TourSoundtrack:React.FC<TourProps>=(props)=>{
 const {fps,durationInFrames}=useVideoConfig();
 const localWhoosh=staticFile(`audio/sfx/remotion-${whoosh.split('/').pop()}`);
 const localWhip=staticFile(`audio/sfx/remotion-${whip.split('/').pop()}`);
 const {stops,legs,section}=props,tour=useMemo(()=>buildTour({stops,legs,section}),[stops,legs,section]);
 const intro=props.section==='full'||props.section==='paris-stage',tourStart=intro?OPENING_SECONDS:0;
 const step=(id:string)=>tour.steps.find(item=>item.id===id);
 const absolute=(id:string)=>tourStart+(step(id)?.start??0);
 const pvg=step('pvg--cdg'),parisFlight=step('notre-dame--bcn'),barcelonaFlight=step('mila--fco');
 const cdg=step('cdg--eiffel'),notre=step('eiffel--notre-dame'),bcn=step('bcn--casa'),mila=step('casa--mila'),fco=step('fco--trevi'),vatican=step('trevi--vatican');
 const pvgPass=snapToNewMusic(absolute('pvg--cdg')+.42),parisPass=snapToNewMusic(absolute('notre-dame--bcn')+.48),barcelonaPass=snapToNewMusic(absolute('mila--fco')+.56);
 const tramTimes=[cdg,notre,bcn,mila,fco,vatican].filter(Boolean).map(item=>snapToNewMusic(tourStart+item!.start+.22));
 const posterStart=OPENING_SECONDS+tour.seconds;
 const fireworkBursts=props.section==='full'?[3.38,4.13,5.63,6.38,7.13,8.63,9.38,10.13,11.63,12.38,13.13,14.63].map(value=>posterStart+value):[];
 const duckTimes=[...(intro?[2/30]:[]),...(pvg?[pvgPass]:[]),...(parisFlight?[parisPass]:[]),...(barcelonaFlight?[barcelonaPass]:[]),...tramTimes,...fireworkBursts];
 const musicTrim=intro?0:OPENING_SECONDS+tour.offset;
 const musicStart=(intro?OPENING_TIMES.ticketSettle:0)/props.playbackSpeed,musicFrom=Math.round(musicStart*fps);
 const localDuckTimes=duckTimes.map(value=>value/props.playbackSpeed-musicStart).filter(value=>value>=0);
 return <>
  {props.section==='full'?<BackgroundMusicTrack
   name="背景音乐 · 烟花开始后平滑降至 30%（可拖拽、裁切与调音量）"
   src={staticFile('audio/feel-free-ccmixter.mp3')}
   from={143}
   durationInFrames={2690}
   premountFor={50}
   volume={0.5}
   trimBeforeSeconds={0}
   fadeInSeconds={0}
   fadeOutSeconds={0}
   duckAmount={0}
   duckTimesSeconds={[]}
   permanentDuckStartSeconds={2294/30}
   permanentDuckFadeSeconds={2}
   permanentDuckTargetVolume={.3}
  />:<BackgroundMusicTrack name="背景音乐 · 机票出现后淡入" src={staticFile('audio/feel-free-ccmixter.mp3')} from={musicFrom} durationInFrames={Math.max(1,durationInFrames-musicFrom)} premountFor={fps} volume={props.musicVolume*.4} trimBeforeSeconds={musicTrim} fadeInSeconds={.65} fadeOutSeconds={1.8} duckAmount={.18} duckTimesSeconds={localDuckTimes} permanentDuckStartSeconds={180} permanentDuckFadeSeconds={.01} permanentDuckTargetVolume={props.musicVolume*.4}/>}
  {intro&&<Track name="SFX 1 · 第一个消息（可拖拽与裁切）">
   <Audio
    name="SFX 1 · 第一个消息（可拖拽与裁切）"
    src={staticFile('audio/sfx/message-popup-1.wav')}
    from={18}
    durationInFrames={27}
    trimBefore={18}
    premountFor={30}
    volume={1}
    playbackRate={1}
   />
  </Track>}
  {intro&&<Track name="SFX 2 · 第二个消息（可拖拽与裁切）">
   <Audio
    name="SFX 2 · 第二个消息（可拖拽与裁切）"
    src={staticFile('audio/sfx/message-popup-2.wav')}
    from={47}
    durationInFrames={26}
    trimBefore={17}
    premountFor={30}
    volume={0.5}
    playbackRate={1}
   />
  </Track>}
  {intro&&<Audio
   name="SFX 3 · 地图翻转 whoosh（可拖拽与裁切）"
   src={localWhoosh}
   from={114}
   durationInFrames={28}
   trimBefore={0}
   premountFor={30}
   volume={1.5}
   playbackRate={0.2}
   preservePitch
  />}
  {intro&&<Audio
   name="SFX 4 · 机票出现 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={149}
   durationInFrames={15}
   trimBefore={0}
   premountFor={30}
   playbackRate={0.6}
   preservePitch
  />}

  {pvg&&<Audio
   name="SFX 5 · 上海→巴黎飞机飞行（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/shanghai-paris-flight.wav')}
   from={192}
   durationInFrames={211.788}
   premountFor={30}
   volume={0.5}
   playbackRate={1.332}
   preservePitch
  />}
  {props.section==='full'&&parisFlight&&<Audio
   name="SFX 6 · 巴黎→巴塞罗那飞机飞行（参考已编辑效果，可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/shanghai-paris-flight.wav')}
   from={929}
   durationInFrames={211.788}
   premountFor={30}
   volume={0.3}
   playbackRate={1.332}
   preservePitch
  />}
  {props.section==='full'&&barcelonaFlight&&<Audio
   name="SFX 7 · 巴塞罗那→罗马飞机飞行（参考已编辑效果，可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/shanghai-paris-flight.wav')}
   from={1622}
   durationInFrames={211.788}
   premountFor={30}
   volume={0.3}
   playbackRate={1.332}
   preservePitch
  />}
  {props.section==='full'&&<EditableAudioClip
   name="SFX 8 · 最终烟花（可拖拽、左右裁切、调速度与音量）"
   src={staticFile('audio/sfx/final-fireworks-explosion-loop.wav')}
   from={2437}
   durationInFrames={377}
   premountFor={50}
   volume={0.3}
   trimBeforeSeconds={0}
   fadeInSeconds={0}
   fadeOutSeconds={0}
   clipPlaybackRate={0.8}
   loopAsset
  />}
  {props.section==='full'&&<Audio
   name="SFX 9 · 终章小图 1 埃菲尔铁塔 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={2415}
   durationInFrames={6}
   trimBefore={0}
   premountFor={30}
   volume={0.5}
   playbackRate={0.9}
  />}
  {props.section==='full'&&<Audio
   name="SFX 10 · 终章小图 2 巴黎圣母院 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={2419}
   durationInFrames={6}
   trimBefore={0}
   premountFor={30}
   volume={0.5}
   playbackRate={0.8}
  />}
  {props.section==='full'&&<Audio
   name="SFX 11 · 终章小图 3 巴特罗之家 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={2424}
   durationInFrames={6}
   trimBefore={0}
   premountFor={30}
   volume={0.5}
   playbackRate={0.8}
  />}
  {props.section==='full'&&<Audio
   name="SFX 12 · 终章小图 4 米拉之家 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={2428}
   durationInFrames={6}
   trimBefore={0}
   premountFor={30}
   volume={0.5}
   playbackRate={0.8}
  />}
  {props.section==='full'&&<Audio
   name="SFX 13 · 终章小图 5 圣彼得大教堂 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={2433}
   durationInFrames={6}
   trimBefore={0}
   premountFor={30}
   volume={0.5}
   playbackRate={0.8}
  />}
  {props.section==='full'&&<Audio
   name="SFX 14 · 终章小图 6 特莱维喷泉 whip（可拖拽、拉伸、裁切与调音量）"
   src={localWhip}
   from={2437}
   durationInFrames={6}
   trimBefore={0}
   premountFor={30}
   volume={0.5}
   playbackRate={0.8}
  />}
  {props.section==='full'&&<Audio
   name="SFX 15 · 埃菲尔铁塔出现 翻牌（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/landmark-card-flip.wav')}
   from={491}
   durationInFrames={11}
   trimBefore={0}
   premountFor={30}
   volume={3}
   playbackRate={0.9}
  />}
  {props.section==='full'&&<Audio
   name="SFX 16 · 巴黎圣母院出现 翻牌（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/landmark-card-flip.wav')}
   from={789}
   durationInFrames={11}
   trimBefore={0}
   premountFor={30}
   volume={3}
   playbackRate={0.9}
  />}
  {props.section==='full'&&<Audio
   name="SFX 17 · 巴特罗之家出现 翻牌（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/landmark-card-flip.wav')}
   from={1211}
   durationInFrames={11}
   trimBefore={0}
   premountFor={30}
   volume={3}
   playbackRate={0.9}
  />}
  {props.section==='full'&&<Audio
   name="SFX 18 · 米拉之家出现 翻牌（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/landmark-card-flip.wav')}
   from={1443}
   durationInFrames={11}
   trimBefore={0}
   premountFor={30}
   volume={3}
   playbackRate={0.9}
  />}
  {props.section==='full'&&<Audio
   name="SFX 19 · 特莱维喷泉出现 翻牌（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/landmark-card-flip.wav')}
   from={1871}
   durationInFrames={11}
   trimBefore={0}
   premountFor={30}
   volume={3}
   playbackRate={0.9}
  />}
  {props.section==='full'&&<Audio
   name="SFX 20 · 圣彼得大教堂出现 翻牌（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/landmark-card-flip.wav')}
   from={2184}
   durationInFrames={11}
   trimBefore={0}
   premountFor={30}
   volume={3}
   playbackRate={0.9}
  />}

  {cdg&&<Audio
   name="电车铃 · 戴高乐机场出发（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/tram-double-bell.wav')}
   from={402}
   durationInFrames={22}
   trimBefore={0}
   premountFor={30}
   volume={2}
   playbackRate={1}
  />}
  {notre&&<Audio
   name="电车铃 · 埃菲尔铁塔出发（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/tram-double-bell.wav')}
   from={671}
   durationInFrames={22}
   trimBefore={0}
   premountFor={30}
   volume={2}
   playbackRate={1}
  />}
  {bcn&&<Audio
   name="电车铃 · 巴塞罗那机场出发（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/tram-double-bell.wav')}
   from={1096}
   durationInFrames={22}
   trimBefore={0}
   premountFor={30}
   volume={2}
   playbackRate={1}
  />}
  {mila&&<Audio
   name="电车铃 · 巴特罗之家出发（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/tram-double-bell.wav')}
   from={1356}
   durationInFrames={22}
   trimBefore={0}
   premountFor={30}
   volume={2}
   playbackRate={1}
  />}
  {fco&&<Audio
   name="电车铃 · 罗马机场出发（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/tram-double-bell.wav')}
   from={1780}
   durationInFrames={22}
   trimBefore={0}
   premountFor={30}
   volume={2}
   playbackRate={1}
  />}
  {vatican&&<Audio
   name="电车铃 · 特莱维喷泉出发（可拖拽、拉伸、裁切与调音量）"
   src={staticFile('audio/sfx/tram-double-bell.wav')}
   from={2050}
   durationInFrames={22}
   trimBefore={0}
   premountFor={30}
   volume={2}
   playbackRate={1}
  />}
 </>;
};
