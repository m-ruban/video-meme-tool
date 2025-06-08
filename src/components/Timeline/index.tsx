import { Meme } from 'src/store';
import { Playhead } from 'src/components/Timeline/components/Playhead';
import { Ruler } from 'src/components/Timeline/components/Ruler';
import { VideoTrack } from 'src/components/Timeline/components/VideoTrack';
import { Waveform } from 'src/components/Timeline/components/Waveform';

import 'src/components/Timeline/timeline.less';

interface TimelineProps {
  meme: Meme;
}

const Timeline = ({ meme }: TimelineProps) => {
  return (
    <div className="timeline-wrapper">
      <div className="timeline">
        <div className="timeline-scrollable">
          <Ruler duration={meme.duration} />
          <VideoTrack frames={meme.frames} />
          <Waveform path={meme.waveform} />
          <Playhead />
        </div>
      </div>
    </div>
  );
};

export { Timeline };
