import type React from 'react';
import {Audio} from '@remotion/media';
import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {LandmarkLayer} from './EditableLayers';

type LandmarkKind = 'eiffel' | 'louvre' | 'notre-dame' | 'sagrada' | 'casa' | 'colosseum' | 'pantheon' | 'vatican';

export type ShowcaseItem = {
  kind: LandmarkKind;
  title: string;
  image: string;
  width: number;
  height: number;
};

type Props = {
  city: string;
  map: string;
  items: readonly ShowcaseItem[];
  durationInFrames: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const p = clamp(value);
  return p * p * (3 - 2 * p);
};

const value = (time: number, keys: readonly (readonly [number, number])[]) => {
  if (time <= keys[0][0]) return keys[0][1];
  for (let index = 1; index < keys.length; index++) {
    if (time <= keys[index][0]) {
      const [startTime, startValue] = keys[index - 1];
      const [endTime, endValue] = keys[index];
      return startValue + (endValue - startValue) * smooth((time - startTime) / (endTime - startTime));
    }
  }
  return keys[keys.length - 1][1];
};

export const LandmarkShowcase: React.FC<Props> = ({city, map, items, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const slot = durationInFrames / items.length;
  const index = Math.min(items.length - 1, Math.floor(frame / slot));
  const item = items[index];
  const time = (frame - index * slot) / fps;
  const slotSeconds = slot / fps;
  const exitStart = slotSeconds - .62;
  const dim = value(time, [[0, 0], [.2, .21], [exitStart, .21], [slotSeconds, 0]]);
  const modelOpacity = value(time, [[0, 0], [.28, 0], [.68, 1], [exitStart + .08, 1], [slotSeconds, 0]]);
  const rise = value(time, [[0, 112], [.26, 112], [.9, -13], [1.1, 0], [exitStart, 0], [slotSeconds, 88]]);
  const tilt = value(time, [[0, -58], [.28, -58], [.86, 4], [1.12, 0], [exitStart, 0], [slotSeconds, -46]]);
  const modelScale = value(time, [[0, .81], [.28, .81], [.88, 1.035], [1.12, 1], [exitStart, 1], [slotSeconds, .87]]);
  const labelOpacity = value(time, [[0, 0], [.77, 0], [1.22, 1], [exitStart - .14, 1], [exitStart + .2, 0]]);
  const labelLift = value(time, [[0, 20], [.78, 20], [1.3, 0]]);
  const wobbleProgress = clamp((time - 1.12) / .82);
  const pinWobble = wobbleProgress >= 1 ? 0 : Math.sin(wobbleProgress * 4 * Math.PI) * 8 * (1 - wobbleProgress);
  const shadowOpacity = value(time, [[0, 0], [.26, 0], [1.02, .28], [exitStart, .28], [slotSeconds, 0]]);
  const scale = interpolate(frame, [0, durationInFrames], [1.13, 1.22], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.25, 0, .25, 1)});

  return (
    <Interactive.Div name={`${city} · 倾斜地图景点展示`} style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#d7d9d6', perspective: 1900}}>
      <Interactive.Div name={`${city} · 地图边缘延伸`} premountFor={fps} style={{position: 'absolute', inset: 0, scale: 1.22}}>
        <Img src={staticFile(map)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.55) contrast(.94)'}} />
      </Interactive.Div>
      <Interactive.Div name={`${city} · 缓慢推进的倾斜地图`} premountFor={fps} style={{position: 'absolute', left: -360, top: -650, width: 1800, height: 3200, transform: `perspective(1900px) rotateX(25deg) scale(${scale}) translateY(-22px)`, transformOrigin: '50% 54%', maskImage: 'linear-gradient(to bottom,transparent 0%,black 11%,black 100%)'}}>
        <Img src={staticFile(map)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(.55) contrast(.94)'}} />
      </Interactive.Div>
      <Interactive.Div name={`${city} · 地图压暗遮罩`} premountFor={fps} style={{position: 'absolute', inset: 0, backgroundColor: '#17243a', opacity: dim}} />
      <Interactive.Div name={`${item.title} · 底座接触投影`} premountFor={fps} style={{position: 'absolute', left: 540 - item.width * .45, top: 1232, width: item.width * .9, height: 94, borderRadius: '50%', backgroundColor: '#1d2635', filter: 'blur(31px)', opacity: shadowOpacity, transform: `scale(${value(time, [[0, .75], [1.05, 1], [exitStart, 1], [slotSeconds, .76]])})`}} />
      <LandmarkLayer name={`景点模型 · ${item.title}`} premountFor={fps} kind={item.kind} src={staticFile(item.image)} label={item.title} tilt={tilt} style={{left: 540 - item.width / 2, top: 1300 - item.height, width: item.width, height: item.height, opacity: modelOpacity, translate: `0px ${rise}px`, scale: modelScale, transformOrigin: '50% 100%'}} />
      <Interactive.Div name={`${item.title} · 白色圆角名称卡`} premountFor={fps} style={{position: 'absolute', left: '50%', top: 1328, transform: `translateX(-50%) translateY(${labelLift}px)`, minWidth: 300, height: 94, padding: '0 34px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, borderRadius: 23, backgroundColor: 'rgba(255,255,255,.96)', boxShadow: '0 18px 44px rgba(27,43,62,.22)', opacity: labelOpacity}}>
        <Interactive.Div name={`${item.title} · 独立摇摆定位图标`} premountFor={fps} style={{width: 33, height: 44, flex: '0 0 auto', transform: `rotate(${pinWobble}deg)`, transformOrigin: '50% 100%'}}>
          <svg width="33" height="44" viewBox="0 0 33 44" fill="none" aria-hidden="true"><path d="M16.5 1.5C8.4 1.5 1.8 8.1 1.8 16.2c0 11.2 14.7 25.3 14.7 25.3s14.7-14.1 14.7-25.3C31.2 8.1 24.6 1.5 16.5 1.5Z" fill="#E9423B" stroke="white" strokeWidth="2.2"/><circle cx="16.5" cy="16" r="5.5" fill="white"/></svg>
        </Interactive.Div>
        <Interactive.Div name={`${item.title} · 名称文字`} premountFor={fps} style={{fontFamily: 'PingFang SC, Microsoft YaHei, Arial, sans-serif', fontSize: 39, fontWeight: 750, whiteSpace: 'nowrap', color: '#17243a'}}>{item.title}</Interactive.Div>
      </Interactive.Div>
      <Interactive.Div name={`${city} · 地图来源`} style={{position: 'absolute', right: 20, bottom: 18, padding: '7px 10px', borderRadius: 7, color: '#4b5663', backgroundColor: 'rgba(255,255,255,.78)', font: '14px Arial, sans-serif'}}>© Esri, HERE, Garmin, OpenStreetMap contributors</Interactive.Div>
      {items.map((landmark, itemIndex) => <Audio key={landmark.kind} name={`SFX · ${landmark.title} 升起`} from={Math.round(itemIndex * slot + .45 * fps)} src={staticFile('audio/pop.wav')} volume={.27} premountFor={fps} />)}
    </Interactive.Div>
  );
};
