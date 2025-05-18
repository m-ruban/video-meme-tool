import { useRef, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import classnames from 'classnames';
import { Meme, useAppStore } from 'src/store';
import { PlayPause } from 'src/components/Icon/PlayPause';
import { Volume } from 'src/components/Icon/Volume';
import { ProgressBar } from 'src/components/ProgressBar';

import 'src/components/Player/player.less';

interface PlayerProps {
  meme: Meme;
}

const DEFAULT_VOLUME = 0.8;

const Player = ({ meme }: PlayerProps) => {
  const dispatch = useAppStore((store) => store.dispatch);
  const videoLoaded = useAppStore((store) => store.state.videoLoaded);
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [played, setPlayed] = useState(0);
  const togglePlay = useCallback(() => setPlaying((prev) => !prev), []);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
  }, []);

  const handleProgressChange = useCallback(
    (value: number) => {
      const duration = meme.duration;
      const newTime = duration * value;
      playerRef.current?.seekTo(newTime);
      setPlayed(Math.round(value * 100));
    },
    [meme]
  );

  return (
    <div className={classnames('player', { player_ready: videoLoaded })}>
      <ReactPlayer
        ref={playerRef}
        url={meme.link}
        playing={playing}
        volume={volume}
        controls={false}
        width=""
        height=""
        onProgress={({ played: newPlayed }) => {
          setPlayed(Math.round(newPlayed * 100));
        }}
        onReady={() => {
          dispatch({ type: 'meme-loaded/set', payload: true });
        }}
        progressInterval={200}
        onEnded={() => {
          togglePlay();
        }}
      />
      <div className="player-actions-wrapper">
        <div className="player-actions">
          <div className="player-progress-bar">
            <ProgressBar value={played} onChange={handleProgressChange} />
          </div>
          <div className="player-play" onClick={togglePlay}>
            <PlayPause playing={playing} />
          </div>
          <div className="player-volume">
            <div className="player-volume-icon">
              <Volume />
            </div>
            <div className="player-volume-progress-bar">
              <ProgressBar value={volume * 100} onChange={handleVolumeChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Player };
