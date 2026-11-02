import type React from 'react';
import {Img, Interactive, staticFile, type InteractivitySchema} from 'remotion';

type Props = {
  readonly message: string;
  readonly title?: string;
  readonly timeText?: string;
  readonly fontSize: number;
  readonly fontWeight?: number;
  readonly fontFamily?: string;
  readonly lineHeight?: number;
  readonly letterSpacing?: number;
  readonly textColor: string;
  readonly titleFontSize?: number;
  readonly titleFontWeight?: number;
  readonly titleColor?: string;
  readonly timeFontSize?: number;
  readonly timeFontWeight?: number;
  readonly timeColor?: string;
  readonly iconSrc?: string;
  readonly iconSize?: number;
  readonly iconRadius?: number;
  readonly iconOpacity?: number;
  readonly iconZoom?: number;
  readonly iconOffsetX?: number;
  readonly iconOffsetY?: number;
  readonly iconFit?: 'contain' | 'cover' | 'fill';
  readonly bubbleColor: string;
  readonly borderColor: string;
  readonly borderWidth: number;
  readonly blur?: number;
  readonly paddingX?: number;
  readonly paddingY?: number;
  readonly gap?: number;
  readonly rowGap?: number;
  readonly shadow?: string;
  readonly style?: React.CSSProperties;
};

