import { FC } from 'react';
import { motion } from 'framer-motion';

import { Loading } from 'src/components/Icon/Loading';

import 'src/components/Loader/loader.less';

const Loader: FC = () => {
  return (
    <motion.div
      className="loader"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'circInOut' }}
    >
      <Loading />
    </motion.div>
  );
};

export { Loader };
