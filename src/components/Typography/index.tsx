import { ReactNode } from 'react';
import classnames from 'classnames';

import 'src/components/Typography/typography.less';

type Mode = 'primary' | 'secondary';
type Weight = 'regular' | 'medium' | 'bold';
type Size = 'small' | 'medium';

interface TypographyProps {
  children: ReactNode;
  mode?: Mode;
  size?: Size;
  weight?: Weight;
  singleLine?: boolean;
  inline?: boolean;
}

const Typography = ({
  children,
  mode = 'primary',
  weight = 'regular',
  singleLine = false,
  inline = false,
  size = 'medium',
}: TypographyProps) => {
  const Component = inline ? 'span' : 'div';
  return (
    <Component
      className={classnames(
        'typography',
        `typography_mode-${mode}`,
        `typography_weight-${weight}`,
        `typography_size-${size}`,
        { [`typography_single-line`]: singleLine }
      )}
    >
      {children}
    </Component>
  );
};

export { Typography };
