import axios from 'axios';
import { useAppStore } from 'src/store';

const fetcher = axios.create();

fetcher.interceptors.request.use((config) => {
  const token = useAppStore.getState().state.token;
  console.log('token = ', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { fetcher };
