import { RefObject, useEffect, useRef, type FC } from 'react';
import { useAppStore } from 'src/store';

import 'src/components/Timeline/components/Playhead/playhead.less';

interface PlayheadProps {
  rulerRef: RefObject<HTMLDivElement | null>;
}

const TIMELINE_PADDING = 10;
const PLAYHEAD_OFFSET = 1; // 2 playhead width

const calcLeft = (rulerRef: RefObject<HTMLDivElement | null>, playedPercent: number) => {
  if (!rulerRef.current) {
    return TIMELINE_PADDING;
  }

  return TIMELINE_PADDING + rulerRef.current.scrollWidth * (playedPercent / 100) - PLAYHEAD_OFFSET;
};

const Playhead: FC<PlayheadProps> = ({ rulerRef }) => {
  const played = useAppStore((store) => store.state.played);
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playheadRef.current || !rulerRef.current) {
      return;
    }
    playheadRef.current.style.left = `${calcLeft(rulerRef, played.percent)}px`;
  }, [played, rulerRef]);

  return <div ref={playheadRef} className="playhead" />;
};

export { Playhead };
