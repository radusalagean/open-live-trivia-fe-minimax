import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { config } from './config';

export const app = initializeApp(config.firebase);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};
