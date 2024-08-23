/* eslint-disable import/prefer-default-export */
import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';
import { removeCookie, setCookie } from '@/utils/cookies';

type AuthStore = {
  isAuthenticated: boolean;
  Login: (accessToken: string) => void;
  Logout: () => void;
};

export const useAuthStore = createStore(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      Login: (accessToken: string) => {
        set({ isAuthenticated: true });
        setCookie('accessToken', accessToken, { path: '/' });
      },
      Logout: () => {
        set({ isAuthenticated: false });
        removeCookie('accessToken');
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
