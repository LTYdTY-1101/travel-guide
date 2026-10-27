import type React from 'react';
import {Easing, Img, Interactive, interpolate, useCurrentFrame, useVideoConfig, type InteractivitySchema, type InteractiveTransformProps} from 'remotion';

type LocationLowerThirdProps = InteractiveTransformProps & {
  readonly location: string;
  readonly icon: 'pin' | 'plane' | 'flag';
  readonly customIcon: string;
  readonly iconSize: number;
  readonly iconColor: string;
  readonly fontSize: number;
  readonly textColor: string;
  readonly fontFamily: string;
};

const LocationLowerThirdInner: React.FC<LocationLowerThirdProps> = ({style, location, icon, customIcon, iconSize, iconColor, fontSize, textColor, fontFamily}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Interactive.Div name="地点标签容器" showInTimeline={false} style={{position: 'relative', width: 960, minHeight: 138, display: 'flex', alignItems: 'center', gap: 24, paddingLeft: 56, paddingRight: 24, boxSizing: 'border-box', fontFamily, ...style}}>
    <Interactive.Div name="地点图标" showInTimeline={false} style={{width: iconSize, height: iconSize * 1.25, flexShrink: 0, filter: 'drop-shadow(0 6px 8px rgba(24,24,27,.14))', opacity: interpolate(frame, [0, .3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0, .53 * fps], ['0px -10px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}), scale: interpolate(frame, [0, .53 * fps], [.88, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})}}>
      {customIcon ? <Img src={customIcon} style={{width: '100%', height: '100%', objectFit: 'contain'}} /> : <svg viewBox="0 0 64 80" width="100%" height="100%" style={{overflow: 'visible'}}>
        <path d={icon === 'pin' ? 'M32 3C15.4 3 4 15.4 4 31C4 50.8 22.1 69.6 29.3 76.2C30.8 77.6 33.2 77.6 34.7 76.2C41.9 69.6 60 50.8 60 31C60 15.4 48.6 3 32 3Z' : icon === 'flag' ? 'M13 75V8C27 0 39 19 56 8V45C39 56 27 37 13 45Z' : 'M4 38L58 8L38 70L27 47L4 38ZM27 47L58 8'} pathLength={1} fill={iconColor} fillOpacity={interpolate(frame, [fps / 6, .6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} stroke={iconColor} strokeWidth={2.5} strokeDasharray={1} strokeDashoffset={interpolate(frame, [0, .53 * fps], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} strokeLinecap="round" strokeLinejoin="round" />
        {icon === 'pin' && <circle cx={32} cy={30} r={interpolate(frame, [fps / 3, .7 * fps], [0, 9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)})} fill="#eff6ff" />}
      </svg>}
    </Interactive.Div>
    <Interactive.Div name="地点文字" showInTimeline={false} cropRight={interpolate(frame, [14 / 30 * fps, 38 / 30 * fps], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 200, stiffness: 100})})} style={{minWidth: 0, color: textColor, fontSize, fontWeight: 700, letterSpacing: -1, whiteSpace: 'nowrap', opacity: interpolate(frame, [14 / 30 * fps, 22 / 30 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{location}</Interactive.Div>
  </Interactive.Div>;
};

const schema = {
  location: {type: 'text-content', default: '法国 · 巴黎', description: '地点文字'},
  icon: {type: 'enum', default: 'pin', variants: {pin: {}, plane: {}, flag: {}}, description: '图标：pin 定位针 / plane 飞机 / flag 旗帜'},
  customIcon: {type: 'asset', assetType: 'image', default: '', description: '自定义图标（留空使用上面的内置图标）'},
  iconSize: {type: 'number', default: 104, min: 24, max: 220, step: 1, description: '图标大小', hiddenFromList: false},
  iconColor: {type: 'color', default: '#2563eb', description: '内置图标颜色'},
  fontSize: {type: 'number', default: 54, min: 20, max: 120, step: 1, description: '文字字号', hiddenFromList: false},
  textColor: {type: 'color', default: '#18181b', description: '文字颜色'},
  fontFamily: {type: 'font-family', default: 'PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif', description: '字体'},
} as const satisfies InteractivitySchema;

export const LocationLowerThird = Interactive.withSchema({Component: LocationLowerThirdInner, componentName: '<LocationLowerThird>', schema, wrapInSequence: true});
