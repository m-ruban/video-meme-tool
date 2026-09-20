import { useEffect, RefObject } from 'react';

import { Meme } from 'src/store';

const OVERLAY_PADDING = 10;
const OVERLAY_BORDER = 1;

export const useSelectionLayerMetric = (
  rulerRef: RefObject<HTMLDivElement | null>,
  selectionLayerRef: RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    if (!selectionLayerRef.current || !rulerRef.current) {
      return;
    }
    selectionLayerRef.current.style.width = `${rulerRef.current.scrollWidth - OVERLAY_PADDING - OVERLAY_BORDER * 2}px`;
  }, [rulerRef, selectionLayerRef]);
};

export const addPeriod = (seconds: number, meme: Meme, period = 0.01) => {
  const newSeconds = seconds + period;
  const percent = (newSeconds / meme.duration) * 100;
  return {
    seconds: newSeconds,
    percent,
  };
};
