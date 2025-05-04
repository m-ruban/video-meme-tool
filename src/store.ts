import { create } from 'zustand';

type TokenState = string;
type TokenAction = { type: 'token/set', payload: string };

interface Meme {
  file: File;
  /** base file name */
  base: string,
  /** ext of file */
  ext: string,
  /** full file name */
  name: string,
  /** full link to file */
  link: string,
  /** in sec */
  duration: number,
  /** full link to audio */
  audio: string,
  frames: string[];
}
type NullableMeme = Meme | null;
type MemeAction = { type: 'meme/set', payload: Meme };

type AppState = {
  token: TokenState;
  meme: NullableMeme;
};

type AppAction = TokenAction | MemeAction;

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

export const useAppStore = create<Store>((set) => ({
  state: {
    token: '',
    meme: null,
  },
  dispatch: (action) => set((store) => ({
    state: {
      token: tokenReducer(store.state.token, action),
      meme: memeReducer(store.state.meme, action),
    },
  })),
}));
