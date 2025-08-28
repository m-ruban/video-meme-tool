import { useRef, useEffect, useCallback, RefObject, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import classnames from 'classnames';

import 'src/components/Drop/drop.less';

interface DropProps {
  activator: RefObject<HTMLElement | null>;
  show: boolean;
  children: ReactNode;
}

const TOP_PADDING = 10;
const ITERNAL_PADDING = 15 * 2;
const BORDER = 4;

const Drop = ({ show, activator, children }: DropProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const setDropPosition = useCallback(() => {
    if (!tooltipRef.current || !activator.current) {
      return;
    }
    const rect = activator.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + TOP_PADDING}px`;
    tooltip.style.width = `${rect.width - ITERNAL_PADDING - BORDER}px`;
  }, [activator]);

  useEffect(() => {
    if (show) {
      setDropPosition();
    }
  }, [setDropPosition, show]);

  return createPortal(
    <div ref={tooltipRef} className={classnames('drop', { ['drop_visible']: show })}>
      {children}
    </div>,
    document.body
  );
};

export { Drop };
