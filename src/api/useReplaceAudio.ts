import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';
import { ParticallMeme } from 'src/store';

export interface ReplaceAudioInput {
  inputVideo: string;
  inputAudio: string;
  phrases: string;
}

interface ReplaceAudioRequest {
  (input: ReplaceAudioInput, onComplete: (result: ParticallMeme) => void): void;
}

const useReplaceAudio = (): ReplaceAudioRequest => {
  return useCallback<ReplaceAudioRequest>((input, onComplete) => {
    fetcher
      .post<ParticallMeme>('/api/v1/video/update-audio/', input)
      .then((res) => onComplete(res.data));
  }, []);
};

export { useReplaceAudio };
