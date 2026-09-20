import { RefObject } from 'react';

export type ResizeMode = 'top' | 'right' | 'bottom' | 'left';

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DragAction = {
  type: 'drag';
  startMouseX: number;
  startMouseY: number;
  startRect: Rect;
};

export type ResizeAction = {
  type: 'resize';
  mode: ResizeMode;
  startMouseX: number;
  startMouseY: number;
  startRect: Rect;
};

export type Action = DragAction | ResizeAction | null;

export type DraggableResizableImageProps = {
  src: string;
  containerRef: RefObject<HTMLDivElement | null>;
  state: Rect;
  onChange: (value: Rect) => void;
  onDelete?: VoidFunction;
  onSave?: (value: Rect) => void;
  initialRect?: Rect;
  minWidth?: number;
  minHeight?: number;
};

export const roundToPercent = (value: number) => Math.round(value * 1000) / 10;
