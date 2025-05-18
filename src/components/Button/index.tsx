import { ReactNode, ButtonHTMLAttributes, MouseEvent } from 'react';

import 'src/components/Button/button.less';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
}

const Button = ({ onClick, children, ...props }: ButtonProps) => {
  return (
    <button className="button" onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export { Button };
