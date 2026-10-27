import type React from 'react';
import {
  Img,
  Interactive,
  type InteractivitySchema,
} from 'remotion';

type WithStyle = {readonly style?: React.CSSProperties};

type MapLayerProps = WithStyle & {
  readonly src: string;
  readonly label: string;
  readonly tint: string;
};

const MapLayerInner: React.FC<MapLayerProps> = ({src, label, tint, style}) => {
  return (
    <Interactive.Div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: tint,
        ...style,
      }}
    >
      {src ? (
        <Img
          src={src}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(28deg, transparent 47%, rgba(243,176,71,.34) 48%, rgba(243,176,71,.34) 49%, transparent 50%), linear-gradient(94deg, transparent 46%, rgba(255,255,255,.95) 47%, rgba(255,255,255,.95) 50%, transparent 51%), linear-gradient(4deg, transparent 44%, rgba(192,204,215,.7) 45%, rgba(192,204,215,.7) 47%, transparent 48%)',
              backgroundSize: '190px 160px, 230px 180px, 150px 140px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 620,
              height: 1680,
              left: 470,
              top: 80,
              rotate: '-8deg',
              borderRadius: '52% 42% 55% 46%',
              background: 'linear-gradient(90deg,#8fd1f0,#58b8e8)',
              boxShadow: '0 0 0 18px rgba(255,255,255,.6)',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 22% 28%, rgba(172,216,156,.55) 0 5%, transparent 5.5%), radial-gradient(circle at 78% 62%, rgba(172,216,156,.45) 0 7%, transparent 7.5%), radial-gradient(circle at 48% 74%, rgba(172,216,156,.4) 0 6%, transparent 6.5%)',
            }}
          />
        </>
      )}
      <div
        style={{
          position: 'absolute',
          left: 54,
          bottom: 42,
          padding: '12px 20px',
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,.82)',
          color: '#546273',
          fontFamily: 'Arial, sans-serif',
          fontSize: 26,
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
    </Interactive.Div>
  );
};

const mapLayerSchema = {
  src: {
    type: 'asset',
    assetType: 'image',
    default: '',
    description: '真实地图图片；可替换为 Google Static Maps 导出图',
  },
  label: {type: 'text-content', default: '', description: '地图标签'},
  tint: {type: 'color', default: '#edf4ed', description: '占位地图底色'},
} as const satisfies InteractivitySchema;

export const MapLayer = Interactive.withSchema({
  Component: MapLayerInner,
  componentName: '<MapLayer>',
  schema: mapLayerSchema,
  wrapInSequence: true,
});

type MessageBubbleProps = WithStyle & {
  readonly text: string;
  readonly showMessagesIcon: boolean;
  readonly bubbleColor: string;
};

const MessageBubbleInner: React.FC<MessageBubbleProps> = ({
  text,
  showMessagesIcon,
  bubbleColor,
  style,
}) => {
  return (
    <Interactive.Div
      style={{
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '24px 34px',
        borderRadius: 34,
        color: '#10233d',
        backgroundColor: bubbleColor,
        boxShadow: '0 22px 60px rgba(72,101,135,.18)',
        backdropFilter: 'blur(28px)',
        fontFamily: 'Arial, PingFang SC, sans-serif',
        fontSize: 54,
        fontWeight: 750,
        ...style,
      }}
    >
      {showMessagesIcon ? (
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 18,
            background: 'linear-gradient(180deg,#50e769,#18c934)',
            position: 'relative',
            flex: '0 0 auto',
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 46,
              height: 38,
              left: 15,
              top: 16,
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              left: 17,
              top: 43,
              rotate: '26deg',
              backgroundColor: 'white',
            }}
          />
        </div>
      ) : null}
      {text}
    </Interactive.Div>
  );
};

const messageBubbleSchema = {
  text: {type: 'text-content', default: '', description: '消息文字'},
  showMessagesIcon: {type: 'boolean', default: true, description: '显示苹果信息图标'},
  bubbleColor: {type: 'color', default: 'rgba(255,255,255,.78)', description: '气泡颜色'},
  ...Interactive.borderRadiusSchema,
} as const satisfies InteractivitySchema;

export const MessageBubble = Interactive.withSchema({
  Component: MessageBubbleInner,
  componentName: '<MessageBubble>',
  schema: messageBubbleSchema,
  wrapInSequence: true,
});

type InfoCardProps = WithStyle & {
  readonly title: string;
  readonly subtitle: string;
  readonly route: string;
  readonly accentColor: string;
};

