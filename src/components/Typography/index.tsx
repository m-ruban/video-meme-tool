import { ReactNode } from 'react';

import 'src/components/Typography/typography.less';

interface TypographyProps {
  children: ReactNode;
}

const Typography = ({ children }: TypographyProps) => {
  return <div className="typography">{children}</div>;
};

export { Typography };
