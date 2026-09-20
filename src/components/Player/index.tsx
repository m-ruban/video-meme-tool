import { useRef, useState, useCallback, useEffect, type ReactNode, type FC } from 'react';
import ReactPlayer from 'react-player';
import classnames from 'classnames';
import { ParticallMeme, useAppStore } from 'src/store';
import { Drop } from 'src/components/Drop';
import { More } from 'src/components/Icon/More';
import { PlayPause } from 'src/components/Icon/PlayPause';
import { Volume } from 'src/components/Icon/Volume';
import { ProgressBar } from 'src/components/ProgressBar';
import { Preview } from 'src/components/Preview';
import { useReplaceAudio } from 'src/api/useReplaceAudio';
import { Rect, roundToPercent } from 'src/components/Preview/utils';

import 'src/components/Player/player.less';

interface PlayerProps {
  meme: ParticallMeme & { originalLink?: string };
  actions?: ReactNode;
}

const DEFAULT_VOLUME = 0.8;

const INITIAL_RECT = {
  x: 80,
  y: 80,
  width: 240,
  height: 160,
};

const Player: FC<PlayerProps> = ({ meme, actions }) => {
  const [showActions, setShowActions] = useState(false);
  const activatorRef = useRef<HTMLDivElement>(null);
  const handleShowActions = () => setShowActions((value) => !value);
  const dispatch = useAppStore((store) => store.dispatch);
  const videoLoaded = useAppStore((store) => store.state.videoLoaded);
  const played = useAppStore((store) => store.state.played);
  const preview = useAppStore((store) => store.state.preview);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const togglePlay = useCallback(() => setPlaying((prev) => !prev), []);
  const [previewState, setPreviewState] = useState<Rect>(INITIAL_RECT);
  const phrases = useAppStore(({ state }) => state.phrases);
  const overlays = useAppStore(({ state }) => state.overlays);
  const replaceAudioRequest = useReplaceAudio();

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
      const seconds = meme.duration * value;
      dispatch({
        type: 'played/set',
        payload: { percent: roundToPercent(value), seconds },
      });
      playerRef.current.seekTo(seconds, 'seconds');
    },
    [dispatch, meme]
  );

  return (
    <div className="player-wrapper">
      <div className={classnames('player', { loaded: videoLoaded })} ref={playerContainerRef}>
        {preview && preview.start <= played.seconds && preview.end >= played.seconds && (
          <Preview
            src={preview.inputImage}
            containerRef={playerContainerRef}
            state={previewState}
            onChange={(value) => setPreviewState(value)}
            onDelete={() => {
              dispatch({ type: 'preview/delete' });
            }}
            onSave={(rect) => {
              const video = playerRef.current?.getInternalPlayer() as HTMLVideoElement | undefined;
              const container = playerContainerRef.current;

              if (!video || !container) {
                return;
              }

              const scaleX = video.videoWidth / container.clientWidth;
              const scaleY = video.videoHeight / container.clientHeight;

              const newOverlay = {
                ...preview,
                x1: Math.round(rect.x * scaleX),
                y1: Math.round(rect.y * scaleY),

                x2: Math.round((rect.x + rect.width) * scaleX),
                y2: Math.round((rect.y + rect.height) * scaleY),
              };

              dispatch({ type: 'overlay/add', payload: newOverlay });
              dispatch({ type: 'preview/delete' });
              dispatch({ type: 'meme-loaded/set', payload: false });

              if (!meme.originalLink) {
                return;
              }

              // send request
              const input = {
                inputVideo: meme.originalLink,
                inputAudio: meme.audio || '',
                phrases: JSON.stringify(phrases),
                overlays: JSON.stringify([...overlays, newOverlay]),
              };

              replaceAudioRequest(input, (result) => {
                dispatch({ type: 'meme/update', payload: result });
              });
            }}
          />
        )}
        <ReactPlayer
          ref={playerRef}
          url={meme.link}
          playing={playing}
          volume={volume}
          controls={false}
          width=""
          height=""
          onProgress={({ played: newPlayed, playedSeconds }) => {
            dispatch({
              type: 'played/set',
              payload: { percent: roundToPercent(newPlayed), seconds: playedSeconds },
            });
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
                <ProgressBar value={played.percent} onChange={handleProgressChange} />
              </div>
              <div className="player-actions-content">
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
                {actions && (
                  <>
                    <div ref={activatorRef} className="player-right-actions">
                      <More onClick={handleShowActions} />
                    </div>
                    <Drop
                      show={showActions}
                      activator={activatorRef}
                      style={{ lineHeight: 0 }}
                      withActivatorWidth={false}
                      closeWithClickOutside
                      onClose={handleShowActions}
                    >
                      {actions}
                    </Drop>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { Player };
