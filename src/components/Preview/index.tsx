import { FC, MouseEvent as ReactMouseEvent, useCallback, useEffect, useRef } from 'react';

import { ResizeView } from 'src/components/Preview/ResizeView';
import { XsmallCross } from 'src/components/Icon/XsmallCross';
import { XsmallSave } from 'src/components/Icon/XsmallSave';
import {
  Rect,
  Action,
  DraggableResizableImageProps,
  ResizeMode,
} from 'src/components/Preview/utils';

import 'src/components/Preview/preview.less';

const MIN_WIDTH = 40;
const MIN_HEIGHT = 40;

export const Preview: FC<DraggableResizableImageProps> = ({
  src,
  containerRef,
  state,
  onChange,
  onDelete,
  onSave,
}) => {
  const actionRef = useRef<Action>(null);
  const onChangeRef = useRef<(value: Rect) => void>(onChange);

  const clampRectToContainer = useCallback(
    (next: Rect): Rect => {
      const container = containerRef.current;
      if (!container) {
        return next;
      }

      const maxWidth = container.clientWidth;
      const maxHeight = container.clientHeight;

      let width = Math.max(MIN_WIDTH, Math.min(next.width, maxWidth));
      let height = Math.max(MIN_HEIGHT, Math.min(next.height, maxHeight));

      let x = next.x;
      let y = next.y;

      x = Math.max(0, Math.min(x, maxWidth - width));
      y = Math.max(0, Math.min(y, maxHeight - height));

      return { x, y, width, height };
    },
    [containerRef]
  );

  const stopAction = useCallback(() => {
    actionRef.current = null;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const action = actionRef.current;
      if (!action) {
        return;
      }

      const dx = e.clientX - action.startMouseX;
      const dy = e.clientY - action.startMouseY;

      if (action.type === 'drag') {
        const next = clampRectToContainer({
          ...action.startRect,
          x: action.startRect.x + dx,
          y: action.startRect.y + dy,
        });

        onChangeRef.current(next);
        return;
      }

      const { startRect, mode } = action;

      let nextX = startRect.x;
      let nextY = startRect.y;
      let nextWidth = startRect.width;
      let nextHeight = startRect.height;

      if (mode === 'right') {
        nextWidth = startRect.width + dx;
      }

      if (mode === 'left') {
        nextWidth = startRect.width - dx;
        nextX = startRect.x + dx;
      }

      if (mode === 'bottom') {
        nextHeight = startRect.height + dy;
      }

      if (mode === 'top') {
        nextHeight = startRect.height - dy;
        nextY = startRect.y + dy;
      }

      if (nextWidth < MIN_WIDTH) {
        if (mode === 'left') {
          nextX = startRect.x + (startRect.width - MIN_WIDTH);
        }
        nextWidth = MIN_WIDTH;
      }

      if (nextHeight < MIN_HEIGHT) {
        if (mode === 'top') {
          nextY = startRect.y + (startRect.height - MIN_HEIGHT);
        }
        nextHeight = MIN_HEIGHT;
      }

      onChangeRef.current(
        clampRectToContainer({
          x: nextX,
          y: nextY,
          width: nextWidth,
          height: nextHeight,
        })
      );
    },
    [clampRectToContainer]
  );

  const startDrag = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      actionRef.current = {
        type: 'drag',
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startRect: state,
      };
    },
    [state]
  );

  const startResize = useCallback(
    (mode: ResizeMode) => (e: ReactMouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      actionRef.current = {
        type: 'resize',
        mode,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startRect: state,
      };
    },
    [state]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopAction);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopAction);
    };
  }, [handleMouseMove, stopAction]);

  return (
    <div
      onMouseDown={startDrag}
      style={{
        left: state.x,
        top: state.y,
        width: state.width,
        height: state.height,
      }}
      className="preview-container"
    >
      <img src={src} alt="" draggable={false} className="preview-image" />
      <ResizeView handle="top" onMouseDown={startResize('top')} />
      <ResizeView handle="right" onMouseDown={startResize('right')} />
      <ResizeView handle="bottom" onMouseDown={startResize('bottom')} />
      <ResizeView handle="left" onMouseDown={startResize('left')} />
      <div
        className="preview-action preview-action-close"
        onClick={(event) => {
          onDelete?.();
          event.stopPropagation();
        }}
      >
        <XsmallCross />
      </div>
      <div
        className="preview-action preview-action-save"
        onClick={(event) => {
          onSave?.(state);
          event.stopPropagation();
        }}
      >
        <XsmallSave />
      </div>
    </div>
  );
};
