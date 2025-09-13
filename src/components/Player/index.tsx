import { useRef, useState, useCallback, useEffect } from 'react';
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

const roundToPercent = (value: number) => Math.round(value * 1000) / 10;

const DEFAULT_VOLUME = 0.8;

const Player = ({ meme }: PlayerProps) => {
  const dispatch = useAppStore((store) => store.dispatch);
  const videoLoaded = useAppStore((store) => store.state.videoLoaded);
  const playedPercent = useAppStore((store) => store.state.playedPercent);
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const togglePlay = useCallback(() => setPlaying((prev) => !prev), []);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }
    dispatch({ type: 'player-instance/set', payload: playerRef.current });
  }, [dispatch]);

  const handleVolumeChange = useCallback((value: number) => {
    setVolume(value);
  }, []);

  const handleProgressChange = useCallback(
    (value: number) => {
      if (!playerRef.current) {
        return;
      }
      dispatch({ type: 'played-percent/set', payload: roundToPercent(value) });
      playerRef.current.seekTo(meme.duration * value, 'seconds');
    },
    [dispatch, meme]
  );

  return (
    <div className={classnames('player', { loaded: videoLoaded })}>
      <ReactPlayer
        ref={playerRef}
        url={meme.link}
        playing={playing}
        volume={volume}
        controls={false}
        width=""
        height=""
        onProgress={({ played: newPlayed }) => {
          dispatch({ type: 'played-percent/set', payload: roundToPercent(newPlayed) });
        }}
        onReady={() => {
          dispatch({ type: 'meme-loaded/set', payload: true });
        }}
        progressInterval={100}
        onEnded={() => {
          togglePlay();
        }}
      />
      {videoLoaded && (
        <div className="player-actions-wrapper">
          <div className="player-actions">
            <div className="player-duration-progress-bar">
              <ProgressBar value={playedPercent} onChange={handleProgressChange} />
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
      )}
    </div>
  );
};

export { Player };
