import type React from 'react';
import {Interactive, useCurrentFrame, useVideoConfig, type InteractivitySchema} from 'remotion';
import {onScreenMessageEntrance} from '../on-screen-messages.element';

type Props = {
  readonly message: string;
  readonly reply: string;
  readonly fontSize: number;
  readonly textColor: string;
  readonly bubbleColor: string;
  readonly borderColor: string;
  readonly borderWidth: number;
  readonly style?: React.CSSProperties;
};

const MessageNotificationInner: React.FC<Props> = ({message, reply, fontSize, textColor, bubbleColor, borderColor, borderWidth, style}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame() * 30 / fps;
  return <Interactive.Div style={{position: 'absolute', width: 900, height: 234, borderRadius: 42, backgroundColor: bubbleColor, border: `${borderWidth}px solid ${borderColor}`, boxShadow: '0 34px 80px rgba(55,58,92,.2)', backdropFilter: 'blur(28px)', display: 'flex', alignItems: 'center', boxSizing: 'border-box', padding: '30px 38px', gap: 29, color: textColor, fontFamily: 'PingFang SC, Arial, sans-serif', ...style}}>
    <Interactive.Div name="通知 · 苹果短信图标" style={{position: 'relative', flex: '0 0 auto', width: 106, height: 106, borderRadius: 25, background: 'linear-gradient(180deg,#66eb77,#19c943)', boxShadow: '0 10px 18px rgba(28,146,63,.2)', ...onScreenMessageEntrance(frame, 2, 10)}}>
      <div style={{position: 'absolute', left: 26, top: 29, width: 55, height: 45, borderRadius: '50%', backgroundColor: '#fff'}} />
      <div style={{position: 'absolute', left: 29, top: 67, width: 21, height: 21, rotate: '27deg', backgroundColor: '#fff'}} />
    </Interactive.Div>
    <Interactive.Div
      name="通知 · 对话文字"
      style={{
        flex: 1,
        minWidth: 0,
        fontSize,
        letterSpacing: -1,
        lineHeight: 1.12,
        color: textColor,
        fontWeight: 450,
        ...onScreenMessageEntrance(frame, 2, 10),
      }}
    >{message}</Interactive.Div>
    <Interactive.Div name="通知 · 回复 go" style={{flex: '0 0 auto', fontSize: Math.round(fontSize * .7), fontWeight: 780, color: '#2768c7', padding: '14px 22px', borderRadius: 23, background: 'rgba(210,229,255,.78)', ...onScreenMessageEntrance(frame, 37, 45)}}>{reply}</Interactive.Div>
  </Interactive.Div>
};

const schema = {
  message: {type: 'text-content', default: '国庆，欧洲？', description: '通知正文'},
  reply: {type: 'text-content', default: 'go', description: '简短回复'},
  fontSize: {type: 'number', hiddenFromList: false, default: 64, min: 32, max: 100, step: 1, description: '对话字号，可在帧上设置关键帧'},
  textColor: {type: 'color', default: '#1f2b43', description: '对话文字颜色'},
  bubbleColor: {type: 'color', default: '#f1f2f9', description: '通知卡背景颜色'},
  borderColor: {type: 'color', default: '#ffffff', description: '通知卡边框颜色'},
  borderWidth: {type: 'number', hiddenFromList: false, default: 10, min: 0, max: 30, step: 1, description: '通知卡边框粗细'},
} as const satisfies InteractivitySchema;

export const MessageNotification = Interactive.withSchema({Component: MessageNotificationInner, componentName: '<MessageNotification>', schema, wrapInSequence: true});
