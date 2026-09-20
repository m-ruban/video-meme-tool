import { useRef, useCallback, MouseEventHandler, RefObject } from 'react';
import { Position, Boundary, clamp } from 'src/components/Selection/utils';

interface UseSelectionResult {
  selectionLayerRef: RefObject<HTMLDivElement | null>;
  selectionRef: RefObject<HTMLDivElement | null>;
  handleMouseDown: MouseEventHandler<HTMLDivElement | null>;
  clear: VoidFunction;
}

const MIN_SELECTION = 25;

export const useSelection = (
  onSelectionStart: () => void,
  onSelectionEnd: VoidFunction,
  findBoundary: (startX: number) => Boundary
): UseSelectionResult => {
  const selectionLayerRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<Position | null>(null);
  const boundaryRef = useRef<Boundary>({});

  const clearSelection = useCallback(() => {
    if (!selectionRef.current) {
      return;
    }
    selectionRef.current.style.left = `0px`;
    selectionRef.current.style.width = `0px`;
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!startPosRef.current || !selectionLayerRef.current || !selectionRef.current) {
      return;
    }

    const { left: leftBoundary, right: rightBoundary } = boundaryRef.current;
    const startPos = startPosRef.current;
    const rect = selectionLayerRef.current.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const leftBoundaryValue = leftBoundary ?? Number.NEGATIVE_INFINITY;
    const rightBoundaryValue = rightBoundary ?? Number.POSITIVE_INFINITY;

    const anchor = clamp(startPos.x, leftBoundaryValue, rightBoundaryValue);
    const cursor = clamp(currentX, leftBoundaryValue, rightBoundaryValue);
    const left = Math.min(anchor, cursor);
    const right = Math.max(anchor, cursor);

    selectionRef.current.style.left = `${left}px`;
    selectionRef.current.style.width = `${Math.max(0, right - left)}px`;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!selectionRef.current) {
      return;
    }
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    const rect = selectionRef.current.getBoundingClientRect();
    startPosRef.current = null;
    if (rect.width < MIN_SELECTION) {
      clearSelection();
      return;
    }
    onSelectionEnd();
  }, [handleMouseMove, clearSelection, onSelectionEnd]);

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (!selectionLayerRef.current || !selectionRef.current) {
        return;
      }
      event.stopPropagation();
      const rect = selectionLayerRef.current.getBoundingClientRect();
      const startX = event.clientX - rect.left;
      const startY = event.clientY - rect.top;
      startPosRef.current = { x: startX, y: startY };
      selectionRef.current.style.left = `${startX}px`;
      selectionRef.current.style.width = `0px`;
      boundaryRef.current = findBoundary(startX);
      onSelectionStart();

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp, onSelectionStart, findBoundary]
  );

  return {
    selectionLayerRef,
    selectionRef,
    handleMouseDown,
    clear: clearSelection,
  };
};
