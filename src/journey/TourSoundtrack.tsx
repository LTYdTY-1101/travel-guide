import {useMemo} from 'react';
import {staticFile,useVideoConfig} from 'remotion';
import newMusic from '../../public/journey/feel-free-beats.json';
import {buildTour,OPENING_SECONDS,type TourProps} from './tour-data';
import {EditableAudioClip} from '../audio/EditableAudioClip';
import {BackgroundMusicTrack} from '../audio/BackgroundMusicTrack';
import {OPENING_TIMES} from '../opening/opening-state';

const snapToNewMusic=(seconds:number,limit=.14)=>{
 const nearest=(newMusic.beats as number[]).reduce((best,value)=>Math.abs(value-seconds)<Math.abs(best-seconds)?value:best,newMusic.beats[0]);
 return Math.abs(nearest-seconds)<=limit?nearest:seconds;
};

export const TourSoundtrack:React.FC<TourProps>=(props)=>{
 const {fps,durationInFrames}=useVideoConfig();
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
 const clip=(seconds:number)=>Math.round(seconds/props.playbackSpeed*fps);
 return <>
  <BackgroundMusicTrack name="背景音乐 · 机票出现后淡入" src={staticFile('audio/feel-free-ccmixter.mp3')} from={musicFrom} durationInFrames={Math.max(1,durationInFrames-musicFrom)} premountFor={fps} volume={props.musicVolume*.4} trimBeforeSeconds={musicTrim} fadeInSeconds={.65} fadeOutSeconds={1.8} duckAmount={.18} duckTimesSeconds={localDuckTimes}/>
  {intro&&<EditableAudioClip name="参考视频 · 第一条短信提示（已去背景音乐）" src={staticFile('audio/reference/reference-message-clean.wav')} from={clip(2/30)} durationInFrames={clip(.95)} premountFor={fps} volume={.72} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.06} clipPlaybackRate={props.playbackSpeed} loopAsset={false}/>}
  {intro&&<EditableAudioClip name="参考视频 · GO 短信提示（已去背景音乐）" src={staticFile('audio/reference/reference-message-clean.wav')} from={clip(OPENING_TIMES.messageReply)} durationInFrames={clip(.95)} premountFor={fps} volume={.64} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.06} clipPlaybackRate={props.playbackSpeed} loopAsset={false}/>}
  {intro&&<EditableAudioClip name="参考视频 · 地图翻转（已去背景音乐）" src={staticFile('audio/reference/reference-map-flip-clean.wav')} from={clip(OPENING_TIMES.messageFlip)} durationInFrames={clip(1.55)} premountFor={fps} volume={.72} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.1} clipPlaybackRate={props.playbackSpeed} loopAsset={false}/>}
  {intro&&<EditableAudioClip name="参考视频 · 机票出现（已去背景音乐）" src={staticFile('audio/reference/reference-ticket-clean.wav')} from={clip(OPENING_TIMES.ticketIn)} durationInFrames={clip(1.35)} premountFor={fps} volume={.68} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.12} clipPlaybackRate={props.playbackSpeed} loopAsset={false}/>}

  {pvg&&<EditableAudioClip name="参考视频 · 上海至巴黎飞行（已去背景音乐）" src={staticFile('audio/reference/reference-plane-clean.wav')} from={clip(absolute('pvg--cdg'))} durationInFrames={clip(pvg.seconds)} premountFor={fps} volume={.54} trimBeforeSeconds={0} fadeInSeconds={.08} fadeOutSeconds={.3} clipPlaybackRate={.78*props.playbackSpeed} loopAsset={false}/>}
  {parisFlight&&<EditableAudioClip name="参考视频 · 巴黎至巴塞罗那飞行（已去背景音乐）" src={staticFile('audio/reference/reference-plane-clean.wav')} from={clip(absolute('notre-dame--bcn'))} durationInFrames={clip(parisFlight.seconds)} premountFor={fps} volume={.46} trimBeforeSeconds={0} fadeInSeconds={.08} fadeOutSeconds={.3} clipPlaybackRate={.78*props.playbackSpeed} loopAsset={false}/>}
  {barcelonaFlight&&<EditableAudioClip name="参考视频 · 巴塞罗那至罗马飞行（已去背景音乐）" src={staticFile('audio/reference/reference-plane-clean.wav')} from={clip(absolute('mila--fco'))} durationInFrames={clip(barcelonaFlight.seconds)} premountFor={fps} volume={.48} trimBeforeSeconds={0} fadeInSeconds={.08} fadeOutSeconds={.3} clipPlaybackRate={.78*props.playbackSpeed} loopAsset={false}/>}

  {cdg&&<EditableAudioClip name="电车铃 · 戴高乐机场出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+cdg.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.34} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {notre&&<EditableAudioClip name="电车铃 · 埃菲尔铁塔出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+notre.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.3} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {bcn&&<EditableAudioClip name="电车铃 · 巴塞罗那机场出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+bcn.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.33} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {mila&&<EditableAudioClip name="电车铃 · 巴特罗之家出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+mila.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.29} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {fco&&<EditableAudioClip name="电车铃 · 罗马机场出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+fco.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.32} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {vatican&&<EditableAudioClip name="电车铃 · 特莱维喷泉出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+vatican.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.28} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
 </>;
};
