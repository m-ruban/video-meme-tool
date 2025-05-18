import { create } from 'zustand';

import { meme } from 'src/dummy';

type TokenState = string;
type TokenAction = { type: 'token/set'; payload: string };

export interface Meme {
  file: File;
  /** base file name */
  base: string;
  /** ext of file */
  ext: string;
  /** full file name */
  name: string;
  /** full link to file */
  link: string;
  /** in sec */
  duration: number;
  /** full link to audio */
  audio: string;
  frames: string[];
}
export type NullableMeme = Meme | null;
type MemeAction = { type: 'meme/set'; payload: Meme };

type StepState = 'load-file' | 'edit-file' | 'view-file';
type StepAction = { type: 'step/set'; payload: StepState };

type VideoLoaded = boolean;
type VideoLoadedAction = { type: 'meme-loaded/set'; payload: boolean };

type AppState = {
  token: TokenState;
  meme: NullableMeme;
  step: StepState;
  videoLoaded: VideoLoaded;
};

type AppAction = TokenAction | MemeAction | StepAction | VideoLoadedAction;

interface Store {
  state: AppState;
  dispatch: (action: AppAction) => void;
}

const tokenReducer = (state: TokenState, action: AppAction): TokenState => {
  switch (action.type) {
    case 'token/set':
      return action.payload;
    default:
      return state;
  }
};

const memeReducer = (state: NullableMeme, action: AppAction): NullableMeme => {
  switch (action.type) {
    case 'meme/set':
      return action.payload;
    default:
      return state;
  }
};

const stepReducer = (state: StepState, action: AppAction): StepState => {
  switch (action.type) {
    case 'step/set':
      return action.payload;
    default:
      return state;
  }
};

const videoLoadedReducer = (state: VideoLoaded, action: AppAction): VideoLoaded => {
  switch (action.type) {
    case 'meme-loaded/set':
      return action.payload;
    default:
      return state;
  }
};

export const useAppStore = create<Store>((set) => ({
  state: {
    token: '',
    meme: meme,
    step: 'edit-file',
    videoLoaded: false,
  },
  dispatch: (action) =>
    set((store) => ({
      state: {
        token: tokenReducer(store.state.token, action),
        meme: memeReducer(store.state.meme, action),
        step: stepReducer(store.state.step, action),
        videoLoaded: videoLoadedReducer(store.state.videoLoaded, action),
      },
    })),
}));
