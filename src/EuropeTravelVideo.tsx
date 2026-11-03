import {useState} from 'react';
import {AbsoluteFill,Sequence,useVideoConfig} from 'remotion';
import {Scene01Messages} from './scenes/Scenes';
import {EuropeTourScene} from './journey/EuropeTourScene';
import {TourSoundtrack} from './journey/TourSoundtrack';
import {OPENING_SECONDS,type TourProps} from './journey/tour-data';

const TourOpening:React.FC<{mapReady:boolean}>=({mapReady})=><Scene01Messages vectorOpening muteSfx mapReady={mapReady} />;
export const EuropeTravelVideo:React.FC<TourProps>=(props)=>{
 const {fps}=useVideoConfig();
 const [mapReady,setMapReady]=useState(false);
 return <AbsoluteFill style={{backgroundColor:'#f4f0e7'}}>
  <Sequence name="六站旅程 · 画面速度" playbackRate={props.playbackSpeed}>
   {(props.section==='full'||props.section==='paris-stage')&&<Sequence name="开场 · 消息、地图翻转与机票" durationInFrames={Math.round(OPENING_SECONDS*fps)} premountFor={fps}><TourOpening mapReady={mapReady}/></Sequence>}
   <EuropeTourScene {...props} onMapReady={setMapReady}/>
  </Sequence>
  <TourSoundtrack {...props}/>
 </AbsoluteFill>;
};
