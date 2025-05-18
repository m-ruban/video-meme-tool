import 'src/components/Timeline/components/VideoTrack/video-track.less';

interface VideoTrackProps {
  frames: string[];
}

const VideoTrack = ({ frames }: VideoTrackProps) => {
  return (
    <div className="video-track-wrapper">
      <div className="video-track">
        {frames.map((frame, index) => (
          <div key={frame} className="video-track-frame">
            <img src={frame} alt={`frame ${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { VideoTrack };
