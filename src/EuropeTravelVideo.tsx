import {AbsoluteFill,Freeze,Sequence,useCurrentFrame,useVideoConfig} from 'remotion';
import {Scene01Messages} from './scenes/Scenes';
import {EuropeTourScene} from './journey/EuropeTourScene';
import {TourSoundtrack} from './journey/TourSoundtrack';
import {OPENING_SECONDS,openingLegacySeconds,type TourProps} from './journey/tour-data';

const TourOpening:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 return <Freeze frame={Math.round(openingLegacySeconds(frame/fps)*fps)}><Scene01Messages vectorOpening muteSfx /></Freeze>;
};
export const EuropeTravelVideo:React.FC<TourProps>=(props)=>{
 const {fps}=useVideoConfig();
 return <AbsoluteFill style={{backgroundColor:'#f4f0e7'}}>
  <Sequence name="六站旅程 · 画面速度" playbackRate={props.playbackSpeed}>
   {(props.section==='full'||props.section==='paris-stage')&&<Sequence name="开场 · 消息、地图翻转与机票" durationInFrames={Math.round(OPENING_SECONDS*fps)} premountFor={fps}><TourOpening/></Sequence>}
   <EuropeTourScene {...props}/>
  </Sequence>
  <TourSoundtrack {...props}/>
 </AbsoluteFill>;
};
