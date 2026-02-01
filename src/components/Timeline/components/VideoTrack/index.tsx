import { FC } from 'react';
import 'src/components/Timeline/components/VideoTrack/video-track.less';

interface VideoTrackProps {
  frames: string[];
}

const VideoTrack: FC<VideoTrackProps> = ({ frames }) => {
  return (
    <div className="video-track-wrapper">
      <div className="video-track">
        {frames.map((frame, index) => (
          <div key={frame} className="video-track-frame">
            <img src={frame} alt={`frame ${index}`} draggable="false" />
          </div>
        ))}
      </div>
    </div>
  );
};

export { VideoTrack };
