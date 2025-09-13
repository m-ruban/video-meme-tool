import { useAppStore } from 'src/store';
import { Player } from 'src/components/Player';
import { Timeline } from 'src/components/Timeline';
import { SaveButton } from 'src/components/SaveButton';
import { useApiToken } from 'src/api/useApiToken';

const Editor = () => {
  const meme = useAppStore((store) => store.state.meme);
  const videoLoaded = useAppStore((store) => store.state.videoLoaded);
  useApiToken();
  if (!meme) {
    return;
  }

  return (
    <>
      <Player meme={meme} />
      <Timeline meme={meme} />
      {videoLoaded && <SaveButton />}
    </>
  );
};

export { Editor };
