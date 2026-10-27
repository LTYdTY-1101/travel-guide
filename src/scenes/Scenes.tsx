import type React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
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
  MessageBubble,
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

export const Scene01Messages: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <Interactive.Div
        name="Background · 冷白毛玻璃"
        premountFor={fps}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 22% 24%,rgba(255,255,255,.98),transparent 35%), radial-gradient(circle at 78% 72%,rgba(180,212,243,.68),transparent 42%), linear-gradient(145deg,#eef5ff,#d9e9f7)',
          opacity: 1,
        }}
      />
      <Interactive.Div
        name="Background · 模糊光影"
        premountFor={fps}
        style={{
          position: 'absolute',
          width: 880,
          height: 880,
          left: -220,
          top: 980,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,.38)',
          filter: 'blur(50px)',
          translate: interpolate(frame, [0, 4 * fps], ['0px 40px', '180px -30px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <MessageBubble
        name="Message · 国庆欧洲"
        premountFor={fps}
        text="国庆，欧洲？"
        showMessagesIcon={false}
        bubbleColor="rgba(255,255,255,.78)"
        style={{
          left: 92,
          top: 700,
          height: 124,
          boxSizing: 'border-box',
          padding: '24px 34px 24px 134px',
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: interpolate(frame, [0.2 * fps, 0.9 * fps], ['0px 48px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.spring({damping: 18}),
          }),
          scale: interpolate(frame, [0.2 * fps, 0.9 * fps], [0.88, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.spring({damping: 18}),
            output: 'perceptual-scale',
          }),
        }}
      />
      <Interactive.Div
        name="Icon · Apple Messages"
        premountFor={fps}
        style={{
          position: 'absolute', left: 126, top: 724, width: 76, height: 76,
          borderRadius: 18, background: 'linear-gradient(180deg,#50e769,#18c934)',
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          translate: interpolate(frame, [0.2 * fps, 0.9 * fps], ['0px 48px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18})}),
          scale: interpolate(frame, [0.2 * fps, 0.9 * fps], [0.88, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
        }}
      >
        <svg viewBox="0 0 76 76" width="76" height="76" aria-label="Apple Messages">
          <path d="M38 15c-15 0-25 9-25 21 0 7 4 13 10 17l-2 9 12-6h5c15 0 25-8 25-20S53 15 38 15Z" fill="white" />
        </svg>
      </Interactive.Div>
      <MessageBubble
        name="Reply · go"
        premountFor={fps}
        text="go"
        showMessagesIcon={false}
        bubbleColor="rgba(226,241,255,.88)"
        style={{
          left: 670,
          top: 880,
          fontSize: 62,
          padding: '22px 42px',
          opacity: interpolate(frame, [1.25 * fps, 1.8 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          translate: interpolate(frame, [1.2 * fps, 1.85 * fps], ['50px 20px', '0px 0px'], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.spring({damping: 16}),
          }),
        }}
      />
      <Audio name="SFX · 消息提示" from={36} src={staticFile('audio/message.wav')} volume={0.7} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene02Departure: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 上海" premountFor={fps} src="" label="SHANGHAI · GOOGLE MAP PLACEHOLDER" tint="#edf4ed" />
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
        subtitle="7 DAYS · 3 CITIES"
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
      <MapLayer name="Map · 上海展开" premountFor={fps} src="" label="SHANGHAI" tint="#eef5ee" style={{scale: interpolate(frame, [0, 4 * fps], [1.05, 1.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <InfoCard
        name="Card · 缩小吸附"
        premountFor={fps}
        title="上海 → 巴黎"
        subtitle="7 DAYS · 3 CITIES"
        route="PVG → CDG"
        accentColor="#ef3b32"
        style={{
          left: 80,
          top: 90,
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
      <MapLayer name="Map · 欧亚航线" premountFor={fps} src="" label="EURASIA · REPLACE WITH GOOGLE STATIC MAP" tint="#e9f1e8" />
      <RouteLayer name="Route · 上海到巴黎" premountFor={fps} path="M 900 1260 C 760 980 580 720 180 620" progress={interpolate(frame, [0.2 * fps, 3.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)})} color="#ef3b32" width={13} />
      <Pin name="Pin · 上海出发" premountFor={fps} label="上海" color="#ef3b32" style={{left: 820, top: 1210}} />
      <Pin name="Pin · 巴黎抵达" premountFor={fps} label="巴黎" color="#ef3b32" style={{left: 90, top: 560, opacity: interpolate(frame, [2.7 * fps, 3.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Plane name="Plane · 跨洲飞行" premountFor={fps} color="#ffffff" style={{left: 480, top: 760, translate: interpolate(frame, [0.2 * fps, 3.2 * fps], ['390px 450px', '-330px -160px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)}), rotate: '-28deg'}} />
      <TextLayer name="Label · 上海巴黎" premountFor={fps} text="上海 → 巴黎" color="#10233d" fontSize={76} style={{left: 78, top: 120, opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 跨洲飞行" src={staticFile('audio/whoosh.wav')} volume={0.35} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene05Paris: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 巴黎俯视" premountFor={fps} src="" label="PARIS" tint="#eef3e8" style={{scale: 1.1, rotate: '-1.5deg'}} />
      <Interactive.Div name="Wash · 巴黎留白" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(246,250,255,.94),rgba(246,250,255,.28) 42%,rgba(246,250,255,.14))'}} />
      
      <TextLayer name="Title · PARIS" premountFor={fps} text="PARIS" color="#102d4d" fontSize={108} style={{left: 64, top: 86, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Itinerary · PARIS" premountFor={fps} text="DAY 1–2 · 巴黎建筑巡礼" color="#5c7187" fontSize={30} style={{left: 68, top: 224, letterSpacing: 3, opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 埃菲尔铁塔" premountFor={fps} style={{position: 'absolute', left: 86, top: 1326, width: 395, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [0 * fps, 0.8 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [0 * fps, 1 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 埃菲尔铁塔"
        premountFor={fps}
        kind="eiffel"
        src={staticFile('landmarks/dioramas/eiffel.png')}
        label="埃菲尔铁塔"
        tilt={interpolate(frame, [0 * fps, 1.1 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: 24, top: 380, width: 520, height: 970,
          opacity: interpolate(frame, [0 * fps, 0.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [0 * fps, 1.1 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [0 * fps, 1.1 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 埃菲尔铁塔" premountFor={fps} label="" color="#ef3b32" style={{left: 81, top: 1311, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [0.65 * fps, 1.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 埃菲尔铁塔" premountFor={fps} text="埃菲尔铁塔" color="#17334e" fontSize={30} style={{left: 117, top: 1370, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.7 * fps, 1.2 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 卢浮宫" premountFor={fps} style={{position: 'absolute', left: 521, top: 1036, width: 448, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [0.5 * fps, 1.3 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [0.5 * fps, 1.5 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 卢浮宫"
        premountFor={fps}
        kind="louvre"
        src={staticFile('landmarks/dioramas/louvre.png')}
        label="卢浮宫"
        tilt={interpolate(frame, [0.5 * fps, 1.6 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: 450, top: 600, width: 590, height: 460,
          opacity: interpolate(frame, [0.5 * fps, 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [0.5 * fps, 1.6 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [0.5 * fps, 1.6 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 卢浮宫" premountFor={fps} label="" color="#ef3b32" style={{left: 641, top: 1021, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [1.15 * fps, 1.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 卢浮宫" premountFor={fps} text="卢浮宫" color="#17334e" fontSize={30} style={{left: 677, top: 1080, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [1.2 * fps, 1.7 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.2 * fps, 1.7 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 巴黎圣母院" premountFor={fps} style={{position: 'absolute', left: 493, top: 1646, width: 464, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [1 * fps, 1.8 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [1 * fps, 2 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 巴黎圣母院"
        premountFor={fps}
        kind="notre-dame"
        src={staticFile('landmarks/dioramas/notre-dame.png')}
        label="巴黎圣母院"
        tilt={interpolate(frame, [1 * fps, 2.1 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: 420, top: 1110, width: 610, height: 560,
          opacity: interpolate(frame, [1 * fps, 1.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [1 * fps, 2.1 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [1 * fps, 2.1 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 巴黎圣母院" premountFor={fps} label="" color="#ef3b32" style={{left: 556, top: 1641, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [1.65 * fps, 2.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 巴黎圣母院" premountFor={fps} text="巴黎圣母院" color="#17334e" fontSize={30} style={{left: 592, top: 1700, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [1.7 * fps, 2.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.7 * fps, 2.2 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 巴黎地标1" from={10} src={staticFile('audio/pop.wav')} volume={0.35} premountFor={fps} />
      <Audio name="SFX · 巴黎地标2" from={25} src={staticFile('audio/pop.wav')} volume={0.3} premountFor={fps} />
      <Audio name="SFX · 巴黎地标3" from={40} src={staticFile('audio/pop.wav')} volume={0.3} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene06ParisBarcelona: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 法国西班牙" premountFor={fps} src="" label="FRANCE → SPAIN" tint="#eaf2e7" />
      <RouteLayer name="Route · 巴黎到巴塞罗那" premountFor={fps} path="M 540 360 C 390 650 390 980 570 1450" progress={interpolate(frame, [0.2 * fps, 3.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color="#ef3b32" width={12} />
      <Pin name="Pin · 巴黎" premountFor={fps} label="巴黎" color="#ef3b32" style={{left: 450, top: 300}} />
      <Pin name="Pin · 巴塞罗那" premountFor={fps} label="巴塞罗那" color="#ef3b32" style={{left: 500, top: 1400}} />
      <Plane name="Plane · 巴黎巴塞罗那" premountFor={fps} color="#ffffff" style={{left: 500, top: 350, translate: interpolate(frame, [0.2 * fps, 3.3 * fps], ['0px 0px', '60px 1060px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), rotate: '95deg'}} />
      <Audio name="SFX · 巴黎巴塞罗那" src={staticFile('audio/whoosh.wav')} volume={0.28} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene07Barcelona: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 巴塞罗那俯视" premountFor={fps} src="" label="BARCELONA" tint="#edf3e9" style={{scale: 1.1}} />
      <Interactive.Div name="Wash · 巴塞罗那留白" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(246,250,255,.94),rgba(246,250,255,.24) 45%,rgba(246,250,255,.12))'}} />
      
      <TextLayer name="Title · BARCELONA" premountFor={fps} text="BARCELONA" color="#102d4d" fontSize={86} style={{left: 64, top: 86, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Itinerary · BARCELONA" premountFor={fps} text="DAY 3–4 · 高迪的建筑世界" color="#5c7187" fontSize={30} style={{left: 68, top: 224, letterSpacing: 3, opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 圣家堂" premountFor={fps} style={{position: 'absolute', left: 76, top: 1356, width: 547, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [0 * fps, 0.8 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [0 * fps, 1 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 圣家堂"
        premountFor={fps}
        kind="sagrada"
        src={staticFile('landmarks/dioramas/sagrada.png')}
        label="圣家堂"
        tilt={interpolate(frame, [0 * fps, 1.1 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: -10, top: 330, width: 720, height: 1050,
          opacity: interpolate(frame, [0 * fps, 0.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [0 * fps, 1.1 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [0 * fps, 1.1 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 圣家堂" premountFor={fps} label="" color="#ef3b32" style={{left: 151, top: 1341, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [0.65 * fps, 1.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 圣家堂" premountFor={fps} text="圣家堂" color="#17334e" fontSize={30} style={{left: 187, top: 1400, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.7 * fps, 1.2 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 巴特罗之家" premountFor={fps} style={{position: 'absolute', left: 621, top: 1506, width: 388, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [0.75 * fps, 1.55 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [0.75 * fps, 1.75 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 巴特罗之家"
        premountFor={fps}
        kind="casa"
        src={staticFile('landmarks/dioramas/casa.png')}
        label="巴特罗之家"
        tilt={interpolate(frame, [0.75 * fps, 1.85 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: 560, top: 800, width: 510, height: 730,
          opacity: interpolate(frame, [0.75 * fps, 1.05 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [0.75 * fps, 1.85 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [0.75 * fps, 1.85 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 巴特罗之家" premountFor={fps} label="" color="#ef3b32" style={{left: 621, top: 1491, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [1.4 * fps, 1.85 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 巴特罗之家" premountFor={fps} text="巴特罗之家" color="#17334e" fontSize={30} style={{left: 657, top: 1550, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [1.45 * fps, 1.95 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.45 * fps, 1.95 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Tip · 高迪路线" premountFor={fps} text={'高迪路线 · 圣家堂 → 巴特罗之家\n建议提前预约官方时段'} color="#24415f" fontSize={29} style={{left: 100, top: 1730, width: 820, padding: '24px 30px', borderRadius: 24, lineHeight: 1.6, whiteSpace: 'pre-line', letterSpacing: 1, fontWeight: 650, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 18px 46px rgba(60,83,108,.12)', opacity: interpolate(frame, [5.5 * fps, 7 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 圣家堂" from={10} src={staticFile('audio/pop.wav')} volume={0.36} premountFor={fps} />
      <Audio name="SFX · 巴特罗之家" from={32} src={staticFile('audio/pop.wav')} volume={0.32} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene08BarcelonaRome: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 地中海" premountFor={fps} src="" label="MEDITERRANEAN" tint="#eaf2e7" />
      <RouteLayer name="Route · 巴塞罗那到罗马" premountFor={fps} path="M 180 1180 C 430 920 650 900 900 1130" progress={interpolate(frame, [0.25 * fps, 3.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color="#ef3b32" width={12} />
      <Pin name="Pin · 巴塞罗那" premountFor={fps} label="巴塞罗那" color="#ef3b32" style={{left: 100, top: 1130}} />
      <Pin name="Pin · 罗马" premountFor={fps} label="罗马" color="#ef3b32" style={{left: 820, top: 1080}} />
      <Plane name="Plane · 巴塞罗那罗马" premountFor={fps} color="#ffffff" style={{left: 150, top: 1110, translate: interpolate(frame, [0.25 * fps, 3.2 * fps], ['0px 0px', '710px -40px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), rotate: '8deg'}} />
      <Audio name="SFX · 巴塞罗那罗马" src={staticFile('audio/whoosh.wav')} volume={0.28} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene09Rome: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 罗马俯视" premountFor={fps} src="" label="ROME" tint="#eef3e8" style={{scale: 1.12}} />
      <Interactive.Div name="Wash · 罗马留白" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(246,250,255,.94),rgba(246,250,255,.24) 45%,rgba(246,250,255,.12))'}} />
      
      <TextLayer name="Title · ROMA" premountFor={fps} text="ROMA" color="#102d4d" fontSize={108} style={{left: 64, top: 86, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Itinerary · ROMA" premountFor={fps} text="DAY 5 · 走进古罗马" color="#5c7187" fontSize={30} style={{left: 68, top: 224, letterSpacing: 3, opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 罗马斗兽场" premountFor={fps} style={{position: 'absolute', left: 98, top: 1066, width: 684, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [0 * fps, 0.8 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [0 * fps, 1 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 罗马斗兽场"
        premountFor={fps}
        kind="colosseum"
        src={staticFile('landmarks/dioramas/colosseum.png')}
        label="罗马斗兽场"
        tilt={interpolate(frame, [0 * fps, 1.1 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: -10, top: 410, width: 900, height: 680,
          opacity: interpolate(frame, [0 * fps, 0.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [0 * fps, 1.1 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [0 * fps, 1.1 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 罗马斗兽场" premountFor={fps} label="" color="#ef3b32" style={{left: 156, top: 1061, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [0.65 * fps, 1.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 罗马斗兽场" premountFor={fps} text="罗马斗兽场" color="#17334e" fontSize={30} style={{left: 192, top: 1120, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.7 * fps, 1.2 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 万神殿" premountFor={fps} style={{position: 'absolute', left: 478, top: 1576, width: 494, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [1 * fps, 1.8 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [1 * fps, 2 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 万神殿"
        premountFor={fps}
        kind="pantheon"
        src={staticFile('landmarks/dioramas/pantheon.png')}
        label="万神殿"
        tilt={interpolate(frame, [1 * fps, 2.1 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: 400, top: 1030, width: 650, height: 570,
          opacity: interpolate(frame, [1 * fps, 1.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [1 * fps, 2.1 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [1 * fps, 2.1 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 万神殿" premountFor={fps} label="" color="#ef3b32" style={{left: 596, top: 1571, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [1.65 * fps, 2.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 万神殿" premountFor={fps} text="万神殿" color="#17334e" fontSize={30} style={{left: 632, top: 1630, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [1.7 * fps, 2.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.7 * fps, 2.2 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Tip · 斗兽场预约" premountFor={fps} text={'古罗马路线 · 斗兽场 → 万神殿\n提前留意官方售票与入场时段'} color="#24415f" fontSize={29} style={{left: 100, top: 1740, width: 820, padding: '24px 30px', borderRadius: 24, lineHeight: 1.6, whiteSpace: 'pre-line', letterSpacing: 1, fontWeight: 650, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 18px 46px rgba(60,83,108,.12)', opacity: interpolate(frame, [6.5 * fps, 8.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 斗兽场" from={10} src={staticFile('audio/pop.wav')} volume={0.36} premountFor={fps} />
      <Audio name="SFX · 万神殿" from={40} src={staticFile('audio/pop.wav')} volume={0.32} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene10Vatican: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <MapLayer name="Map · 梵蒂冈俯视" premountFor={fps} src="" label="VATICAN CITY" tint="#edf3e9" style={{scale: 1.12}} />
      <Interactive.Div name="Wash · 梵蒂冈留白" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(246,250,255,.94),rgba(246,250,255,.26) 45%,rgba(246,250,255,.12))'}} />
      
      <TextLayer name="Title · VATICAN" premountFor={fps} text="VATICAN" color="#102d4d" fontSize={108} style={{left: 64, top: 86, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Itinerary · VATICAN" premountFor={fps} text="DAY 6 · 文艺复兴的尺度" color="#5c7187" fontSize={30} style={{left: 68, top: 224, letterSpacing: 3, opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <Interactive.Div name="Shadow · 圣彼得大教堂" premountFor={fps} style={{position: 'absolute', left: 145, top: 1456, width: 790, height: 58, borderRadius: '50%', backgroundColor: '#506679', filter: 'blur(22px)', opacity: interpolate(frame, [0 * fps, 0.8 * fps], [0, 0.18], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [0 * fps, 1 * fps], [0.5, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <LandmarkLayer
        name="Landmark · 圣彼得大教堂"
        premountFor={fps}
        kind="vatican"
        src={staticFile('landmarks/dioramas/vatican.png')}
        label="圣彼得大教堂"
        tilt={interpolate(frame, [0 * fps, 1.1 * fps], [-78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}
        style={{
          left: 20, top: 380, width: 1040, height: 1100,
          opacity: interpolate(frame, [0 * fps, 0.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          scale: interpolate(frame, [0 * fps, 1.1 * fps], [0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.spring({damping: 18}), output: 'perceptual-scale'}),
          translate: interpolate(frame, [0 * fps, 1.1 * fps], ['0px 32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)}),
        }}
      />
      <Pin name="Pin · 圣彼得大教堂" premountFor={fps} label="" color="#ef3b32" style={{left: 356, top: 1476, scale: 0.42, transformOrigin: 'left top', opacity: interpolate(frame, [0.65 * fps, 1.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Caption · 圣彼得大教堂" premountFor={fps} text="圣彼得大教堂" color="#17334e" fontSize={30} style={{left: 392, top: 1535, padding: '14px 22px', borderRadius: 18, letterSpacing: 0, backgroundColor: 'rgba(255,255,255,.94)', boxShadow: '0 12px 28px rgba(61,86,108,.1)', opacity: interpolate(frame, [0.7 * fps, 1.2 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.7 * fps, 1.2 * fps], ['0px 16px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Subtitle · 文艺复兴尺度" premountFor={fps} text="圣彼得广场 · 柱廊 · 穹顶" color="#617183" fontSize={36} style={{left: 290, top: 1660, letterSpacing: 1, opacity: interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Audio name="SFX · 圣彼得大教堂" from={10} src={staticFile('audio/pop.wav')} volume={0.4} premountFor={fps} />
    </SceneBase>
  );
};

export const Scene11Montage: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SceneBase>
      <Interactive.Div name="Background · 蒙太奇" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(145deg,#eef6ff,#f9fbff 52%,#e5f0f8)'}} />
      <TextLayer name="Title · 七日建筑记忆" premountFor={fps} text={'7 DAYS\n建筑旅行手记'} color="#102d4d" fontSize={92} style={{left: 64, top: 72, whiteSpace: 'pre-line', lineHeight: 1.1, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <TravelCard
        name="Card · 巴黎铁塔"
        premountFor={fps}
        city="巴黎 · 埃菲尔铁塔"
        kind="eiffel"
        src={staticFile('landmarks/dioramas/eiffel.png')}
        subtitle="DAY 1 · PARIS"
        accentColor="#ef3b32"
        style={{left: 60, top: 370, width: 420, height: 280, rotate: '-3deg', opacity: interpolate(frame, [0 * fps, 0.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0 * fps, 0.55 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 卢浮宫"
        premountFor={fps}
        city="巴黎 · 卢浮宫"
        kind="louvre"
        src={staticFile('landmarks/dioramas/louvre.png')}
        subtitle="DAY 1 · PARIS"
        accentColor="#ef3b32"
        style={{left: 580, top: 350, width: 420, height: 280, rotate: '2deg', opacity: interpolate(frame, [0.25 * fps, 0.65 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.25 * fps, 0.8 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 巴黎圣母院"
        premountFor={fps}
        city="巴黎 · 圣母院"
        kind="notre-dame"
        src={staticFile('landmarks/dioramas/notre-dame.png')}
        subtitle="DAY 2 · PARIS"
        accentColor="#ef3b32"
        style={{left: 95, top: 710, width: 420, height: 280, rotate: '2deg', opacity: interpolate(frame, [0.5 * fps, 0.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.5 * fps, 1.05 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 圣家堂"
        premountFor={fps}
        city="巴塞罗那 · 圣家堂"
        kind="sagrada"
        src={staticFile('landmarks/dioramas/sagrada.png')}
        subtitle="DAY 3 · BARCELONA"
        accentColor="#ef3b32"
        style={{left: 565, top: 690, width: 420, height: 280, rotate: '-2deg', opacity: interpolate(frame, [0.75 * fps, 1.15 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.75 * fps, 1.3 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 巴特罗之家"
        premountFor={fps}
        city="巴塞罗那 · 巴特罗"
        kind="casa"
        src={staticFile('landmarks/dioramas/casa.png')}
        subtitle="DAY 4 · BARCELONA"
        accentColor="#ef3b32"
        style={{left: 60, top: 1050, width: 420, height: 280, rotate: '-2deg', opacity: interpolate(frame, [1 * fps, 1.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1 * fps, 1.55 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 斗兽场"
        premountFor={fps}
        city="罗马 · 斗兽场"
        kind="colosseum"
        src={staticFile('landmarks/dioramas/colosseum.png')}
        subtitle="DAY 5 · ROMA"
        accentColor="#ef3b32"
        style={{left: 580, top: 1030, width: 420, height: 280, rotate: '3deg', opacity: interpolate(frame, [1.25 * fps, 1.65 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.25 * fps, 1.8 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 万神殿"
        premountFor={fps}
        city="罗马 · 万神殿"
        kind="pantheon"
        src={staticFile('landmarks/dioramas/pantheon.png')}
        subtitle="DAY 5 · ROMA"
        accentColor="#ef3b32"
        style={{left: 95, top: 1390, width: 420, height: 280, rotate: '2deg', opacity: interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.5 * fps, 2.05 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Card · 梵蒂冈"
        premountFor={fps}
        city="梵蒂冈 · 圣彼得"
        kind="vatican"
        src={staticFile('landmarks/dioramas/vatican.png')}
        subtitle="DAY 6 · VATICAN"
        accentColor="#ef3b32"
        style={{left: 565, top: 1370, width: 420, height: 280, rotate: '-2deg', opacity: interpolate(frame, [1.75 * fps, 2.15 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.75 * fps, 2.3 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      <TextLayer name="Footer · 七日返程" premountFor={fps} text="DAY 7 · 带着建筑记忆返程" color="#63778c" fontSize={32} style={{left: 275, top: 1770, letterSpacing: 2, opacity: interpolate(frame, [2 * fps, 2.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
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
      <MapLayer name="Map · 欧洲收尾" premountFor={fps} src="" label="" tint="#eaf3ee" style={{opacity: 0.45}} />
      <Interactive.Div name="Wash · 终章冷白渐层" premountFor={fps} style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(237,247,255,.9),rgba(246,250,255,.6) 45%,#eff6fc 96%)'}} />
      <RouteLayer name="Route · 最终路线" premountFor={fps} path="M 165 492 C 350 420 460 570 660 490 S 960 680 895 770" progress={interpolate(frame, [0.2 * fps, 2.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} color="#ef3b32" width={7} style={{opacity: 0.7}} />
      <TextLayer name="Eyebrow · 国庆特别计划" premountFor={fps} text="NATIONAL HOLIDAY · EUROPE" color="#6081a4" fontSize={25} style={{left: 76, top: 65, letterSpacing: 4, opacity: interpolate(frame, [0 * fps, 0.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Title · 国庆欧洲" premountFor={fps} text={'国庆欧洲\n7日建筑巡礼'} color="#0d315f" fontSize={112} style={{left: 70, top: 124, whiteSpace: 'pre-line', lineHeight: 1.04, opacity: interpolate(frame, [0 * fps, 0.75 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0 * fps, 0.9 * fps], ['0px -32px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <TextLayer name="Subtitle · 7 days" premountFor={fps} text="7 DAYS · 3 CITIES · 8 LANDMARKS" color="#526d8d" fontSize={29} style={{left: 76, top: 385, letterSpacing: 2, opacity: interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Plane name="Plane · 线稿装饰" premountFor={fps} color="#5f9bd2" style={{right: 80, top: 300, fontSize: 84, opacity: 0.7, rotate: '-20deg', translate: interpolate(frame, [0.4 * fps, 2.4 * fps], ['120px 20px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <TravelCard
        name="Final Card · 巴黎"
        premountFor={fps}
        city="巴黎 PARIS"
        kind="louvre"
        src={staticFile('landmarks/dioramas/louvre.png')}
        subtitle="DAY 1–2 · 铁塔 / 卢浮宫 / 圣母院"
        accentColor="#ef3b32"
        style={{left: 70, top: 510, width: 425, height: 320, rotate: '-3deg', opacity: interpolate(frame, [0.75 * fps, 1.15 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [0.75 * fps, 1.3 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Final Card · 巴塞罗那"
        premountFor={fps}
        city="巴塞罗那 BARCELONA"
        kind="sagrada"
        src={staticFile('landmarks/dioramas/sagrada.png')}
        subtitle="DAY 3–4 · 圣家堂 / 巴特罗之家"
        accentColor="#ef3b32"
        style={{left: 565, top: 580, width: 425, height: 320, rotate: '3deg', opacity: interpolate(frame, [1 * fps, 1.4 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1 * fps, 1.55 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Final Card · 罗马"
        premountFor={fps}
        city="罗马 ROMA"
        kind="colosseum"
        src={staticFile('landmarks/dioramas/colosseum.png')}
        subtitle="DAY 5 · 斗兽场 / 万神殿"
        accentColor="#ef3b32"
        style={{left: 110, top: 900, width: 425, height: 320, rotate: '2deg', opacity: interpolate(frame, [1.25 * fps, 1.65 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.25 * fps, 1.8 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      
      <TravelCard
        name="Final Card · 梵蒂冈"
        premountFor={fps}
        city="梵蒂冈 VATICAN"
        kind="vatican"
        src={staticFile('landmarks/dioramas/vatican.png')}
        subtitle="DAY 6 · 圣彼得大教堂与广场"
        accentColor="#ef3b32"
        style={{left: 595, top: 970, width: 425, height: 320, rotate: '-2deg', opacity: interpolate(frame, [1.5 * fps, 1.9 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), translate: interpolate(frame, [1.5 * fps, 2.05 * fps], ['0px 42px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})}}
      />
      <Interactive.Div name="Shadow · 终章建筑群" premountFor={fps} style={{position: 'absolute', left: 55, top: 1780, width: 970, height: 60, borderRadius: '50%', backgroundColor: '#72899d', filter: 'blur(28px)', opacity: interpolate(frame, [2.2 * fps, 3.2 * fps], [0, 0.17], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      
      <LandmarkLayer name="Final Landmark · 铁塔" premountFor={fps} kind="eiffel" src={staticFile('landmarks/dioramas/eiffel.png')} label="铁塔" tilt={interpolate(frame, [2 * fps, 3 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 0, top: 1200, width: 310, height: 640, opacity: interpolate(frame, [2 * fps, 2.3 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2 * fps, 3 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      
      <LandmarkLayer name="Final Landmark · 圣家堂" premountFor={fps} kind="sagrada" src={staticFile('landmarks/dioramas/sagrada.png')} label="圣家堂" tilt={interpolate(frame, [2.25 * fps, 3.25 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 210, top: 1320, width: 370, height: 520, opacity: interpolate(frame, [2.25 * fps, 2.55 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2.25 * fps, 3.25 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      
      <LandmarkLayer name="Final Landmark · 斗兽场" premountFor={fps} kind="colosseum" src={staticFile('landmarks/dioramas/colosseum.png')} label="斗兽场" tilt={interpolate(frame, [2.5 * fps, 3.5 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 435, top: 1500, width: 430, height: 340, opacity: interpolate(frame, [2.5 * fps, 2.8 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2.5 * fps, 3.5 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      
      <LandmarkLayer name="Final Landmark · 圣彼得" premountFor={fps} kind="vatican" src={staticFile('landmarks/dioramas/vatican.png')} label="圣彼得" tilt={interpolate(frame, [2.75 * fps, 3.75 * fps], [-65, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.16, 1, 0.3, 1)})} style={{left: 710, top: 1390, width: 390, height: 450, opacity: interpolate(frame, [2.75 * fps, 3.05 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [2.75 * fps, 3.75 * fps], [0.8, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale', easing: Easing.spring({damping: 18})})}} />
      <TextLayer name="Footer · 完整七日路线" premountFor={fps} text="上海 → 巴黎 → 巴塞罗那 → 罗马 · DAY 7 返程" color="#365773" fontSize={25} style={{left: 76, top: 1850, padding: '14px 24px', borderRadius: 18, backgroundColor: 'rgba(255,255,255,.92)', letterSpacing: 1, opacity: interpolate(frame, [3 * fps, 3.6 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}} />
      <Interactive.Div name="Firework · 左" premountFor={fps} style={{position: 'absolute', left: 16, top: 390, width: 120, height: 120, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg,#f0b044 0deg 3deg,transparent 3deg 18deg)', opacity: interpolate(frame, [3.2 * fps, 3.55 * fps, 4.2 * fps], [0, 0.75, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [3.2 * fps, 4.2 * fps], [0.2, 1.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <Interactive.Div name="Firework · 右" premountFor={fps} style={{position: 'absolute', right: 45, top: 110, width: 150, height: 150, borderRadius: '50%', background: 'repeating-conic-gradient(from 0deg,#ef3b32 0deg 2deg,transparent 2deg 16deg)', opacity: interpolate(frame, [3.6 * fps, 4 * fps, 4.8 * fps], [0, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), scale: interpolate(frame, [3.6 * fps, 4.8 * fps], [0.2, 1.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', output: 'perceptual-scale'})}} />
      <Audio name="SFX · 终章卡片" from={28} src={staticFile('audio/shutter.wav')} volume={0.3} premountFor={fps} />
      <Audio name="SFX · 终章建筑" from={70} src={staticFile('audio/pop.wav')} volume={0.38} premountFor={fps} />
    </SceneBase>
  );
};
