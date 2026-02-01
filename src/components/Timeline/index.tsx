import { useRef, useCallback, type MouseEvent, useEffect, type FC } from 'react';
import classnames from 'classnames';

import { Meme, useAppStore } from 'src/store';
import { Playhead } from 'src/components/Timeline/components/Playhead';
import { Ruler } from 'src/components/Timeline/components/Ruler';
import { VideoTrack } from 'src/components/Timeline/components/VideoTrack';
import { Waveform } from 'src/components/Timeline/components/Waveform';
import { Typography } from 'src/components/Typography';
import { getTrl } from 'src/lang/trls';

import 'src/components/Timeline/timeline.less';

interface TimelineProps {
  meme: Meme;
}

const updateShadows = (timeline: HTMLDivElement, timelineScrollableDiv: HTMLDivElement) => {
  const scrollLeft = timelineScrollableDiv.scrollLeft;
  const scrollWidth = timelineScrollableDiv.scrollWidth;
  const clientWidth = timelineScrollableDiv.clientWidth;
  timeline.style.setProperty('--shadow-left', scrollLeft > 0 ? '1' : '0');
  timeline.style.setProperty('--shadow-right', scrollLeft + clientWidth < scrollWidth ? '1' : '0');
};

const Timeline: FC<TimelineProps> = ({ meme }) => {
  const dispatch = useAppStore((store) => store.dispatch);
  const playerInstance = useAppStore((store) => store.state.playerInstance);
  const rulerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineScrollableRef = useRef<HTMLDivElement>(null);
  const videoLoaded = useAppStore((store) => store.state.videoLoaded);

  useEffect(() => {
    if (!timelineRef.current || !timelineScrollableRef.current || !videoLoaded) {
      return;
    }
    const timelineDiv = timelineRef.current;
    const timelineScrollableDiv = timelineScrollableRef.current;
    const updateShadowsOnTimeline = () => {
      updateShadows(timelineDiv, timelineScrollableDiv);
    };

    updateShadowsOnTimeline();
    timelineScrollableDiv.addEventListener('scroll', updateShadowsOnTimeline);
    window.addEventListener('resize', updateShadowsOnTimeline);

    return () => {
      timelineScrollableDiv.removeEventListener('scroll', updateShadowsOnTimeline);
      window.removeEventListener('resize', updateShadowsOnTimeline);
    };
  }, [videoLoaded]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!timelineScrollableRef.current || !playerInstance) {
        return;
      }
      const timelineScrollableDiv = timelineScrollableRef.current;
      const timelineScrollableRect = timelineScrollableDiv.getBoundingClientRect();
      const clickX =
        event.clientX - timelineScrollableRect.left + timelineScrollableRef.current.scrollLeft;
      const percentNumber = clickX / timelineScrollableRef.current.scrollWidth; // 0.XXXXXX
      const percentRaw = percentNumber * 100; // XX.XXXX
      const percent = Math.min(100, Math.max(0, Math.round(percentRaw * 10) / 10)); // ~XX.X
      dispatch({ type: 'played-percent/set', payload: percent });
      playerInstance.seekTo(meme.duration * percentNumber, 'seconds');
    },
    [dispatch, playerInstance, meme]
  );

  return (
    <>
      <div className="timeline-wrapper">
        <div ref={timelineRef} className={classnames('timeline', { loaded: videoLoaded })}>
          {videoLoaded && (
            <div ref={timelineScrollableRef} className="timeline-scrollable" onClick={handleClick}>
              <Ruler ref={rulerRef} duration={meme.duration} />
              <VideoTrack frames={meme.frames} />
              <Waveform meme={meme} />
              <Playhead rulerRef={rulerRef} />
            </div>
          )}
        </div>
      </div>
      <div className="timeline-advice-wripper">
        <div className={classnames('timeline-advice', { loaded: videoLoaded })}>
          {videoLoaded && <Typography>{getTrl('editAudioAdvice')}</Typography>}
        </div>
      </div>
    </>
  );
};

export { Timeline };
