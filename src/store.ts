import { create } from 'zustand';
import ReactPlayer from 'react-player';

type TokenState = string;
type TokenAction = { type: 'token/set'; payload: string };

export interface Complaint {
  reason: string;
  description: string;
  email: string;
  memeId: number;
}

export interface Meme {
  id: number;
  file: File;
  /** base file name */
  base: string;
  /** ext of file */
  ext: string;
  /** full file name */
  name: string;
  /** full link to original file */
  originalLink?: string;
  /** full link to file (processed) */
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
  width: number;
  height: number;
}
export type NullableMeme = Meme | null;
export type ParticallMeme = Pick<Meme, 'link' | 'duration' | 'ext' | 'name'> &
  Partial<Pick<Meme, 'audio'>>;
type MemeSetAction = { type: 'meme/set'; payload: Meme };
type MemeUpdateAction = { type: 'meme/update'; payload: ParticallMeme };

type StepState = 'load-file' | 'edit-file' | 'view-file';
type StepAction = { type: 'step/set'; payload: StepState };

type VideoLoaded = boolean;
type VideoLoadedAction = { type: 'meme-loaded/set'; payload: boolean };

type Played = { percent: number; seconds: number };
type PlayedAction = { type: 'played/set'; payload: Played };

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
export type ParticallPhrase = Pick<Phrase, 'start' | 'label' | 'mode' | 'duration'>;
type PhraseAddAction = { type: 'phrase/add'; payload: Phrase };
type PhraseDeleteAction = { type: 'phrase/delete'; payload: number };

export interface Overlay {
  inputImage: string;
  start: number;
  end: number;
  left: number;
  width: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
type OverlayAddAction = { type: 'overlay/add'; payload: Overlay };
type OverlayDeleteAction = { type: 'overlay/delete'; payload: number };

type PreviewAddAction = { type: 'preview/add'; payload: Overlay };
type PreviewDeleteAction = { type: 'preview/delete' };
type PreviewSaveAction = { type: 'preview/save'; payload: boolean };

type AppState = {
  token: TokenState;
  meme: NullableMeme;
  step: StepState;
  videoLoaded: VideoLoaded;
  played: Played;
  playerInstance: PlayerInstance;
  phrases: Phrase[];
  overlays: Overlay[];
  preview: Overlay | null;
  previewSaved: boolean;
};

type AppAction =
  | TokenAction
  | MemeSetAction
  | MemeUpdateAction
  | StepAction
  | VideoLoadedAction
  | PlayedAction
  | PlayerInstanceAction
  | PhraseAddAction
  | PhraseDeleteAction
  | OverlayAddAction
  | OverlayDeleteAction
  | PreviewAddAction
  | PreviewDeleteAction
  | PreviewSaveAction;

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

const playedReducer = (state: Played, action: AppAction): Played => {
  switch (action.type) {
    case 'played/set':
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

const overlayReducer = (state: Overlay[], action: AppAction): Overlay[] => {
  switch (action.type) {
    case 'overlay/add':
      return [...state, action.payload];
    case 'overlay/delete':
      return state.filter((_, index) => index !== action.payload);
    default:
      return state;
  }
};

const previewReducer = (state: Overlay | null, action: AppAction): Overlay | null => {
  switch (action.type) {
    case 'preview/add':
      return action.payload;
    case 'preview/delete':
      return null;
    default:
      return state;
  }
};

const previewSaveReducer = (state: boolean, action: AppAction): boolean => {
  switch (action.type) {
    case 'preview/save':
      return action.payload;
    default:
      return state;
  }
};

export const useAppStore = create<Store>((set) => ({
  state: {
    token: '',
    meme: null, // meme
    step: 'load-file', // edit-file | load-file
    videoLoaded: false,
    played: { percent: 0, seconds: 0 },
    playerInstance: null,
    phrases: [],
    overlays: [],
    preview: null,
    previewSaved: false,
  },
  dispatch: (action) =>
    set((store) => ({
      state: {
        token: tokenReducer(store.state.token, action),
        meme: memeReducer(store.state.meme, action),
        step: stepReducer(store.state.step, action),
        videoLoaded: videoLoadedReducer(store.state.videoLoaded, action),
        played: playedReducer(store.state.played, action),
        playerInstance: playerInstanceReducer(store.state.playerInstance, action),
        phrases: phraseReducer(store.state.phrases, action),
        overlays: overlayReducer(store.state.overlays, action),
        preview: previewReducer(store.state.preview, action),
        previewSaved: previewSaveReducer(store.state.previewSaved, action),
      },
    })),
}));
