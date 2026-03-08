import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types';
import { authApi } from '@/api/endpoints';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (idToken: string) => Promise<void>;
  register: (idToken: string, username: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        localStorage.setItem('token', token || '');
        set({ token });
      },

      login: async (idToken: string) => {
        try {
          const { user, token } = await authApi.login(idToken);
          localStorage.setItem('token', token);
          set({ token, user, isAuthenticated: true, isLoading: false });
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
          const { user, token } = await authApi.register(idToken, username);
          localStorage.setItem('token', token);
          set({ token, user, isAuthenticated: true, isLoading: false });
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

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      },

      fetchUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ isLoading: false });
          return;
        }
        try {
          const user = await authApi.getMe();
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
    }
  )
);
