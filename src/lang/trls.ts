import { ReactNode } from 'react';
import { ru } from 'src/lang/ru';

type TrlKey = keyof typeof ru;

const getTrl = (key: TrlKey, params?: any): ReactNode => {
  const trl = ru[key];
  if (typeof trl === 'function') {
    return trl(params);
  }
  return trl;
};

export { getTrl };
