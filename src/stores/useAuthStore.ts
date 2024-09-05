import { create } from 'zustand';
import { AUTH_SETTINGS } from '@constants/settings';

type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;

  setAccessToken: (token: string) => void;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  accessToken: null,

  setAccessToken: (token: string) => set({ accessToken: token }),

  onLogin: (token: string) => {
    set({ isAuthenticated: true, accessToken: token });

    setTimeout(() => {
      set({ isAuthenticated: false, accessToken: null });
    }, AUTH_SETTINGS.ACCESS_TOKEN_EXPIRATION);
  },

  onLogout: () => {
    set({ isAuthenticated: false, accessToken: null });
  },
}));
