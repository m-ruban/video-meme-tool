import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';
import { PhraseMode } from 'src/store';

interface TestSpeechRequest {
  (text: string, mode: PhraseMode, duration: number, onComplete: (link: string) => void): void;
}

interface TestSpeechResult {
  link: string;
}

const useTestSpeech = (): TestSpeechRequest => {
  return useCallback<TestSpeechRequest>((text, mode, duration, onComplete) => {
    fetcher
      .post<TestSpeechResult>('/api/v1/video/speech-test/', { text, mode, duration })
      .then((res) => onComplete(res.data.link));
  }, []);
};

export { useTestSpeech };
