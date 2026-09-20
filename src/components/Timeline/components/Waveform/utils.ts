import { useEffect, RefObject } from 'react';
import { Phrase } from 'src/store';
import { Boundary } from 'src/components/Selection';

export function findBoundaryPhrases(x: number, phrases: Phrase[]): Boundary {
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
  return { left: leftBoundary?.right, right: rightBoundary?.left };
}

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
