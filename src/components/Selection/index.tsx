import { forwardRef, ReactNode } from 'react';
import classnames from 'classnames';
import { SmallCross } from 'src/components/Icon/SmallCross';
import { cancelEvent } from 'src/components/Timeline/components/Waveform/utils';

import 'src/components/Selection/selection.less';

interface SelectionProps {
  children: ReactNode;
  onDelete: VoidFunction;
  isSaved?: boolean;
  left?: number;
  width?: number;
}

const Selection = forwardRef<HTMLDivElement, SelectionProps>(
  ({ children, isSaved, left, width, onDelete }, ref) => (
    <div
      ref={ref}
      className={classnames('waveform-selection-box', {
        [`waveform-selection-box_saved`]: isSaved,
      })}
      onClick={cancelEvent}
      onMouseDown={cancelEvent}
      style={width ? { left: `${left}px`, width: `${width}px` } : {}}
    >
      {children}
      {children && (
        <span className="waveform-selection-clear" onClick={onDelete}>
          <SmallCross />
        </span>
      )}
    </div>
  )
);

Selection.displayName = 'Selection';

export { Selection };
