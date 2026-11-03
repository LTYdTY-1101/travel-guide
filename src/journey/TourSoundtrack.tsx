import {useMemo} from 'react';
import {staticFile,useVideoConfig} from 'remotion';
import newMusic from '../../public/journey/feel-free-beats.json';
import {buildTour,OPENING_SECONDS,type TourProps} from './tour-data';
import {EditableAudioClip} from '../audio/EditableAudioClip';
import {BackgroundMusicTrack} from '../audio/BackgroundMusicTrack';

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
 const pvgEngine=snapToNewMusic(absolute('pvg--cdg')-.32),pvgPass=snapToNewMusic(absolute('pvg--cdg')+.42);
 const parisEngine=snapToNewMusic(absolute('notre-dame--bcn')-.32),parisPass=snapToNewMusic(absolute('notre-dame--bcn')+.48);
 const barcelonaEngine=snapToNewMusic(absolute('mila--fco')-.32),barcelonaPass=snapToNewMusic(absolute('mila--fco')+.56);
 const tramTimes=[cdg,notre,bcn,mila,fco,vatican].filter(Boolean).map(item=>snapToNewMusic(tourStart+item!.start+.22));
 const posterStart=OPENING_SECONDS+tour.seconds;
 const fireworkBursts=props.section==='full'?[3.38,4.13,5.63,6.38,7.13,8.63,9.38,10.13,11.63,12.38,13.13,14.63].map(value=>posterStart+value):[];
 const duckTimes=[...(intro?[2/30]:[]),...(pvg?[pvgPass]:[]),...(parisFlight?[parisPass]:[]),...(barcelonaFlight?[barcelonaPass]:[]),...tramTimes,...fireworkBursts];
 const musicTrim=intro?0:OPENING_SECONDS+tour.offset;
 return <>
  <BackgroundMusicTrack name="背景音乐 · Feel Free · Hans Atom" src={staticFile('audio/feel-free-ccmixter.mp3')} from={0} durationInFrames={durationInFrames} premountFor={fps} volume={props.musicVolume*.4} trimBeforeSeconds={musicTrim} fadeInSeconds={.65} fadeOutSeconds={1.8} duckAmount={.18} duckTimesSeconds={duckTimes}/>
  {intro&&<EditableAudioClip name="消息音 · 第一条消息首次出现" src={staticFile('audio/sfx/message-chime.wav')} from={Math.round(2/30/props.playbackSpeed*fps)} durationInFrames={Math.round(.62*fps)} premountFor={fps} volume={.42} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}

  {pvg&&<EditableAudioClip name="飞机 · 上海起飞引擎渐强" src={staticFile('audio/sfx/plane-engine.wav')} from={Math.round(pvgEngine/props.playbackSpeed*fps)} durationInFrames={Math.round((pvg.seconds+.32)/props.playbackSpeed*fps)} premountFor={fps} volume={.24} trimBeforeSeconds={0} fadeInSeconds={.9} fadeOutSeconds={.85} playbackRate={1} loop={false}/>}
  {pvg&&<EditableAudioClip name="飞机 · 上海离地掠过" src={staticFile('audio/sfx/takeoff-pass-shanghai.wav')} from={Math.round(pvgPass/props.playbackSpeed*fps)} durationInFrames={Math.round(1.9*fps)} premountFor={fps} volume={.34} trimBeforeSeconds={0} fadeInSeconds={.03} fadeOutSeconds={.3} playbackRate={1} loop={false}/>}
  {parisFlight&&<EditableAudioClip name="飞机 · 巴黎跨城引擎渐强" src={staticFile('audio/sfx/plane-engine.wav')} from={Math.round(parisEngine/props.playbackSpeed*fps)} durationInFrames={Math.round((parisFlight.seconds+.32)/props.playbackSpeed*fps)} premountFor={fps} volume={.2} trimBeforeSeconds={.55} fadeInSeconds={.72} fadeOutSeconds={.8} playbackRate={1} loop={false}/>}
  {parisFlight&&<EditableAudioClip name="飞机 · 巴黎离地掠过" src={staticFile('audio/sfx/takeoff-pass-paris.wav')} from={Math.round(parisPass/props.playbackSpeed*fps)} durationInFrames={Math.round(1.9*fps)} premountFor={fps} volume={.3} trimBeforeSeconds={0} fadeInSeconds={.03} fadeOutSeconds={.32} playbackRate={1} loop={false}/>}
  {barcelonaFlight&&<EditableAudioClip name="飞机 · 巴塞罗那跨城引擎渐强" src={staticFile('audio/sfx/plane-engine.wav')} from={Math.round(barcelonaEngine/props.playbackSpeed*fps)} durationInFrames={Math.round((barcelonaFlight.seconds+.32)/props.playbackSpeed*fps)} premountFor={fps} volume={.22} trimBeforeSeconds={1.05} fadeInSeconds={.78} fadeOutSeconds={.82} playbackRate={1} loop={false}/>}
  {barcelonaFlight&&<EditableAudioClip name="飞机 · 巴塞罗那离地掠过" src={staticFile('audio/sfx/takeoff-pass-barcelona.wav')} from={Math.round(barcelonaPass/props.playbackSpeed*fps)} durationInFrames={Math.round(1.9*fps)} premountFor={fps} volume={.32} trimBeforeSeconds={0} fadeInSeconds={.03} fadeOutSeconds={.32} playbackRate={1} loop={false}/>}

  {cdg&&<EditableAudioClip name="电车铃 · 戴高乐机场出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+cdg.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.34} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {notre&&<EditableAudioClip name="电车铃 · 埃菲尔铁塔出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+notre.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.3} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {bcn&&<EditableAudioClip name="电车铃 · 巴塞罗那机场出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+bcn.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.33} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {mila&&<EditableAudioClip name="电车铃 · 巴特罗之家出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+mila.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.29} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {fco&&<EditableAudioClip name="电车铃 · 罗马机场出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+fco.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.32} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
  {vatican&&<EditableAudioClip name="电车铃 · 特莱维喷泉出发" src={staticFile('audio/sfx/tram-double-bell.wav')} from={Math.round(snapToNewMusic(tourStart+vatican.start+.22)/props.playbackSpeed*fps)} durationInFrames={Math.round(.72*fps)} premountFor={fps} volume={.28} trimBeforeSeconds={0} fadeInSeconds={0} fadeOutSeconds={.08} playbackRate={1} loop={false}/>}
 </>;
};