const InfoCardInner: React.FC<InfoCardProps> = ({title, subtitle, route, accentColor, style}) => (
  <Interactive.Div
    style={{
      position: 'absolute',
      padding: '42px 48px',
      borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,.94)',
      boxShadow: '0 28px 74px rgba(50,67,88,.18)',
      color: '#10233d',
      fontFamily: 'Arial, PingFang SC, sans-serif',
      ...style,
    }}
  >
    <div style={{fontSize: 64, fontWeight: 850, letterSpacing: -2}}>{title}</div>
    <div style={{fontSize: 28, letterSpacing: 5, color: '#667587', marginTop: 15}}>{subtitle}</div>
    <div style={{height: 2, backgroundColor: '#e4e8ed', margin: '28px 0'}} />
    <div style={{display: 'flex', alignItems: 'center', gap: 20, fontSize: 38, fontWeight: 780}}>
      {route}
      <span style={{color: accentColor, fontSize: 50}}>✈</span>
    </div>
  </Interactive.Div>
);

const infoCardSchema = {
  title: {type: 'text-content', default: '', description: '主标题'},
  subtitle: {type: 'text-content', default: '', description: '辅助信息'},
  route: {type: 'text-content', default: '', description: '航线'},
  accentColor: {type: 'color', default: '#f04438', description: '强调色'},
  ...Interactive.backgroundSchema,
  ...Interactive.borderRadiusSchema,
} as const satisfies InteractivitySchema;

export const InfoCard = Interactive.withSchema({
  Component: InfoCardInner,
  componentName: '<InfoCard>',
  schema: infoCardSchema,
  wrapInSequence: true,
});

type RouteLayerProps = WithStyle & {
  readonly path: string;
  readonly progress: number;
  readonly color: string;
  readonly width: number;
};

const RouteLayerInner: React.FC<RouteLayerProps> = ({path, progress, color, width, style}) => (
  <Interactive.Svg
    viewBox="0 0 1080 1920"
    style={{position: 'absolute', inset: 0, overflow: 'visible', ...style}}
  >
    <Interactive.Path
      name="Route path"
      d={path}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeDasharray={1800}
      strokeDashoffset={1800 * (1 - progress)}
    />
  </Interactive.Svg>
);

const routeLayerSchema = {
  path: {type: 'svg-path', default: 'M 120 900 C 420 500 700 1300 960 700', description: '路线形状'},
  progress: {type: 'number', min: 0, max: 1, step: 0.01, default: 1, description: '路线绘制进度', hiddenFromList: false},
  color: {type: 'color', default: '#ef3b32', description: '路线颜色'},
  width: {type: 'number', min: 2, max: 32, step: 1, default: 10, description: '路线粗细', hiddenFromList: false},
} as const satisfies InteractivitySchema;

export const RouteLayer = Interactive.withSchema({
  Component: RouteLayerInner,
  componentName: '<RouteLayer>',
  schema: routeLayerSchema,
  wrapInSequence: true,
});

type PinProps = WithStyle & {readonly label: string; readonly color: string};
const PinInner: React.FC<PinProps> = ({label, color, style}) => (
  <Interactive.Div
    style={{position: 'absolute', display: 'flex', alignItems: 'center', gap: 16, ...style}}
  >
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: '50% 50% 50% 0',
        rotate: '-45deg',
        backgroundColor: color,
        border: '7px solid white',
        boxShadow: '0 10px 22px rgba(0,0,0,.2)',
      }}
    />
    <div
      style={{
        padding: '12px 18px',
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,.92)',
        fontFamily: 'Arial, PingFang SC, sans-serif',
        fontSize: 28,
        fontWeight: 800,
        color: '#17263b',
      }}
    >
      {label}
    </div>
  </Interactive.Div>
);

const pinSchema = {
  label: {type: 'text-content', default: '', description: '地点名称'},
  color: {type: 'color', default: '#ef3b32', description: '定位点颜色'},
} as const satisfies InteractivitySchema;

export const Pin = Interactive.withSchema({
  Component: PinInner,
  componentName: '<Pin>',
  schema: pinSchema,
  wrapInSequence: true,
});

type PlaneProps = WithStyle & {readonly color: string};
const PlaneInner: React.FC<PlaneProps> = ({color, style}) => (
  <Interactive.Div
    style={{
      position: 'absolute',
      fontSize: 86,
      lineHeight: 1,
      color,
      textShadow: '0 12px 20px rgba(55,78,104,.28)',
      ...style,
    }}
  >
    ✈
  </Interactive.Div>
);

const planeSchema = {
  color: {type: 'color', default: '#ffffff', description: '飞机颜色'},
} as const satisfies InteractivitySchema;

export const Plane = Interactive.withSchema({
  Component: PlaneInner,
  componentName: '<Plane>',
  schema: planeSchema,
  wrapInSequence: true,
});

export type LandmarkKind =
  | 'eiffel'
  | 'louvre'
  | 'notre-dame'
  | 'sagrada'
  | 'casa'
  | 'colosseum'
  | 'pantheon'
  | 'vatican';

