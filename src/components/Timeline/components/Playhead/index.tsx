import { RefObject, useEffect, useRef } from 'react';
import { useAppStore } from 'src/store';

import 'src/components/Timeline/components/Playhead/playhead.less';

interface PlayheadProps {
  rulerRef: RefObject<HTMLDivElement | null>;
}

const PADDING = 10;
const PLAYHEAD_WIDTH = 2;

const calcLeft = (rulerRef: RefObject<HTMLDivElement | null>, playedPercent: number) => {
  if (!rulerRef.current) {
    return PADDING;
  }
  const rulerWidth = rulerRef.current.scrollWidth;
  return Math.max(PADDING, rulerWidth * (playedPercent / 100) + PLAYHEAD_WIDTH);
};

const Playhead = ({ rulerRef }: PlayheadProps) => {
  const playedPercent = useAppStore((store) => store.state.playedPercent);
  const playheadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playheadRef.current || !rulerRef.current) {
      return;
    }
    playheadRef.current.style.left = `${calcLeft(rulerRef, playedPercent)}px`;
  }, [playedPercent, rulerRef]);

  return <div ref={playheadRef} className="playhead" />;
};

export { Playhead };
