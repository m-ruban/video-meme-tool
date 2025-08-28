import { useCallback } from 'react';
import { fetcher } from 'src/api/fetcher';

type OnComplete = (link: string) => void;

interface TestSpeechRequest {
  (text: string, onComplete: OnComplete): void;
}

interface TestSpeechResult {
  link: string;
}

const useTestSpeech = (): TestSpeechRequest => {
  return useCallback<TestSpeechRequest>((text, onComplete) => {
    fetcher
      .post<TestSpeechResult>('/api/v1/video/speech-test/', { text })
      .then((res) => onComplete(res.data.link));
  }, []);
};

export { useTestSpeech };
