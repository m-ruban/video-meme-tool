import { AnimatePresence, motion } from 'framer-motion';
import { Play } from 'src/components/Icon/Play';
import { Pause } from 'src/components/Icon/Pause';

interface PlayPauseProps {
  playing: boolean;
}

const PlayPause = ({ playing }: PlayPauseProps) => {
  return (
    <AnimatePresence mode="wait">
      {playing ? (
        <motion.div
          key="pause"
          style={{ display: 'inline-flex' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Pause />
        </motion.div>
      ) : (
        <motion.div
          key="play"
          style={{ display: 'inline-flex' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <Play />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { PlayPause };
