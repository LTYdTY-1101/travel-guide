import {GeographicFlight} from '../components/GeographicFlight';
import {FlightTicket} from '../components/FlightTicket';
import {MessageNotification} from '../components/MessageNotification';
import {onScreenMessageEntrance} from '../on-screen-messages.element';
import {MessageBackdrop} from '../components/MessageBackdrop';
import {FLIGHT_HANDOFF} from '../components/ShanghaiParisCamera';
import {LandmarkShowcase} from '../components/LandmarkShowcase';
import {DomesticFirstLeg} from '../components/DomesticFirstLeg';
import type React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  InfoCard,
  LandmarkLayer,
  MapLayer,
  Pin,
  Plane,
  RouteLayer,
  TextLayer,
  TravelCard,
} from '../components/EditableLayers';

const sceneBackground = '#edf4fb';

const SceneBase: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: sceneBackground, overflow: 'hidden'}}>{children}</AbsoluteFill>
);

export const Scene01Messages: React.FC<{timeOffsetFrames?: number; domesticTicket?: boolean; vectorOpening?: boolean; muteSfx?: boolean}> = ({timeOffsetFrames = 0, domesticTicket = false, vectorOpening = false, muteSfx = false}) => {
  const frame = useCurrentFrame() + timeOffsetFrames;
  const {fps} = useVideoConfig();
  const flipStart = 3.5 * fps;
  const flipSide = 3.8 * fps;
  const mapOpen = 4.35 * fps;
  const mapTilt = 4.9 * fps;
  const ticketIn = 4.9 * fps;
  const ticketSettle = 5.5 * fps;
  const pushStart = 6.8 * fps;
  const fillEnd = 7.8 * fps;
  return (
    <SceneBase>
      <svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true"><defs><filter id="ticket-directional-blur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation={`2 ${interpolate(frame,[pushStart,7.55*fps],[0,30],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}`} /></filter></defs></svg>
      <MessageBackdrop
        name="首屏 · 可编辑渐变背景"
        topColor="#e4e4f0"
        bottomColor="#c2bfd8"
        highlightColor="rgba(255,255,255,.67)"
        purpleColor="rgba(160,153,194,.56)"
        blueColor="rgba(113,125,187,.32)"
        glowBlur={70}
        premountFor={fps}
      />
      <Interactive.Div name="转场 · 三维悬浮空间" premountFor={fps} style={{position: 'absolute', inset: 0, perspective: 1450, perspectiveOrigin: '50% 48%', transformStyle: 'preserve-3d', zIndex: vectorOpening ? 3 : undefined}}>
        <MessageNotification
          name="首屏 · 悬浮消息通知"
          title="Messages"
          message="国庆，欧洲走不走？"
          timeText="现在"
          fontSize={32}
          fontWeight={400}
          fontFamily="PingFang SC, Arial, sans-serif"
          lineHeight={1.3}
          letterSpacing={0}
          textColor="#1f2b43"
          titleFontSize={30}
          titleFontWeight={700}
          titleColor="#121216"
          timeFontSize={18}
          timeFontWeight={400}
          timeColor="#9595a3"
          iconSrc={staticFile('icons/messages-reference.png')}
          iconSize={112}
          iconRadius={26}
          iconOpacity={1}
          iconZoom={1.142857}
          iconOffsetX={0}
          iconOffsetY={0}
          iconFit="contain"
          bubbleColor={'rgba(241, 242, 249, 0.8)'}
          borderColor={'rgba(255, 255, 255, 0.6)'}
          borderWidth={3}
          blur={28}
          paddingX={44}
          paddingY={30}
          gap={36}
          rowGap={12}
          shadow="0 24px 65px rgba(55,58,92,.18)"
          premountFor={fps}
          durationInFrames={4 * fps}
          style={{...onScreenMessageEntrance(frame * 30 / fps, 2, 10), left: 90, top: 685, width: 760, height: 182, borderRadius: 44, opacity: interpolate(frame, [2 * fps / 30, 10 * fps / 30, flipStart, 3.88 * fps], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `rotateY(${interpolate(frame, [flipStart, flipSide], [0, 88], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.48, 0, .9, .52)})}deg)`, transformOrigin: 'center center'}}
        />
        <MessageNotification
          name="首屏 · GO 独立回复通知"
          title="Messages"
          message="GO"
          timeText="现在"
          fontSize={32}
          fontWeight={400}
          fontFamily="PingFang SC, Arial, sans-serif"
          lineHeight={1.3}
          letterSpacing={0}
          textColor="#1f2b43"
          titleFontSize={30}
          titleFontWeight={700}
          titleColor="#121216"
          timeFontSize={18}
          timeFontWeight={400}
          timeColor="#9595a3"
          iconSrc={staticFile('icons/messages-reference.png')}
          iconSize={112}
          iconRadius={26}
          iconOpacity={1}
          iconZoom={1.142857}
          iconOffsetX={0}
          iconOffsetY={0}
          iconFit="contain"
          bubbleColor={'rgba(241, 242, 249, 0.8)'}
          borderColor={'rgba(255, 255, 255, 0.6)'}
          borderWidth={3}
          blur={28}
          paddingX={44}
          paddingY={30}
          gap={36}
          rowGap={12}
          shadow="0 24px 65px rgba(55,58,92,.18)"
          premountFor={fps}
          from={37 * fps / 30}
          durationInFrames={4 * fps - 37 * fps / 30}
          style={{...onScreenMessageEntrance((frame - 37 * fps / 30) * 30 / fps, 2, 10), right: 90, top: 915, width: 540, height: 182, borderRadius: 44, opacity: interpolate(frame, [(37 + 2) * fps / 30, (37 + 10) * fps / 30, flipStart, 3.88 * fps], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `rotateY(${interpolate(frame, [flipStart, flipSide], [0, 88], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.48, 0, .9, .52)})}deg)`, transformOrigin: 'center center'}}
        />
        {!vectorOpening && <>
        <Interactive.Div name="地图 · 侧翻展开并后倾" premountFor={fps} style={{position: 'absolute', left: interpolate(frame, [flipSide, mapOpen, pushStart, fillEnd], [90, 105, 105, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), top: interpolate(frame, [flipSide, mapOpen, pushStart, fillEnd], [685, 240, 240, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), width: interpolate(frame, [flipSide, mapOpen, pushStart, fillEnd], [900, 870, 870, 1080], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), height: interpolate(frame, [flipSide, mapOpen, pushStart, fillEnd], [234, 1440, 1440, 1920], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), overflow: 'hidden', borderRadius: interpolate(frame, [pushStart, fillEnd], [44, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), boxShadow: '0 45px 110px rgba(56,62,104,.27)', opacity: interpolate(frame, [3.75 * fps, 3.95 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), transform: `rotateY(${interpolate(frame, [flipSide, mapOpen], [-88, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.16, 1, .3, 1)})}deg) rotateX(${interpolate(frame, [mapOpen, mapTilt], [0, 25], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.16, 1, .3, 1)})}deg)`, transformOrigin: 'center bottom', scale: interpolate(frame, [ticketSettle, pushStart, fillEnd], [1, 1.08, 1.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}}>
          <Interactive.Div name="地图 · 机场推进" premountFor={fps} style={{position: 'absolute', inset: 0, scale: interpolate(frame, [mapTilt, pushStart, fillEnd], [1, 1, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.24, 0, .24, 1)})}}>
            <MapLayer name="地图 · 浦东机场真实近景" premountFor={fps} src={staticFile('maps/pvg-runway-card.jpg')} label="上海 · 浦东机场" tint="#d6e0dc" />
          </Interactive.Div>
          <TextLayer name="地图 · PVG 地点标签" premountFor={fps} text="上海 · PVG" color="#1a304a" fontSize={31} style={{left: 585, top: 685, padding: '12px 19px', borderRadius: 15, backgroundColor: 'rgba(255,255,255,.9)', opacity: interpolate(frame, [mapTilt, 5.3 * fps, pushStart, fillEnd], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
        </Interactive.Div>
        <Interactive.Div name="地图 · 机票交接飞机投影" premountFor={fps} style={{position: 'absolute', left: FLIGHT_HANDOFF.planeX - 100, top: interpolate(frame, [5.3 * fps, pushStart, fillEnd], [660, 730, FLIGHT_HANDOFF.planeY - 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), width: 200, height: 200, filter: 'brightness(0) blur(4px)', opacity: interpolate(frame, [5.3 * fps, 5.7 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: '0px 10px'}}><Img src={staticFile('plane-c4d.png')} style={{width: '100%', height: '100%', objectFit: 'contain'}} /></Interactive.Div>
        <Plane name="地图 · 与起飞镜头共享位置的飞机" color="#ffffff" size={200} premountFor={fps} style={{left: FLIGHT_HANDOFF.planeX - 100, top: interpolate(frame, [5.3 * fps, pushStart, fillEnd], [660, 730, FLIGHT_HANDOFF.planeY - 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.35, 0, .25, 1)}), opacity: interpolate(frame, [mapTilt, 5.35 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), rotate: '0deg'}} />
        </>}
        <FlightTicket domestic={domesticTicket} style={{left: 79, top: frame <= pushStart ? interpolate(frame, [ticketIn, ticketSettle, pushStart], [1920, 1050, 1060], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.16, 1, .3, 1)}) : interpolate(frame, [pushStart, 7.55*fps], [1060, 2550], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.65, 0, 1, .45)}), opacity: interpolate(frame, [ticketIn, 5.2 * fps, 7.36 * fps, 7.57*fps], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [ticketIn, ticketSettle, pushStart, 7.55*fps], [.88, 1.07, 1.12, 2.15], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'}), transform: 'rotateX(10deg)', transformOrigin: 'center bottom', filter: `blur(${interpolate(frame, [ticketIn, ticketSettle, pushStart, 7.55*fps], [18, 0, 0, 32], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(.6, 0, 1, .6)})}px)`}} />
      </Interactive.Div>
      {domesticTicket && <Interactive.Div name="交接 · 同一张浦东机场地图" premountFor={fps} style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [7.68 * fps, 7.90 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}><DomesticFirstLeg frozen /></Interactive.Div>}
      {!muteSfx && <>
      <Audio name="SFX · 消息提示" from={36} src={staticFile('audio/message.wav')} volume={0.7} premountFor={fps} />
      <Audio name="SFX · 通知翻面" from={Math.round(flipStart)} src={staticFile('audio/whoosh.wav')} volume={0.36} premountFor={fps} />
      <Audio name="SFX · 机票上推" from={Math.round(ticketIn)} src={staticFile('audio/whoosh.wav')} volume={0.28} premountFor={fps} />
      <Audio name="SFX · 推入地图" from={Math.round(pushStart)} src={staticFile('audio/whoosh.wav')} volume={0.25} premountFor={fps} />
      </>}
    </SceneBase>
  );
};

export const Scene02Departure: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 上海" premountFor={fps} src={staticFile('maps/shanghai.png')} label="上海" tint="#edf4ed" />
      <Pin
        name="Pin · 上海"
        premountFor={fps}
        label="上海"
        color="#ef3b32"
        style={{left: 570, top: 920, scale: interpolate(frame, [0, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 15}), output: 'perceptual-scale'})}}
      />
      <InfoCard
        name="Card · 出发信息"
        premountFor={fps}
        title="上海 → 巴黎"
        subtitle="七天 · 三座城市"
        route="PVG → CDG"
        accentColor="#ef3b32"
        style={{
          left: 110,
          top: 560,
          width: 760,
          opacity: interpolate(frame, [0, 0.55 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          translate: interpolate(frame, [0, 0.85 * fps], ['0px 90px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18})}),
          rotate: interpolate(frame, [0, 0.9 * fps], ['3deg', '0deg'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      />
      <Audio name="SFX · 卡片展开" from={2} src={staticFile('audio/whoosh.wav')} volume={0.35} premountFor={fps} />
      <Audio name="SFX · 定位落点" from={22} src={staticFile('audio/pop.wav')} volume={0.5} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene03CardCompact: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 上海展开" premountFor={fps} src={staticFile('maps/shanghai.png')} label="上海" tint="#eef5ee" style={{scale: interpolate(frame, [0, 4 * fps], [1.18, 1.05], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <InfoCard
        name="Card · 缩小吸附"
        premountFor={fps}
        title="上海 → 巴黎"
        subtitle="七天 · 三座城市"
        route="PVG → CDG"
        accentColor="#ef3b32"
        style={{
          left: 80,
          top: 250,
          width: 700,
          scale: interpolate(frame, [0, 2.4 * fps], [1, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'}),
          translate: interpolate(frame, [0, 2.4 * fps], ['70px 520px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
          rotate: interpolate(frame, [0, 2.4 * fps], ['0deg', '-1deg'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      />
      <TextLayer name="Title · 从上海出发" premountFor={fps} text="从上海出发" color="#10233d" fontSize={92} style={{left: 92, bottom: 170, opacity: interpolate(frame, [1.3 * fps, 2.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.3 * fps, 2.2 * fps], ['0px 45px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
    </SceneBase>
  );
};

export const Scene04FlightToEurope: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <GeographicFlight name="飞行镜头 · 欧亚航线" region="eurasia" departureZoom={3.8} cruiseZoom={1.2} arrivalZoom={2.1} planeSize={200} flightDuration={8 * fps} durationInFrames={8 * fps} premountFor={fps} />
      <TextLayer name="Label · 上海巴黎" premountFor={fps} text="上海 → 巴黎" color="#10233d" fontSize={76} style={{left: 78, top: 270, opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 跨洲飞行" src={staticFile('audio/whoosh.wav')} volume={0.35} premountFor={fps} />
      <Audio name="SFX · 巴黎落点" from={Math.round(7.5 * fps)} src={staticFile('audio/pop.wav')} volume={0.32} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene05Paris: React.FC = () => (
  <SceneBase>
    <LandmarkShowcase city="巴黎" map="maps/paris.jpg" durationInFrames={360} items={[
      {kind: 'eiffel', title: '埃菲尔铁塔', image: 'landmarks/dioramas/eiffel.png', width: 760, height: 1140},
      {kind: 'louvre', title: '卢浮宫', image: 'landmarks/dioramas/louvre.png', width: 910, height: 640},
      {kind: 'notre-dame', title: '巴黎圣母院', image: 'landmarks/dioramas/notre-dame.png', width: 830, height: 830},
    ]} />
  </SceneBase>
);

export const Scene06ParisBarcelona: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <GeographicFlight name="飞行镜头 · 法国西班牙" region="france-spain" departureZoom={3.8} cruiseZoom={1.2} arrivalZoom={2.1} planeSize={165} flightDuration={4 * fps} durationInFrames={4 * fps} premountFor={fps} />
      <Audio name="SFX · 巴黎巴塞罗那" src={staticFile('audio/whoosh.wav')} volume={0.28} premountFor={fps} />
      <Audio name="SFX · 巴塞罗那落点" from={Math.round(3.5 * fps)} src={staticFile('audio/pop.wav')} volume={0.32} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene07Barcelona: React.FC = () => (
  <SceneBase>
    <LandmarkShowcase city="巴塞罗那" map="maps/barcelona.jpg" durationInFrames={300} items={[
      {kind: 'sagrada', title: '圣家堂', image: 'landmarks/dioramas/sagrada.png', width: 750, height: 1125},
      {kind: 'casa', title: '巴特罗之家', image: 'landmarks/dioramas/casa.png', width: 730, height: 1095},
    ]} />
  </SceneBase>
);

export const Scene08BarcelonaRome: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <GeographicFlight name="飞行镜头 · 地中海" region="mediterranean" departureZoom={3.8} cruiseZoom={1.2} arrivalZoom={2.1} planeSize={165} flightDuration={4 * fps} durationInFrames={4 * fps} premountFor={fps} />
      <Audio name="SFX · 巴塞罗那罗马" src={staticFile('audio/whoosh.wav')} volume={0.28} premountFor={fps} />
      <Audio name="SFX · 罗马落点" from={Math.round(3.5 * fps)} src={staticFile('audio/pop.wav')} volume={0.32} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene09Rome: React.FC = () => (
  <SceneBase>
    <LandmarkShowcase city="罗马" map="maps/rome.jpg" durationInFrames={300} items={[
      {kind: 'colosseum', title: '罗马斗兽场', image: 'landmarks/dioramas/colosseum.png', width: 930, height: 620},
      {kind: 'pantheon', title: '万神殿', image: 'landmarks/dioramas/pantheon.png', width: 840, height: 840},
    ]} />
  </SceneBase>
);

export const Scene10Vatican: React.FC = () => (
  <SceneBase>
    <LandmarkShowcase city="梵蒂冈" map="maps/vatican.jpg" durationInFrames={180} items={[
      {kind: 'vatican', title: '圣彼得大教堂', image: 'landmarks/dioramas/vatican.png', width: 920, height: 920},
    ]} />
  </SceneBase>
);

export const Scene11Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <Interactive.Div name="Background · 蒙太奇" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg,#eef6ff,#f9fbff 52%,#e5f0f8)'}} />
      <TextLayer name="Title · 七日建筑记忆" premountFor={fps} text={'七天\n建筑旅行手记'} color="#102d4d" fontSize={92} style={{left: 64, top: 72, whiteSpace: 'pre-line', lineHeight: 1.1, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <TravelCard
        name="Card · 巴黎铁塔"
        premountFor={fps}
        city="巴黎 · 埃菲尔铁塔"
        kind="eiffel"
        src={staticFile('landmarks/dioramas/eiffel.png')}
        subtitle="第 1 天 · 巴黎"
        accentColor="#ef3b32"
        style={{left: 60, top: 370, width: 420, height: 280, rotate: '-3deg', opacity: interpolate(frame, [0 * fps, 0.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0 * fps, 0.55 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 卢浮宫"
        premountFor={fps}
        city="巴黎 · 卢浮宫"
        kind="louvre"
        src={staticFile('landmarks/dioramas/louvre.png')}
        subtitle="第 1 天 · 巴黎"
        accentColor="#ef3b32"
        style={{left: 580, top: 350, width: 420, height: 280, rotate: '2deg', opacity: interpolate(frame, [0.25 * fps, 0.65 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.25 * fps, 0.8 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 巴黎圣母院"
        premountFor={fps}
        city="巴黎 · 圣母院"
        kind="notre-dame"
        src={staticFile('landmarks/dioramas/notre-dame.png')}
        subtitle="第 2 天 · 巴黎"
        accentColor="#ef3b32"
        style={{left: 95, top: 710, width: 420, height: 280, rotate: '2deg', opacity: interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.5 * fps, 1.05 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 圣家堂"
        premountFor={fps}
        city="巴塞罗那 · 圣家堂"
        kind="sagrada"
        src={staticFile('landmarks/dioramas/sagrada.png')}
        subtitle="第 3 天 · 巴塞罗那"
        accentColor="#ef3b32"
        style={{left: 565, top: 690, width: 420, height: 280, rotate: '-2deg', opacity: interpolate(frame, [0.75 * fps, 1.15 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.75 * fps, 1.3 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 巴特罗之家"
        premountFor={fps}
        city="巴塞罗那 · 巴特罗"
        kind="casa"
        src={staticFile('landmarks/dioramas/casa.png')}
        subtitle="第 4 天 · 巴塞罗那"
        accentColor="#ef3b32"
        style={{left: 60, top: 1050, width: 420, height: 280, rotate: '-2deg', opacity: interpolate(frame, [1 * fps, 1.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1 * fps, 1.55 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 斗兽场"
        premountFor={fps}
        city="罗马 · 斗兽场"
        kind="colosseum"
        src={staticFile('landmarks/dioramas/colosseum.png')}
        subtitle="第 5 天 · 罗马"
        accentColor="#ef3b32"
        style={{left: 580, top: 1030, width: 420, height: 280, rotate: '3deg', opacity: interpolate(frame, [1.25 * fps, 1.65 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.25 * fps, 1.8 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 万神殿"
        premountFor={fps}
        city="罗马 · 万神殿"
        kind="pantheon"
        src={staticFile('landmarks/dioramas/pantheon.png')}
        subtitle="第 5 天 · 罗马"
        accentColor="#ef3b32"
        style={{left: 95, top: 1390, width: 420, height: 280, rotate: '2deg', opacity: interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.5 * fps, 2.05 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 梵蒂冈"
        premountFor={fps}
        city="梵蒂冈 · 圣彼得"
        kind="vatican"
        src={staticFile('landmarks/dioramas/vatican.png')}
        subtitle="第 6 天 · 梵蒂冈"
        accentColor="#ef3b32"
        style={{left: 565, top: 1370, width: 420, height: 280, rotate: '-2deg', opacity: interpolate(frame, [1.75 * fps, 2.15 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.75 * fps, 2.3 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      <TextLayer name="Footer · 七日返程" premountFor={fps} text="第 7 天 · 带着建筑记忆返程" color="#63778c" fontSize={32} style={{left: 275, top: 1770, letterSpacing: 2, opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 快门1" from={4} src={staticFile('audio/shutter.wav')} volume={0.34} premountFor={fps} />
      <Audio name="SFX · 快门2" from={19} src={staticFile('audio/shutter.wav')} volume={0.3} premountFor={fps} />
      <Audio name="SFX · 快门3" from={34} src={staticFile('audio/shutter.wav')} volume={0.28} premountFor={fps} />
      <Audio name="SFX · 快门4" from={49} src={staticFile('audio/shutter.wav')} volume={0.26} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene12Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 欧洲收尾" premountFor={fps} src={staticFile('maps/europe.svg')} label="" tint="#eaf3ee" style={{opacity: 0.45}} />
      <Interactive.Div name="Wash · 终章冷白渐层" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(237,247,255,.9),rgba(246,250,255,.6) 45%,#eff6fc 96%)'}} />
      <RouteLayer name="Route · 最终路线" premountFor={fps} path="M 165 492 C 350 420 460 570 660 490 S 960 680 895 770" progress={interpolate(frame, [0.2 * fps, 2.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color="#ef3b32" width={7} style={{opacity: 0.7}} />
      <TextLayer name="Eyebrow · 国庆特别计划" premountFor={fps} text="国庆假期 · 欧洲之旅" color="#6081a4" fontSize={25} style={{left: 76, top: 65, letterSpacing: 4, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Title · 国庆欧洲" premountFor={fps} text={'国庆欧洲\n7日建筑巡礼'} color="#0d315f" fontSize={112} style={{left: 70, top: 124, whiteSpace: 'pre-line', lineHeight: 1.04, opacity: interpolate(frame, [0 * fps, 0.75 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0 * fps, 0.9 * fps], ['0px -32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Subtitle · 7 days" premountFor={fps} text="七天 · 三座城市 · 八座地标" color="#526d8d" fontSize={29} style={{left: 76, top: 385, letterSpacing: 2, opacity: interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Plane name="Plane · 线稿装饰" premountFor={fps} color="#5f9bd2" size={135} style={{right: 80, top: 300, opacity: 0.7, rotate: '-20deg', translate: interpolate(frame, [0.4 * fps, 2.4 * fps], ['120px 20px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <TravelCard
        name="Final Card · 巴黎"
        premountFor={fps}
        city="巴黎"
        kind="louvre"
        src={staticFile('landmarks/dioramas/louvre.png')}
        subtitle="第 1–2 天 · 铁塔 / 卢浮宫 / 圣母院"
        accentColor="#ef3b32"
        style={{left: 70, top: 510, width: 425, height: 320, rotate: '-3deg', opacity: interpolate(frame, [0.75 * fps, 1.15 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.75 * fps, 1.3 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Final Card · 巴塞罗那"
        premountFor={fps}
        city="巴塞罗那"
        kind="sagrada"
        src={staticFile('landmarks/dioramas/sagrada.png')}
        subtitle="第 3–4 天 · 圣家堂 / 巴特罗之家"
        accentColor="#ef3b32"
        style={{left: 565, top: 580, width: 425, height: 320, rotate: '3deg', opacity: interpolate(frame, [1 * fps, 1.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1 * fps, 1.55 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Final Card · 罗马"
        premountFor={fps}
        city="罗马"
        kind="colosseum"
        src={staticFile('landmarks/dioramas/colosseum.png')}
        subtitle="第 5 天 · 斗兽场 / 万神殿"
        accentColor="#ef3b32"
        style={{left: 110, top: 900, width: 425, height: 320, rotate: '2deg', opacity: interpolate(frame, [1.25 * fps, 1.65 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.25 * fps, 1.8 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Final Card · 梵蒂冈"
        premountFor={fps}
        city="梵蒂冈"
        kind="vatican"
        src={staticFile('landmarks/dioramas/vatican.png')}
        subtitle="第 6 天 · 圣彼得大教堂与广场"
        accentColor="#ef3b32"
        style={{left: 595, top: 970, width: 425, height: 320, rotate: '-2deg', opacity: interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.5 * fps, 2.05 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      <Interactive.Div name="Shadow · 终章建筑群" premountFor={fps} style={{position: 'absolute', left: 55, top: 1780, width: 970, height: 60, borderRadius: '50%', backgroundColor: '#72899d', filter: 'blur(28px)', opacity: interpolate(frame, [2.2 * fps, 3.2 * fps], [0, 0.17], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <LandmarkLayer name="Final Landmark · 铁塔" premountFor={fps} kind="eiffel" src={staticFile('landmarks/dioramas/eiffel.png')} label="铁塔" tilt={interpolate(frame, [2 * fps, 3 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 0, top: 1200, width: 310, height: 640, opacity: interpolate(frame, [2 * fps, 2.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2 * fps, 3 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      
      <LandmarkLayer name="Final Landmark · 圣家堂" premountFor={fps} kind="sagrada" src={staticFile('landmarks/dioramas/sagrada.png')} label="圣家堂" tilt={interpolate(frame, [2.25 * fps, 3.25 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 210, top: 1320, width: 370, height: 520, opacity: interpolate(frame, [2.25 * fps, 2.55 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2.25 * fps, 3.25 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      
      <LandmarkLayer name="Final Landmark · 斗兽场" premountFor={fps} kind="colosseum" src={staticFile('landmarks/dioramas/colosseum.png')} label="斗兽场" tilt={interpolate(frame, [2.5 * fps, 3.5 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 435, top: 1500, width: 430, height: 340, opacity: interpolate(frame, [2.5 * fps, 2.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2.5 * fps, 3.5 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      
      <LandmarkLayer name="Final Landmark · 圣彼得" premountFor={fps} kind="vatican" src={staticFile('landmarks/dioramas/vatican.png')} label="圣彼得" tilt={interpolate(frame, [2.75 * fps, 3.75 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 710, top: 1390, width: 390, height: 450, opacity: interpolate(frame, [2.75 * fps, 3.05 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2.75 * fps, 3.75 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      <TextLayer name="Footer · 完整七日路线" premountFor={fps} text="上海 → 巴黎 → 巴塞罗那 → 罗马 · 第 7 天 返程" color="#365773" fontSize={25} style={{left: 76, top: 1850, padding: '14px 24px', borderRadius: 18, backgroundColor: 'rgba(255,255,255,.92)', letterSpacing: 1, opacity: interpolate(frame, [3 * fps, 3.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Interactive.Div name="Firework · 左" premountFor={fps} style={{position: 'absolute', left: 16, top: 390, width: 120, height: 120, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg,#f0b044 0deg 3deg,transparent 3deg 18deg)', opacity: interpolate(frame, [3.2 * fps, 3.55 * fps, 4.2 * fps], [0, 0.75, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [3.2 * fps, 4.2 * fps], [0.2, 1.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <Interactive.Div name="Firework · 右" premountFor={fps} style={{position: 'absolute', right: 45, top: 110, width: 150, height: 150, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg,#ef3b32 0deg 2deg,transparent 2deg 16deg)', opacity: interpolate(frame, [3.6 * fps, 4 * fps, 4.8 * fps], [0, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [3.6 * fps, 4.8 * fps], [0.2, 1.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <Audio name="SFX · 终章卡片" from={28} src={staticFile('audio/shutter.wav')} volume={0.3} premountFor={fps} />
      <Audio name="SFX · 终章建筑" from={70} src={staticFile('audio/pop.wav')} volume={0.38} premountFor={fps} />
    </SceneBase>
  );
};
