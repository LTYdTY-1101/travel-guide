import {LocationLowerThird} from './location-lower-third.element';
import {Series, useVideoConfig} from 'remotion';
import {
  Scene01Messages,
  Scene02Departure,
  Scene03CardCompact,
  Scene04FlightToEurope,
  Scene05Paris,
  Scene06ParisBarcelona,
  Scene07Barcelona,
  Scene08BarcelonaRome,
  Scene09Rome,
  Scene10Vatican,
  Scene11Montage,
  Scene12Finale,
} from './scenes/Scenes';

export const EuropeTravelVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      <Series>
        <Series.Sequence name="01 · 苹果信息开场" durationInFrames={120} premountFor={fps}>
          <Scene01Messages />
        </Series.Sequence>
        <Series.Sequence name="02 · 上海出发信息卡" durationInFrames={120} premountFor={fps}>
          <Scene02Departure />
        </Series.Sequence>
        <Series.Sequence name="03 · 信息卡缩小吸附" durationInFrames={120} premountFor={fps}>
          <Scene03CardCompact />
        </Series.Sequence>
        <Series.Sequence name="04 · 上海飞往巴黎" durationInFrames={120} premountFor={fps}>
          <Scene04FlightToEurope />
        </Series.Sequence>
        <Series.Sequence name="05 · 巴黎建筑" durationInFrames={240} premountFor={fps}>
          <Scene05Paris />
        </Series.Sequence>
        <Series.Sequence name="06 · 巴黎到巴塞罗那" durationInFrames={120} premountFor={fps}>
          <Scene06ParisBarcelona />
        </Series.Sequence>
        <Series.Sequence name="07 · 巴塞罗那建筑" durationInFrames={300} premountFor={fps}>
          <Scene07Barcelona />
        </Series.Sequence>
        <Series.Sequence name="08 · 巴塞罗那到罗马" durationInFrames={120} premountFor={fps}>
          <Scene08BarcelonaRome />
        </Series.Sequence>
        <Series.Sequence name="09 · 罗马建筑" durationInFrames={300} premountFor={fps}>
          <Scene09Rome />
        </Series.Sequence>
        <Series.Sequence name="10 · 梵蒂冈建筑" durationInFrames={180} premountFor={fps}>
          <Scene10Vatican />
        </Series.Sequence>
        <Series.Sequence name="11 · 七日建筑手记" durationInFrames={120} premountFor={fps}>
          <Scene11Montage />
        </Series.Sequence>
        <Series.Sequence name="12 · 丰富终章" durationInFrames={300} premountFor={fps}>
          <Scene12Finale />
        </Series.Sequence>
      </Series>
      <LocationLowerThird name="地点登场 · 中国 · 上海" location="中国 · 上海" icon="pin" customIcon="" iconSize={104} iconColor="#2563eb" fontSize={54} textColor="#18181b" fontFamily="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif" from={4 * fps} durationInFrames={12 * fps} premountFor={fps} style={{position: 'absolute', left: 8, top: 72, width: 960, minHeight: 138}} />
      <LocationLowerThird name="地点登场 · 法国 · 巴黎" location="法国 · 巴黎" icon="pin" customIcon="" iconSize={104} iconColor="#2563eb" fontSize={54} textColor="#18181b" fontFamily="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif" from={16 * fps} durationInFrames={12 * fps} premountFor={fps} style={{position: 'absolute', left: 8, top: 72, width: 960, minHeight: 138}} />
      <LocationLowerThird name="地点登场 · 西班牙 · 巴塞罗那" location="西班牙 · 巴塞罗那" icon="pin" customIcon="" iconSize={104} iconColor="#2563eb" fontSize={54} textColor="#18181b" fontFamily="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif" from={28 * fps} durationInFrames={14 * fps} premountFor={fps} style={{position: 'absolute', left: 8, top: 72, width: 960, minHeight: 138}} />
      <LocationLowerThird
        name="地点登场 · 意大利 · 罗马"
        location="意大利 · 罗马"
        icon="pin"
        customIcon=""
        iconSize={80}
        iconColor={'#ff3232'}
        fontSize={54}
        textColor="#18181b"
        fontFamily="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif"
        from={42 * fps}
        durationInFrames={10 * fps}
        premountFor={fps}
        style={{position: 'absolute', left: 8, top: 72, width: 960, minHeight: 138}}
      />
      <LocationLowerThird name="地点登场 · 梵蒂冈" location="梵蒂冈" icon="pin" customIcon="" iconSize={104} iconColor="#2563eb" fontSize={54} textColor="#18181b" fontFamily="PingFang SC, Microsoft YaHei, Noto Sans CJK SC, Arial, sans-serif" from={52 * fps} durationInFrames={6 * fps} premountFor={fps} style={{position: 'absolute', left: 8, top: 72, width: 960, minHeight: 138}} />
    </>
  );
};
