import {useMemo} from 'react';
import {Audio} from '@remotion/media';
import {staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {beat,buildTour,OPENING_SECONDS,type TourProps} from './tour-data';
import {smooth} from '../flight/flight-path';

// Outside the visual speed Sequence: music always plays at original speed/pitch.
export const TourSoundtrack:React.FC<TourProps>=(props)=>{
 const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const {stops,legs,section}=props,tour=useMemo(()=>buildTour({stops,legs,section}),[stops,legs,section]);
 const trim=props.section==='full'?0:OPENING_SECONDS+tour.offset;
 const fade=smooth(frame/(fps*.03))*(1-smooth((frame-durationInFrames+fps*1.1)/(fps*1.1)));
 const intro=props.section==='full';
 return <>
  <Audio name="配乐 · 参考视频原速乐句" src={staticFile('audio/reference/europe-reference-score.wav')} trimBefore={Math.round(trim*fps)} playbackRate={1} loop volume={props.musicVolume*fade} premountFor={fps}/>
  {intro&&<>
   <Audio name="音效 · 首条消息" src={staticFile('audio/message.wav')} from={Math.round(.06/props.playbackSpeed*fps)} volume={.16} premountFor={fps}/>
   <Audio name="音效 · GO 回应" src={staticFile('audio/message.wav')} from={Math.round(beat(3)/props.playbackSpeed*fps)} volume={.12} premountFor={fps}/>
   <Audio name="音效 · 消息翻面" src={staticFile('audio/whoosh.wav')} from={Math.round(beat(7)/props.playbackSpeed*fps)} volume={.09} premountFor={fps}/>
   <Audio name="音效 · 机票展开" src={staticFile('audio/whoosh.wav')} from={Math.round(beat(10)/props.playbackSpeed*fps)} volume={.10} premountFor={fps}/>
  </>}
  {tour.steps.filter(s=>s.kind==='hold').map(s=><Audio key={s.id} name={`音效 · ${s.to.name} 完整亮相`} src={staticFile('audio/pop.wav')} from={Math.round(((intro?OPENING_SECONDS:0)+s.start+s.to.revealDelay+.8)/props.playbackSpeed*fps)} volume={.08} premountFor={fps}/>)}
 </>;
};
