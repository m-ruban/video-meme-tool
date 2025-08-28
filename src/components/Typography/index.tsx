import { ReactNode } from 'react';
import classnames from 'classnames';

import 'src/components/Typography/typography.less';

type Mode = 'primary' | 'secondary';
type Weight = 'regular' | 'medium' | 'bold';

interface TypographyProps {
  children: ReactNode;
  mode?: Mode;
  weight?: Weight;
}

const Typography = ({ children, mode = 'primary', weight = 'regular' }: TypographyProps) => {
  return (
    <div
      className={classnames('typography', `typography_mode-${mode}`, `typography_weight-${weight}`)}
    >
      {children}
    </div>
  );
};

export { Typography };
