/* eslint-disable import/prefer-default-export */
import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  // clearAccessToken: () => void;
  Login: (token: string) => void;
  Logout: () => void;
};

export const useAuthStore = createStore(
  persist<AuthStore>(
    (set) => ({
      isAuthenticated: false,
      accessToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      // clearAccessToken: () => set({ accessToken: null }),
      Login: (token: string) => {
        set({ isAuthenticated: true, accessToken: token });
      },
      Logout: () => {
        set({ isAuthenticated: false, accessToken: null });
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
