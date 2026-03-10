declare global {
  interface Window {
    APP_CONFIG: {
      apiUrl: string;
    };
    FIREBASE_CONFIG: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      messagingSenderId: string;
      appId: string;
    };
  }
}

const appConfig = typeof window !== 'undefined' ? window.APP_CONFIG : undefined;
const firebaseConfig = typeof window !== 'undefined' ? window.FIREBASE_CONFIG : undefined;

if (!appConfig) {
  throw new Error('APP_CONFIG is not defined. Ensure config.js is loaded before the app.');
}

if (!appConfig.apiUrl) {
  throw new Error('APP_CONFIG.apiUrl is required.');
}

if (!firebaseConfig) {
  throw new Error('FIREBASE_CONFIG is not defined. Ensure firebase-config.js is loaded before the app.');
}

const requiredFirebaseFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
const missingFields = requiredFirebaseFields.filter(field => !firebaseConfig[field]);

if (missingFields.length > 0) {
  throw new Error(`FIREBASE_CONFIG is incomplete. Missing fields: ${missingFields.join(', ')}`);
}

export const config = {
  apiUrl: appConfig.apiUrl,
  firebase: firebaseConfig,
};
