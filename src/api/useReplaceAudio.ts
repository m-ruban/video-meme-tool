import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';
import { ParticallMeme } from 'src/store';

export interface ReplaceAudioInput {
  inputVideo: string;
  inputAudio: string;
  phrases: string;
}

type OnComplete = (result: ParticallMeme) => void;

interface ReplaceAutioRequest {
  (input: ReplaceAudioInput, onComplete: OnComplete): void;
}

const useReplaceAudio = (): ReplaceAutioRequest => {
  return useCallback<ReplaceAutioRequest>((input, onComplete) => {
    fetcher
      .post<ParticallMeme>('/api/v1/video/update-audio/', input)
      .then((res) => onComplete(res.data));
  }, []);
};

export { useReplaceAudio };
