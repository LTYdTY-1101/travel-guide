import type React from 'react';
import {staticFile,useVideoConfig} from 'remotion';
import {EditableAudioClip} from './EditableAudioClip';

export const PosterFireworkSoundtrack:React.FC<{entryEnabled:boolean;holdSeconds:number}>=({entryEnabled,holdSeconds})=>{
 const {fps}=useVideoConfig(),base=entryEnabled?3:0;
 const durationSeconds=holdSeconds+(entryEnabled?.6:0);
 return <EditableAudioClip
  name="参考视频 · 烟花升空、爆炸与噼啪（已去背景音乐）"
  from={Math.round(base*fps)}
  durationInFrames={Math.max(1,Math.round(durationSeconds*fps))}
  premountFor={fps}
  src={staticFile('audio/reference/reference-fireworks-clean.wav')}
  volume={.54}
  trimBeforeSeconds={0}
  fadeInSeconds={0}
  fadeOutSeconds={.18}
  clipPlaybackRate={1}
  loopAsset={true}
 />;
};
