/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  // clearAccessToken: () => void;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  setAccessToken: (token: string) => set({ accessToken: token }),
  // clearAccessToken: () => set({ accessToken: null }),
  onLogin: (token: string) => {
    set({ isAuthenticated: true, accessToken: token });
  },
  onLogout: () => {
    set({ isAuthenticated: false, accessToken: null });
  },
}));
