import { type MouseEventHandler, type RefObject } from 'react';
import { Meme } from 'src/store';

export interface Position {
  x: number;
  y: number;
}

export type Boundary = { left?: number; right?: number };

export const cancelEvent: MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation();

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export type Metrics = {
  start: number;
  duration: number;
  percent: number;
  left: number;
  width: number;
};

export const getMetricBasedOnSelection = (
  selectionLayerRef: RefObject<HTMLDivElement | null>,
  selectionRef: RefObject<HTMLDivElement | null>,
  meme: Meme
): Metrics => {
  if (!selectionRef.current || !selectionLayerRef.current) {
    return {
      start: 0,
      duration: 0,
      percent: 0,
      left: 0,
      width: 0,
    };
  }

  const selectionLayerRect = selectionLayerRef.current.getBoundingClientRect();
  const selectionRect = selectionRef.current.getBoundingClientRect();
  const selectionWidth = selectionRect.right - selectionRect.left;
  const left = selectionRect.left - selectionLayerRect.left;
  const percent = left / selectionLayerRect.width;
  const start = meme.duration * percent;
  const duration = meme.duration * (selectionWidth / selectionLayerRect.width);

  return {
    start,
    duration,
    percent,
    left,
    width: selectionRect.width,
  };
};
