import { create } from 'zustand';
import ReactPlayer from 'react-player';

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
  /** full link to audio (mp3) */
  audioMp3: string;
  /** full link to waveform image */
  waveform: string;
  /** array of links to frames */
  frames: string[];
}
export type NullableMeme = Meme | null;
export type ParticallMeme = Pick<Meme, 'link' | 'duration' | 'ext' | 'name'>;
type MemeSetAction = { type: 'meme/set'; payload: Meme };
type MemeUpdateAction = { type: 'meme/update'; payload: ParticallMeme };

type StepState = 'load-file' | 'edit-file' | 'view-file';
type StepAction = { type: 'step/set'; payload: StepState };

type VideoLoaded = boolean;
type VideoLoadedAction = { type: 'meme-loaded/set'; payload: boolean };

type PlayedPercent = number;
type PlayedPercentAction = { type: 'played-percent/set'; payload: number };

type PlayerInstance = ReactPlayer | null;
type PlayerInstanceAction = { type: 'player-instance/set'; payload: PlayerInstance };

export type PhraseMode = 'stretch' | 'fill';
export interface Phrase {
  start: number;
  duration: number;
  link: string;
  label: string;
  left: number;
  width: number;
  right: number;
  mode: PhraseMode;
}
export type ParticallPhrase = Pick<Phrase, 'start' | 'label' | 'mode'>;
type PhraseAddAction = { type: 'phrase/add'; payload: Phrase };
type PhraseDeleteAction = { type: 'phrase/delete'; payload: number };

type AppState = {
  token: TokenState;
  meme: NullableMeme;
  step: StepState;
  videoLoaded: VideoLoaded;
  playedPercent: PlayedPercent;
  playerInstance: PlayerInstance;
  phrases: Phrase[];
};

type AppAction =
  | TokenAction
  | MemeSetAction
  | MemeUpdateAction
  | StepAction
  | VideoLoadedAction
  | PlayedPercentAction
  | PlayerInstanceAction
  | PhraseAddAction
  | PhraseDeleteAction;

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
    case 'meme/update':
      const oldMeme = state as Meme;
      return { ...oldMeme, ...action.payload };
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

const playedPercentReducer = (state: PlayedPercent, action: AppAction): PlayedPercent => {
  switch (action.type) {
    case 'played-percent/set':
      return action.payload;
    default:
      return state;
  }
};

const playerInstanceReducer = (state: PlayerInstance, action: AppAction): PlayerInstance => {
  switch (action.type) {
    case 'player-instance/set':
      return action.payload;
    default:
      return state;
  }
};

const phraseReducer = (state: Phrase[], action: AppAction): Phrase[] => {
  switch (action.type) {
    case 'phrase/add':
      return [...state, action.payload];
    case 'phrase/delete':
      return state.filter((_, index) => index !== action.payload);
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
    playedPercent: 0,
    playerInstance: null,
    phrases: [],
  },
  dispatch: (action) =>
    set((store) => ({
      state: {
        token: tokenReducer(store.state.token, action),
        meme: memeReducer(store.state.meme, action),
        step: stepReducer(store.state.step, action),
        videoLoaded: videoLoadedReducer(store.state.videoLoaded, action),
        playedPercent: playedPercentReducer(store.state.playedPercent, action),
        playerInstance: playerInstanceReducer(store.state.playerInstance, action),
        phrases: phraseReducer(store.state.phrases, action),
      },
    })),
}));
