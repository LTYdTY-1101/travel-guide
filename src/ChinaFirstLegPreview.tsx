import {Audio} from '@remotion/media';
import {Series, staticFile, useVideoConfig} from 'remotion';
import {DomesticFirstLeg} from './components/DomesticFirstLeg';
import {Scene01Messages} from './scenes/Scenes';

export const ChinaFirstLegPreview: React.FC = () => {
  const {fps} = useVideoConfig();
  return <>
    <Series>
      <Series.Sequence name="机票退出 · 浦东机场" durationInFrames={36} premountFor={fps}>
        <Scene01Messages timeOffsetFrames={204} domesticTicket />
      </Series.Sequence>
      <Series.Sequence name="浦东 → 三亚湾 → 万宁兴隆" durationInFrames={624} premountFor={fps}>
        <DomesticFirstLeg />
      </Series.Sequence>
    </Series>
    <Audio name="BGM · 120 BPM" src={staticFile('audio/bgm-120bpm.wav')} volume={.17} loop premountFor={fps} />
  </>;
};
