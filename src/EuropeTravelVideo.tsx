import {Series, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {DomesticFirstLeg} from './components/DomesticFirstLeg';
import {
  Scene01Messages,
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
        <Series.Sequence name="01 · 对话到地图与机票" durationInFrames={240} premountFor={fps}>
          <Scene01Messages domesticTicket />
        </Series.Sequence>
        <Series.Sequence name="02 · 上海到三亚湾、汽车到万宁兴隆" durationInFrames={624} premountFor={fps}>
          <DomesticFirstLeg />
        </Series.Sequence>
        <Series.Sequence name="05 · 巴黎建筑" durationInFrames={360} premountFor={fps}>
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
      <Audio name="BGM · 120 BPM" src={staticFile('audio/bgm-120bpm.wav')} volume={0.17} loop premountFor={fps} />
    </>
  );
};