type LandmarkLayerProps = WithStyle & {
  readonly kind: LandmarkKind;
  readonly src: string;
  readonly label: string;
  readonly tilt: number;
};

const LandmarkLayerInner: React.FC<LandmarkLayerProps> = ({kind, src, label, tilt, style}) => {
  return (
    <Interactive.Div
      data-landmark={kind}
      style={{
        position: 'absolute',
        width: 360,
        height: 460,
        perspective: 1600,
        transformOrigin: '50% 100%',
        ...style,
      }}
    >
      <Img
        src={src}
        alt={label || kind}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          transformOrigin: '50% 100%',
          rotate: `x ${tilt}deg`,
          backfaceVisibility: 'hidden',
        }}
      />
    </Interactive.Div>
  );
};

const landmarkSchema = {
  src: {type: 'asset', assetType: 'image', default: '', description: '目的地景观 · 建筑、底座与绿化 PNG'},
  label: {type: 'text-content', default: '', description: '建筑名称'},
  tilt: {type: 'number', min: -90, max: 35, step: 1, default: 0, description: '翻起角度 X（度）', hiddenFromList: false},
} as const satisfies InteractivitySchema;

export const LandmarkLayer = Interactive.withSchema({
  Component: LandmarkLayerInner,
  componentName: '<LandmarkLayer>',
  schema: landmarkSchema,
  wrapInSequence: true,
});

type TextLayerProps = WithStyle & {
  readonly text: string;
  readonly color: string;
  readonly fontSize: number;
};
const TextLayerInner: React.FC<TextLayerProps> = ({text, color, fontSize, style}) => (
  <Interactive.Div
    style={{
      position: 'absolute',
      color,
      fontFamily: 'Arial, PingFang SC, sans-serif',
      fontSize,
      fontWeight: 900,
      lineHeight: 0.98,
      letterSpacing: -3,
      ...style,
    }}
  >{text}</Interactive.Div>
);
const textLayerSchema = {
  text: {type: 'text-content', default: '', description: '文字'},
  color: {type: 'color', default: '#10233d', description: '文字颜色'},
  fontSize: {type: 'number', min: 18, max: 180, step: 1, default: 90, description: '字号', hiddenFromList: false},
  ...Interactive.textSchema,
} as const satisfies InteractivitySchema;

export const TextLayer = Interactive.withSchema({
  Component: TextLayerInner,
  componentName: '<TextLayer>',
  schema: textLayerSchema,
  wrapInSequence: true,
});

type TravelCardProps = WithStyle & {
  readonly city: string;
  readonly kind: LandmarkKind;
  readonly src: string;
  readonly subtitle: string;
  readonly accentColor: string;
};
const TravelCardInner: React.FC<TravelCardProps> = ({city, kind, src, subtitle, accentColor, style}) => (
  <Interactive.Div
    data-landmark-card={kind}
    style={{
      position: 'absolute',
      width: 360,
      height: 300,
      overflow: 'hidden',
      borderRadius: 28,
      background: 'linear-gradient(180deg,#f8fbff,#dfeef6)',
      boxShadow: '0 24px 58px rgba(48,72,96,.18)',
      border: '8px solid rgba(255,255,255,.9)',
      ...style,
    }}
  >
    <Img src={src} alt={city} style={{position: 'absolute', left: '5%', top: '19%', width: '90%', height: '64%', objectFit: 'contain'}} />
    <div style={{position: 'absolute', left: 18, top: 16, display: 'flex', alignItems: 'center', gap: 10}}>
      <div style={{width: 18, height: 18, borderRadius: '50%', backgroundColor: accentColor}} />
      <div style={{fontFamily: 'Arial, PingFang SC, sans-serif', fontSize: 24, fontWeight: 850, color: '#16263a'}}>{city}</div>
    </div>
    <div style={{position: 'absolute', left: 18, right: 18, bottom: 12, fontFamily: 'Arial, PingFang SC, sans-serif', fontSize: 18, fontWeight: 600, letterSpacing: 0.5, color: '#607489'}}>{subtitle}</div>
  </Interactive.Div>
);
const travelCardSchema = {
  src: {type: 'asset', assetType: 'image', default: '', description: '卡片完整景观 · 可替换图片'},
  city: {type: 'text-content', default: '', description: '城市'},
  subtitle: {type: 'text-content', default: '', description: '行程 / 景点信息'},
  accentColor: {type: 'color', default: '#ef3b32', description: '定位点颜色'},
  ...Interactive.borderRadiusSchema,
} as const satisfies InteractivitySchema;
export const TravelCard = Interactive.withSchema({
  Component: TravelCardInner,
  componentName: '<TravelCard>',
  schema: travelCardSchema,
  wrapInSequence: true,
});

