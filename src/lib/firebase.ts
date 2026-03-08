import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { config } from './config';

export const app = initializeApp(config.firebase);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
