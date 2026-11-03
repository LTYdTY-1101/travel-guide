import type React from 'react';
import {Audio} from '@remotion/media';
import {Interactive,interpolate,useCurrentFrame,useVideoConfig,type InteractivitySchema} from 'remotion';

export type BackgroundMusicTrackProps={
 readonly src:string;
 readonly volume:number;
 readonly trimBeforeSeconds:number;
 readonly fadeInSeconds:number;
 readonly fadeOutSeconds:number;
 readonly duckAmount:number;
 readonly duckTimesSeconds:number[];
 readonly style?:React.CSSProperties;
};

const BackgroundMusicTrackInner:React.FC<BackgroundMusicTrackProps>=(p)=>{
 const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const seconds=frame/fps;
 const fadeIn=p.fadeInSeconds<=0?1:interpolate(frame,[0,p.fadeInSeconds*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const fadeOut=p.fadeOutSeconds<=0?1:interpolate(frame,[durationInFrames-p.fadeOutSeconds*fps,durationInFrames],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 let duck=0;
 for(const event of p.duckTimesSeconds){
  const attack=interpolate(seconds,[event-.08,event],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const release=interpolate(seconds,[event,event+.48],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  duck=Math.max(duck,Math.min(attack,release));
 }
 return <Audio
  name="背景音乐素材"
  src={p.src}
  trimBefore={Math.round(p.trimBeforeSeconds*fps)}
  volume={p.volume*fadeIn*fadeOut*(1-p.duckAmount*duck)}
  premountFor={fps}
  style={p.style}
 />;
};

const backgroundMusicTrackSchema={
 src:{type:'asset',assetType:'audio',default:'',description:'背景音乐素材'},
 volume:{type:'number',min:0,max:1,step:.01,default:.3,hiddenFromList:false,description:'背景音乐音量'},
 trimBeforeSeconds:{type:'number',min:0,max:160,step:.01,default:0,hiddenFromList:false,description:'音乐开头裁切（秒）'},
 fadeInSeconds:{type:'number',min:0,max:8,step:.05,default:.65,hiddenFromList:false,description:'音乐淡入（秒）'},
 fadeOutSeconds:{type:'number',min:0,max:8,step:.05,default:1.8,hiddenFromList:false,description:'音乐淡出（秒）'},
 duckAmount:{type:'number',min:0,max:.8,step:.01,default:.18,hiddenFromList:false,description:'音效出现时音乐压低量'},
 duckTimesSeconds:{type:'hidden'},
} as const satisfies InteractivitySchema;

export const BackgroundMusicTrack=Interactive.withSchema({
 Component:BackgroundMusicTrackInner,
 componentName:'<BackgroundMusicTrack>',
 schema:backgroundMusicTrackSchema,
 wrapInSequence:true,
});
