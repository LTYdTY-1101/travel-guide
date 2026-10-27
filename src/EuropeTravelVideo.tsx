import {Audio} from '@remotion/media';
import {Series, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
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
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
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
      <Audio
        name="Music · 120 BPM Background"
        src={staticFile('audio/bgm-120bpm.wav')}
        premountFor={fps}
        volume={interpolate(
          frame,
          [0, 1 * fps, durationInFrames - 2 * fps, durationInFrames - 1],
          [0, 0.42, 0.42, 0],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          },
        )}
      />
    </>
  );
};
