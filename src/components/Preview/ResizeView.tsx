import { CSSProperties, FC, MouseEvent as ReactMouseEvent } from 'react';

import { ResizeMode } from 'src/components/Preview/utils';

import 'src/components/Preview/resize-view.less';

type ResizeHandleViewProps = {
  handle: ResizeMode;
  onMouseDown: (e: ReactMouseEvent<HTMLDivElement>) => void;
};

const WIDTH_ANCHOR = 10;
const HEIGHT_ANCHOR = 20;
const BORDER_WIDTH = 2;
const POSITION = -WIDTH_ANCHOR / 2 - BORDER_WIDTH / 2;

const STYLES_BY_HANDLE: Record<ResizeMode, CSSProperties> = {
  top: {
    top: POSITION,
    left: '50%',
    transform: 'translateX(-50%)',
    width: HEIGHT_ANCHOR,
    height: WIDTH_ANCHOR,
    cursor: 'ns-resize',
  },
  right: {
    right: POSITION,
    top: '50%',
    transform: 'translateY(-50%)',
    width: WIDTH_ANCHOR,
    height: HEIGHT_ANCHOR,
    cursor: 'ew-resize',
  },
  bottom: {
    bottom: POSITION,
    left: '50%',
    transform: 'translateX(-50%)',
    width: HEIGHT_ANCHOR,
    height: WIDTH_ANCHOR,
    cursor: 'ns-resize',
  },
  left: {
    left: POSITION,
    top: '50%',
    transform: 'translateY(-50%)',
    width: WIDTH_ANCHOR,
    height: HEIGHT_ANCHOR,
    cursor: 'ew-resize',
  },
};

export const ResizeView: FC<ResizeHandleViewProps> = ({ handle, onMouseDown }) => {
  return <div onMouseDown={onMouseDown} style={STYLES_BY_HANDLE[handle]} className="resize-view" />;
};
