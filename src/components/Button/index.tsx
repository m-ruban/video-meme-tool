import { ReactNode, ButtonHTMLAttributes, MouseEvent, FC } from 'react';
import classnames from 'classnames';

import 'src/components/Button/button.less';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  icon?: ReactNode;
}

const Button: FC<ButtonProps> = ({ onClick, children, icon, ...props }) => {
  return (
    <button
      className={classnames('button', { ['button_with-icon']: icon })}
      onClick={onClick}
      {...props}
    >
      {icon || children}
    </button>
  );
};

export { Button };
