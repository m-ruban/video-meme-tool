import { FC } from 'react';

import { Loading } from 'src/components/Icon/Loading';

import 'src/components/Loader/loader.less';

const Loader: FC = () => {
  return (
    <div className="loader">
      <Loading />
    </div>
  );
};

export { Loader };
