import { Meme } from 'src/store';
import { VideoTrack } from 'src/components/Timeline/components/VideoTrack';

import 'src/components/Timeline/timeline.less';

interface TimelineProps {
  meme: Meme;
}

const Timeline = ({ meme }: TimelineProps) => {
  return (
    <div className="timeline-wrapper">
      <div className="timeline">
        <div>TimeRuler</div>
        <div>
          <VideoTrack frames={meme.frames} />
        </div>
        <div>waveform</div>
      </div>
    </div>
  );
};

export { Timeline };
