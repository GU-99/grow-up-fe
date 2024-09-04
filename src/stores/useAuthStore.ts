/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  accessTokenExpiresAt: number | null;

  setAccessToken: (token: string, expiresAt: number) => void;
  onLogin: (token: string, expiresAt: number) => void;
  onLogout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  accessTokenExpiresAt: null,

  setAccessToken: (token: string, expiresAt: number) => set({ accessToken: token, accessTokenExpiresAt: expiresAt }),

  onLogin: (token: string, expiresAt: number) => {
    set({ isAuthenticated: true, accessToken: token, accessTokenExpiresAt: expiresAt });
  },

  onLogout: () => {
    set({ isAuthenticated: false, accessToken: null, accessTokenExpiresAt: null });
  },
}));
