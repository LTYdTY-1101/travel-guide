import {Composition, Folder} from 'remotion';
import {EuropeTravelVideo} from './EuropeTravelVideo';
import {ChinaFirstLegPreview} from './ChinaFirstLegPreview';
import {
  Scene01Messages,
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

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Europe7DayInteractive"
        component={EuropeTravelVideo}
        durationInFrames={2664}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition id="ChinaFirstLegPreview" component={ChinaFirstLegPreview} durationInFrames={660} fps={30} width={1080} height={1920} />
      <Folder name="Scenes">
        <Composition id="Scene01-Messages" component={Scene01Messages} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="Scene04-FlightToEurope" component={Scene04FlightToEurope} durationInFrames={240} fps={30} width={1080} height={1920} />
        <Composition id="Scene05-Paris" component={Scene05Paris} durationInFrames={360} fps={30} width={1080} height={1920} />
        <Composition id="Scene06-ParisBarcelona" component={Scene06ParisBarcelona} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Scene07-Barcelona" component={Scene07Barcelona} durationInFrames={300} fps={30} width={1080} height={1920} />
        <Composition id="Scene08-BarcelonaRome" component={Scene08BarcelonaRome} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Scene09-Rome" component={Scene09Rome} durationInFrames={300} fps={30} width={1080} height={1920} />
        <Composition id="Scene10-Vatican" component={Scene10Vatican} durationInFrames={180} fps={30} width={1080} height={1920} />
        <Composition id="Scene11-Montage" component={Scene11Montage} durationInFrames={120} fps={30} width={1080} height={1920} />
        <Composition id="Scene12-Finale" component={Scene12Finale} durationInFrames={300} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
