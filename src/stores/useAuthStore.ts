/* eslint-disable import/prefer-default-export */
import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  isAuthenticated: boolean;
  Login: () => void;
  Logout: () => void;
};

export const useAuthStore = createStore(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      Login: () => {
        set({ isAuthenticated: true });
      },
      Logout: () => {
        set({ isAuthenticated: false });
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
