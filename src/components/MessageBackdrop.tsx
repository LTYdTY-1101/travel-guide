import type React from 'react';
import {Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';

type Props = {
  readonly topColor: string; readonly bottomColor: string; readonly highlightColor: string;
  readonly purpleColor: string; readonly blueColor: string; readonly glowBlur: number;
  readonly style?: React.CSSProperties;
};
const MessageBackdropInner: React.FC<Props> = ({topColor, bottomColor, highlightColor, purpleColor, blueColor, glowBlur, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <Interactive.Div style={{position: 'absolute', inset: 0, ...style}}>
    <Interactive.Div name="背景 · 渐变底色" style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 18% 20%,${highlightColor},transparent 36%), radial-gradient(circle at 78% 69%,${purpleColor},transparent 43%), linear-gradient(145deg,${topColor},${bottomColor})`}} />
    <Interactive.Div name="背景 · 紫色光影" style={{position: 'absolute', width: 880, height: 880, left: -220, top: 980, borderRadius: '50%', background: `radial-gradient(circle,${purpleColor},transparent 76%)`, filter: `blur(${glowBlur}px)`, translate: interpolate(frame, [0, 4 * fps], ['0px 40px', '180px -30px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.16, 1, .3, 1)})}} />
    <Interactive.Div name="背景 · 蓝色光影" style={{position: 'absolute', width: 780, height: 920, left: 570, top: 80, borderRadius: '50%', background: `radial-gradient(circle,${blueColor},transparent 78%)`, filter: `blur(${glowBlur}px)`, translate: interpolate(frame, [0, 4 * fps], ['80px -60px', '-150px 130px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.16, 1, .3, 1)})}} />
  </Interactive.Div>;
};
const schema = {
  topColor: {type: 'color', default: '#e4e4f0', description: '背景渐变 · 起始颜色'},
  bottomColor: {type: 'color', default: '#c2bfd8', description: '背景渐变 · 结束颜色'},
  highlightColor: {type: 'color', default: 'rgba(255,255,255,.67)', description: '高光颜色及透明度'},
  purpleColor: {type: 'color', default: 'rgba(160,153,194,.56)', description: '紫色光影及透明度'},
  blueColor: {type: 'color', default: 'rgba(113,125,187,.32)', description: '蓝色光影及透明度'},
  glowBlur: {type: 'number', hiddenFromList: false, default: 70, min: 0, max: 180, step: 1, description: '光影模糊'},
  ...Interactive.backgroundSchema,
} as const satisfies InteractivitySchema;
export const MessageBackdrop = Interactive.withSchema({Component: MessageBackdropInner, componentName: '<MessageBackdrop>', schema, wrapInSequence: true});
