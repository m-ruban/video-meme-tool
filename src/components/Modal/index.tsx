import {
  useCallback,
  memo,
  useState,
  useEffect,
  FC,
  ComponentPropsWithoutRef,
  ReactNode,
  MouseEvent,
  TouchEvent,
} from 'react';
import ReactDOM from 'react-dom';
import { Close } from 'src/components/Icon/Close';
import { disableScroll, enableScroll } from 'src/components/Modal/utils';

import 'src/components/Modal/modal.less';

export interface ModalProps extends ComponentPropsWithoutRef<'div'> {
  onClose: () => void;
  children: ReactNode;
  backgroundClick?: boolean;
  visible?: boolean;
  host?: HTMLElement;
}

const ModalComponent: FC<ModalProps> = ({
  onClose,
  children,
  visible = false,
  backgroundClick = true,
  host,
  ...modalProps
}) => {
  const [isServer, setServer] = useState(true);

  useEffect(() => {
    setServer(false);
  }, []);

  useEffect(() => {
    if (isServer) {
      return;
    }

    if (visible) {
      disableScroll();
    }

    return () => {
      enableScroll();
    };
  }, [visible, isServer]);

  const handleBackgroundClick = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!backgroundClick) {
        return;
      }

      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget as HTMLElement;

      if (target === currentTarget) {
        onClose();
      }
    },
    [backgroundClick, onClose]
  );

  const handleInsideClick = useCallback((e: MouseEvent | TouchEvent) => {
    e.stopPropagation();
  }, []);

  if (isServer || !visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div>
        <div
          className="modal-container"
          onClick={handleBackgroundClick}
          onTouchEnd={handleBackgroundClick}
        >
          <div
            {...modalProps}
            className="modal"
            onClick={handleInsideClick}
            onTouchEnd={handleInsideClick}
          >
            {children}
          </div>

          <div className="modal-close-button" onClick={onClose} role="button" tabIndex={0}>
            <Close />
          </div>
        </div>
      </div>
    </div>,
    host || document.body
  );
};

export const Modal = memo(ModalComponent);
