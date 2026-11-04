import type React from 'react';
import {Audio} from '@remotion/media';
import {staticFile} from 'remotion';

export const PosterFireworkSoundtrack:React.FC<{entryEnabled:boolean;holdSeconds:number}>=({entryEnabled})=>{
 if(!entryEnabled)return <Audio
  name="SFX · 最终烟花（可拖拽、拉伸、裁切与调音量）"
  from={0}
  durationInFrames={360}
  premountFor={30}
  src={staticFile('audio/sfx/final-fireworks.wav')}
  volume={.78}
  trimBefore={0}
  playbackRate={1}
  loop
 />;
 return <Audio
  name="SFX · 最终烟花（可拖拽、拉伸、裁切与调音量）"
  from={90}
  durationInFrames={378}
  premountFor={30}
  src={staticFile('audio/sfx/final-fireworks.wav')}
  volume={.78}
  trimBefore={0}
  playbackRate={1}
  loop
 />;
};
