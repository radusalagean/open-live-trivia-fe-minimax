import axios from 'axios';
import { config } from '@/lib/config';
import { getIdToken, auth } from '@/lib/firebase';

export const api = axios.create({
  baseURL: `${config.apiUrl}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await getIdToken();
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
