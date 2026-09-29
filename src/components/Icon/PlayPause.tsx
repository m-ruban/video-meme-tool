import { FC } from 'react';

import { Play } from 'src/components/Icon/Play';
import { Pause } from 'src/components/Icon/Pause';

import 'src/components/Icon/play-pause.less';

interface PlayPauseProps {
  playing: boolean;
}

const PlayPause: FC<PlayPauseProps> = ({ playing }) => {
  return (
    <span className="play-pause" key={playing ? 'pause' : 'play'}>
      {playing ? <Pause /> : <Play />}
    </span>
  );
};

export { PlayPause };
