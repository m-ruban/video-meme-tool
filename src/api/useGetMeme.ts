import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';
import { ParticallMeme } from 'src/store';

interface GetMemeRequest {
  (path: string, onComplete: (meme: ParticallMeme) => void): void;
}

const useGetMeme = (): GetMemeRequest => {
  return useCallback<GetMemeRequest>((path, onComplete) => {
    fetcher.get<ParticallMeme>(`/api/v1${path}`).then((res) => onComplete(res.data));
  }, []);
};

export { useGetMeme };
