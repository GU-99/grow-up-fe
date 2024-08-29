/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  // clearAccessToken: () => void;
  Login: (token: string) => void;
  Logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
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
}));