const MessageNotificationInner: React.FC<Props> = ({
  message, title = 'Messages', timeText = '现在', fontSize, fontWeight = 400,
  fontFamily = 'PingFang SC, Arial, sans-serif', lineHeight = 1.3, letterSpacing = 0,
  textColor, titleFontSize = 30, titleFontWeight = 700, titleColor = '#121216',
  timeFontSize = 18, timeFontWeight = 400, timeColor = '#9595a3',
  iconSrc = staticFile('icons/messages-reference.png'), iconSize = 112, iconRadius = 26,
  iconOpacity = 1, iconZoom = 1.142857, iconOffsetX = 0, iconOffsetY = 0, iconFit = 'contain',
  bubbleColor, borderColor, borderWidth, blur = 28, paddingX = 44, paddingY = 30,
  gap = 36, rowGap = 12, shadow = '0 24px 65px rgba(55,58,92,.18)', style,
}) => (
  <Interactive.Div style={{position: 'absolute', width: 900, height: 182,
    borderRadius: 44, backgroundColor: bubbleColor, border: `${borderWidth}px solid ${borderColor}`,
    boxShadow: shadow, backdropFilter: `blur(${blur}px)`, display: 'flex', alignItems: 'center',
    boxSizing: 'border-box', padding: `${paddingY}px ${paddingX}px`, gap,
    fontFamily, color: textColor, ...style}}>
    <Interactive.Div name="通知 · 图标容器" style={{position: 'relative', flex: '0 0 auto',
      width: iconSize, height: iconSize, borderRadius: iconRadius, overflow: 'hidden'}}>
      <Img name="通知 · 可替换短信截图" src={iconSrc} style={{position: 'absolute',
        left: `calc(50% + ${iconOffsetX}px)`, top: `calc(50% + ${iconOffsetY}px)`,
        width: `${iconZoom * 100}%`, height: `${iconZoom * 100}%`,
        translate: '-50% -50%', objectFit: iconFit, opacity: iconOpacity}} />
    </Interactive.Div>
    <Interactive.Div name="通知 · 两行排版" style={{flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: rowGap}}>
      <Interactive.Div name="通知 · 标题与时间" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
        <Interactive.Div name="通知 · Messages 标题" style={{fontSize: titleFontSize, fontWeight: titleFontWeight, color: titleColor, lineHeight: 1.2}}>{title}</Interactive.Div>
        <Interactive.Div name="通知 · 时间" style={{fontSize: timeFontSize, fontWeight: timeFontWeight, color: timeColor, lineHeight: 1.2}}>{timeText}</Interactive.Div>
      </Interactive.Div>
      <Interactive.Div name="通知 · 消息正文" style={{fontSize, fontWeight, lineHeight, letterSpacing, color: textColor, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'}}>{message}</Interactive.Div>
    </Interactive.Div>
  </Interactive.Div>
);

const schema = {
  'style.width': {type: 'number', hiddenFromList: false, default: 900, min: 480, max: 1080, step: 10, description: '气泡宽度（像素）'},
  title: {type: 'text-content', default: 'Messages', description: '第一行 · 标题'},
  message: {type: 'text-content', default: '国庆，欧洲走不走？', description: '第二行 · 消息正文'},
  timeText: {type: 'text-content', default: '现在', description: '右上角时间'},
  fontFamily: {type: 'font-family', default: 'PingFang SC, Arial, sans-serif', description: '通知字体'},
  fontSize: {type: 'number', hiddenFromList: false, default: 32, min: 8, max: 120, step: 1, description: '正文字号'},
  fontWeight: {type: 'font-weight', default: 400, description: '正文字重'},
  lineHeight: {type: 'number', hiddenFromList: false, default: 1.3, min: .5, max: 3, step: .05, description: '正文行高'},
  letterSpacing: {type: 'number', hiddenFromList: false, default: 0, min: -5, max: 20, step: .5, description: '正文字距'},
  textColor: {type: 'color', default: '#1f2b43', description: '正文颜色'},
  titleFontSize: {type: 'number', hiddenFromList: false, default: 30, min: 8, max: 120, step: 1, description: '标题字号'},
  titleFontWeight: {type: 'font-weight', default: 700, description: '标题字重'},
  titleColor: {type: 'color', default: '#121216', description: '标题颜色'},
  timeFontSize: {type: 'number', hiddenFromList: false, default: 18, min: 8, max: 80, step: 1, description: '时间字号'},
  timeFontWeight: {type: 'font-weight', default: 400, description: '时间字重'},
  timeColor: {type: 'color', default: '#9595a3', description: '时间颜色'},
  iconSrc: {type: 'asset', assetType: 'image', default: '', description: '短信图标 · 替换图片'},
  iconSize: {type: 'number', hiddenFromList: false, default: 112, min: 16, max: 300, step: 1, description: '图标尺寸'},
  iconRadius: {type: 'number', hiddenFromList: false, default: 26, min: 0, max: 150, step: 1, description: '图标圆角'},
  iconOpacity: {type: 'number', hiddenFromList: false, default: 1, min: 0, max: 1, step: .01, description: '图标透明度'},
  iconZoom: {type: 'number', hiddenFromList: false, default: 1.142857, min: .1, max: 4, step: .01, description: '图片缩放 · 去除截图透明留白'},
  iconOffsetX: {type: 'number', hiddenFromList: false, default: 0, min: -300, max: 300, step: 1, description: '图片水平偏移'},
  iconOffsetY: {type: 'number', hiddenFromList: false, default: 0, min: -300, max: 300, step: 1, description: '图片垂直偏移'},
  iconFit: {type: 'enum', default: 'contain', variants: {contain: {}, cover: {}, fill: {}}, description: '图片填充方式'},
  bubbleColor: {type: 'color', default: 'rgba(241,242,249,.8)', description: '通知背景 · 含透明度'},
  borderColor: {type: 'color', default: 'rgba(255,255,255,.6)', description: '边框颜色'},
  borderWidth: {type: 'number', hiddenFromList: false, default: 3, min: 0, max: 30, step: 1, description: '边框粗细'},
  blur: {type: 'number', hiddenFromList: false, default: 28, min: 0, max: 100, step: 1, description: '毛玻璃模糊'},
  shadow: {type: 'text-content', default: '0 24px 65px rgba(55,58,92,.18)', description: '卡片阴影（CSS）'},
  paddingX: {type: 'number', hiddenFromList: false, default: 44, min: 0, max: 120, step: 1, description: '水平内边距'},
  paddingY: {type: 'number', hiddenFromList: false, default: 30, min: 0, max: 100, step: 1, description: '垂直内边距'},
  gap: {type: 'number', hiddenFromList: false, default: 36, min: 0, max: 120, step: 1, description: '图标与文字间距'},
  rowGap: {type: 'number', hiddenFromList: false, default: 12, min: 0, max: 60, step: 1, description: '标题与正文间距'},
  ...Interactive.backgroundSchema,
  ...Interactive.borderRadiusSchema,
} as const satisfies InteractivitySchema;

export const MessageNotification = Interactive.withSchema({Component: MessageNotificationInner, componentName: '<MessageNotification>', schema, wrapInSequence: true});

type ReplyProps = {readonly text: string; readonly tail?: boolean; readonly style?: React.CSSProperties};
const MessageReplyInner: React.FC<ReplyProps> = ({text, tail = true, style}) => (
  <Interactive.Div style={{position: 'absolute', width: 'fit-content', padding: '20px 36px',
    backgroundColor: '#248bf5', color: '#fff', fontSize: 54, fontWeight: 600,
    fontFamily: 'PingFang SC, Arial, sans-serif', lineHeight: 1.25, borderRadius: 37,
    boxShadow: '0 18px 42px rgba(40,80,140,.16)', ...style}}>
    {tail && <div style={{position: 'absolute', right: -12, bottom: 0, width: 32, height: 32,
      backgroundColor: style?.backgroundColor ?? '#248bf5', clipPath: "path('M0 0h20v16c0 8 4 13 12 16C14 32 0 25 0 16Z')"}} />}
    {text}
  </Interactive.Div>
);
const replySchema = {
  text: {type: 'text-content', default: 'GO', description: '独立回复文字'},
  tail: {type: 'boolean', default: true, description: '显示气泡尾巴'},
  ...Interactive.textSchema,
  ...Interactive.backgroundSchema,
  ...Interactive.borderSchema,
  ...Interactive.borderRadiusSchema,
} as const satisfies InteractivitySchema;
export const MessageReply = Interactive.withSchema({Component: MessageReplyInner, componentName: '<MessageReply>', schema: replySchema, wrapInSequence: true});
