import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';
import { Meme } from 'src/store';

interface SaveMemeRequest {
  (inputVideo: string, onComplete: (link: string) => void): void;
}

type SaveMemeResult = Pick<Meme, 'link'>;

const useSaveMeme = (): SaveMemeRequest => {
  return useCallback<SaveMemeRequest>((inputVideo, onComplete) => {
    fetcher
      .post<SaveMemeResult>('/api/v1/video/save-meme/', { inputVideo })
      .then((res) => onComplete(res.data.link));
  }, []);
};

export { useSaveMeme };
