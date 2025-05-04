import axios from 'axios';
import { useEffect, useRef } from "react";
import { useAppStore } from 'src/store';

interface ResponseToken {
  access_token: string;
}

const useApiToken = (): string => {
  const { state, dispatch } = useAppStore();
  const sendRequestRef = useRef(false);

  useEffect(() => {
    if (state.token) {
      return;
    }
    if (sendRequestRef.current) {
      return;
    }
    sendRequestRef.current = true;
    async function fetchToken() {
      const response = await axios.post<ResponseToken>('/api/v1/auth/get-token/', { login: 'getrand', password: '13kalmah13' });
      dispatch({ type: 'token/set', payload: response.data.access_token });
    }
    fetchToken();
  }, [dispatch, state.token]);

  return state.token;
};

export { useApiToken };