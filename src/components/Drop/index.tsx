import { useRef, useEffect, useCallback, RefObject, ReactNode, CSSProperties, FC } from 'react';
import { createPortal } from 'react-dom';

import 'src/components/Drop/drop.less';

interface DropProps {
  activator: RefObject<HTMLElement | null>;
  show: boolean;
  children: ReactNode;
  style?: Omit<CSSProperties, 'left' | 'top' | 'width'>;
  withActivatorWidth?: boolean;
  closeWithClickOutside?: boolean;
  onClose?: () => void;
}

const TOP_PADDING = 5;
const ITERNAL_PADDING = 20;
const BORDER = 4;

const Drop: FC<DropProps> = ({
  show,
  activator,
  children,
  style,
  onClose,
  closeWithClickOutside = false,
  withActivatorWidth = true,
}) => {
  const dropRef = useRef<HTMLDivElement>(null);
  const showRef = useRef<boolean>(false);
  showRef.current = show;

  const setDropPosition = useCallback(() => {
    if (!dropRef.current || !activator.current) {
      return;
    }
    const rect = activator.current.getBoundingClientRect();
    const tooltip = dropRef.current;
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + TOP_PADDING}px`;
    if (withActivatorWidth) {
      tooltip.style.width = `${rect.width - ITERNAL_PADDING - BORDER}px`;
    }
  }, [activator, withActivatorWidth]);

  useEffect(() => {
    if (show) {
      setDropPosition();
    }
  }, [setDropPosition, show]);

  useEffect(() => {
    if (!closeWithClickOutside || !show) {
      return;
    }

    const handlerClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      const dropElement = dropRef.current;
      const activatorElement = activator.current;
      if (!dropElement) {
        return;
      }

      const clickedInsideDrop = dropElement.contains(target);
      const clickedActivator = activatorElement ? activatorElement.contains(target) : false;

      if (!clickedInsideDrop && !clickedActivator) {
        onClose?.();
      }
    };
    document.addEventListener('click', handlerClick, true);
    return () => {
      document.removeEventListener('click', handlerClick, true);
    };
  }, [closeWithClickOutside, show, onClose, activator]);

  if (!show) {
    return null;
  }

  return createPortal(
    <div ref={dropRef} className="drop" style={style}>
      {children}
    </div>,
    document.body
  );
};

export { Drop };
