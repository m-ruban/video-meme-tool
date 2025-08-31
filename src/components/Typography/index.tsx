import { ReactNode } from 'react';
import classnames from 'classnames';

import 'src/components/Typography/typography.less';

type Mode = 'primary' | 'secondary';
type Weight = 'regular' | 'medium' | 'bold';

interface TypographyProps {
  children: ReactNode;
  mode?: Mode;
  weight?: Weight;
  singleLine?: boolean;
}

const Typography = ({
  children,
  mode = 'primary',
  weight = 'regular',
  singleLine = false,
}: TypographyProps) => {
  return (
    <div
      className={classnames(
        'typography',
        `typography_mode-${mode}`,
        `typography_weight-${weight}`,
        { [`typography_single-line`]: singleLine }
      )}
    >
      {children}
    </div>
  );
};

export { Typography };
