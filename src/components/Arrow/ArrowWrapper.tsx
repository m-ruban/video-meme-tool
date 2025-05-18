import { ReactNode } from 'react';

import 'src/components/Arrow/arrow-wrapper.less';

type ArrowProps = {
  children: ReactNode;
};

const ArrowWrapper = ({ children }: ArrowProps) => {
  return <div className="arrow-wrapper">{children}</div>;
};

export { ArrowWrapper };
