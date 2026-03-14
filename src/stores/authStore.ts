import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types';
import { authApi } from '@/api/endpoints';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  initializeAuth: () => () => void;
  login: (idToken: string) => Promise<void>;
  register: (idToken: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      initializeAuth: () => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            authApi.getMe()
              .then((user) => {
                set({ user, isAuthenticated: true, isLoading: false });
              })
              .catch(() => {
                set({ user: null, isAuthenticated: false, isLoading: false });
              });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      login: async (idToken: string) => {
        try {
          const { user } = await authApi.login(idToken);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          if (err && typeof err === 'object' && 'response' in err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            console.error('Login API error:', axiosErr.response?.data?.message || err);
          } else {
            console.error('Login API error:', err);
          }
          throw err;
        }
      },

      register: async (idToken: string, username: string) => {
        try {
          const { user } = await authApi.register(idToken, username);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err: unknown) {
          if (err && typeof err === 'object' && 'response' in err) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            console.error('Register API error:', axiosErr.response?.data?.message || err);
          } else {
            console.error('Register API error:', err);
          }
          throw err;
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null, isAuthenticated: false, isLoading: false });
      },

      fetchUser: async () => {
        try {
          const user = await authApi.getMe();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
