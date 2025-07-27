import { ReactNode, ButtonHTMLAttributes, MouseEvent } from 'react';
import classnames from 'classnames';

import 'src/components/Button/button.less';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  icon?: ReactNode;
}

const Button = ({ onClick, children, icon, ...props }: ButtonProps) => {
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
