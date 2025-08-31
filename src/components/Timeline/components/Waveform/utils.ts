import { useEffect, MouseEventHandler, RefObject } from 'react';
import { Phrase } from 'src/store';

export interface Position {
  x: number;
  y: number;
}

export type Boundary = { left?: Phrase; right?: Phrase };

export const cancelEvent: MouseEventHandler<HTMLDivElement> = (event) => event.stopPropagation();

export function findBoundaryPhrases(phrases: Phrase[], x: number): Boundary {
  let leftBoundary: Phrase | undefined;
  let rightBoundary: Phrase | undefined;
  for (const phrase of phrases) {
    // левая граница
    if (phrase.right < x) {
      if (!leftBoundary || phrase.right > leftBoundary.right) {
        leftBoundary = phrase;
      }
    }
    // правая граница
    if (phrase.left > x) {
      if (!rightBoundary || phrase.left < rightBoundary.left) {
        rightBoundary = phrase;
      }
    }
  }
  return { left: leftBoundary, right: rightBoundary };
}

export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

export const useInputFocus = (inputRef: RefObject<HTMLInputElement | null>, focus: boolean) => {
  useEffect(() => {
    if (!inputRef.current || !focus) {
      return;
    }
    inputRef.current.focus();
  }, [focus, inputRef]);
};

export const useSelectionLayerMetric = (
  imgRef: RefObject<HTMLImageElement | null>,
  selectionLayerRef: RefObject<HTMLDivElement | null>
) => {
  useEffect(() => {
    if (!imgRef.current || !selectionLayerRef.current) {
      return;
    }
    const updateBarWidth = () => {
      if (!imgRef.current || !selectionLayerRef.current) {
        return;
      }
      selectionLayerRef.current.style.width = imgRef.current.scrollWidth + 'px';
    };
    const resizeObserver = new ResizeObserver(updateBarWidth);
    resizeObserver.observe(imgRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [imgRef, selectionLayerRef]);
};
