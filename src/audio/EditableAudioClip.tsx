import type React from 'react';
import {Audio} from '@remotion/media';
import {Interactive,interpolate,useCurrentFrame,useVideoConfig,type InteractivitySchema} from 'remotion';

export type EditableAudioClipProps={
 readonly src:string;
 readonly volume:number;
 readonly trimBeforeSeconds:number;
 readonly fadeInSeconds:number;
 readonly fadeOutSeconds:number;
 readonly clipPlaybackRate?:number;
 readonly loopAsset?:boolean;
 readonly style?:React.CSSProperties;
};

const EditableAudioClipInner:React.FC<EditableAudioClipProps>=(p)=>{
 const frame=useCurrentFrame(),{fps,durationInFrames}=useVideoConfig();
 const fadeIn=p.fadeInSeconds<=0?1:interpolate(frame,[0,p.fadeInSeconds*fps],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const fadeOut=p.fadeOutSeconds<=0?1:interpolate(frame,[durationInFrames-p.fadeOutSeconds*fps,durationInFrames],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return <Audio
  name="可编辑音频素材"
  src={p.src}
  trimBefore={Math.round(p.trimBeforeSeconds*fps)}
  volume={p.volume*fadeIn*fadeOut}
  playbackRate={p.clipPlaybackRate??1}
  loop={p.loopAsset??false}
  premountFor={fps}
  style={p.style}
 />;
};

const editableAudioClipSchema={
 src:{type:'asset',assetType:'audio',default:'',description:'音频素材'},
 volume:{type:'number',min:0,max:1.5,step:.01,default:.3,hiddenFromList:false,description:'音量'},
 trimBeforeSeconds:{type:'number',min:0,max:60,step:.01,default:0,hiddenFromList:false,description:'素材开头裁切（秒）'},
 fadeInSeconds:{type:'number',min:0,max:5,step:.01,default:0,hiddenFromList:false,description:'淡入时长（秒）'},
 fadeOutSeconds:{type:'number',min:0,max:5,step:.01,default:.15,hiddenFromList:false,description:'淡出时长（秒）'},
 clipPlaybackRate:{type:'number',min:.25,max:4,step:.01,default:1,hiddenFromList:false,description:'音效播放速度'},
 loopAsset:{type:'boolean',default:false,description:'循环播放'},
} as const satisfies InteractivitySchema;

export const EditableAudioClip=Interactive.withSchema({
 Component:EditableAudioClipInner,
 componentName:'<EditableAudioClip>',
 schema:editableAudioClipSchema,
 wrapInSequence:true,
});
