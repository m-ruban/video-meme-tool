import axios from 'axios';
import { useAppStore } from 'src/store';

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

const fetcher = axios.create();

fetcher.interceptors.request.use((config) => {
  const token = useAppStore.getState().state.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { fetcher };
