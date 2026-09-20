import { useRef, useCallback, type MouseEvent, useEffect, type FC } from 'react';
import classnames from 'classnames';

import { Meme, useAppStore } from 'src/store';
import { Playhead } from 'src/components/Timeline/components/Playhead';
import { Ruler } from 'src/components/Timeline/components/Ruler';
import { VideoTrack } from 'src/components/Timeline/components/VideoTrack';
import { Waveform } from 'src/components/Timeline/components/Waveform';
import { Overlays } from 'src/components/Timeline/components/Overlays';
import { Ruler as RulerIcon } from 'src/components/Icon/Ruler';
import { Waveform as WaveformIcon } from 'src/components/Icon/Waveform';
import { SlideShow } from 'src/components/Icon/SlideShow';
import { Image } from 'src/components/Icon/Image';

import 'src/components/Timeline/timeline.less';

interface TimelineProps {
  meme: Meme;
}

const updateShadows = (timeline: HTMLDivElement, timelineScrollableDiv: HTMLDivElement) => {
  const scrollLeft = timelineScrollableDiv.scrollLeft;
  const scrollWidth = timelineScrollableDiv.scrollWidth;
  const clientWidth = timelineScrollableDiv.clientWidth;
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
      if (!timelineScrollableRef.current || !playerInstance || !rulerRef.current) {
        return;
      }

      const rulerRect = rulerRef.current.getBoundingClientRect();
      const clickX = event.clientX - rulerRect.left;
      const percentNumber = Math.min(1, Math.max(0, clickX / rulerRef.current.scrollWidth));
      const seconds = meme.duration * percentNumber;

      dispatch({ type: 'played/set', payload: { percent: percentNumber * 100, seconds } });
      playerInstance.seekTo(seconds, 'seconds');
    },
    [dispatch, playerInstance, meme]
  );

  return (
    <>
      <div className="timeline-wrapper">
        <div ref={timelineRef} className={classnames('timeline', { loaded: videoLoaded })}>
          <div className="toolbar">
            <div className="toolbar-ruler-icon">
              <RulerIcon />
            </div>
            <div className="toolbar-waveform-icon">
              <WaveformIcon />
            </div>
            <div className="toolbar-overlay-icon">
              <Image />
            </div>
            <div className="toolbar-slide-show-icon">
              <SlideShow />
            </div>
          </div>
          {videoLoaded && (
            <div ref={timelineScrollableRef} className="timeline-scrollable" onClick={handleClick}>
              <Ruler ref={rulerRef} duration={meme.duration} />
              <Waveform meme={meme} />
              <Overlays rulerRef={rulerRef} meme={meme} />
              <VideoTrack frames={meme.frames} />
              <Playhead rulerRef={rulerRef} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export { Timeline };
