import { useAppStore } from 'src/store';
import { Player } from 'src/components/Player';
import { Timeline } from 'src/components/Timeline';
import { SaveButton } from 'src/components/SaveButton';

const Editor = () => {
  const meme = useAppStore((store) => store.state.meme);
  const videoLoaded = useAppStore((store) => store.state.videoLoaded);
  if (!meme) {
    return;
  }

  return (
    <>
      <Player meme={meme} />
      {videoLoaded && (
        <>
          <Timeline meme={meme} />
          <SaveButton />
        </>
      )}
    </>
  );
};

export { Editor };
