import { FC, ReactNode } from 'react';

import 'src/components/Toast/toast.less';

interface ToastProps {
  children: ReactNode;
}

const Toast: FC<ToastProps> = ({ children }) => {
  return <div className="toast">{children}</div>;
};

export { Toast };
