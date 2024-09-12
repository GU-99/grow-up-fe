import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AUTH_SETTINGS } from '@constants/settings';
import { decrypt, encrypt } from '@utils/cryptoHelper';
import { EditUserInfoForm } from '@/types/UserType';

// Auth Slice
type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;

  setAccessToken: (token: string) => void;
  onLogin: (token: string) => void;
  onLogout: () => void;
};

// User Slice
type UserStore = {
  userInfo: EditUserInfoForm;
  setUserInfo: (newUserInfo: EditUserInfoForm) => void;
};

// Combined Store
type Store = {
  auth: AuthStore;
  user: UserStore;
};

export const useStore = create<Store>()(
  persist(
    (set) => ({
      auth: {
        isAuthenticated: false,
        accessToken: null,

        setAccessToken: (token: string) =>
          set((state) => ({
            auth: { ...state.auth, accessToken: token },
          })),

        onLogin: (token: string) => {
          set((state) => ({
            auth: { ...state.auth, isAuthenticated: true, accessToken: token },
          }));

          setTimeout(() => {
            set((state) => ({
              auth: { ...state.auth, isAuthenticated: false, accessToken: null },
            }));
          }, AUTH_SETTINGS.ACCESS_TOKEN_EXPIRATION);
        },

        onLogout: () => {
          set((state) => ({
            auth: { ...state.auth, isAuthenticated: false, accessToken: null },
          }));
        },
      },
      user: {
        userInfo: {
          username: '',
          email: '',
          nickname: '',
          bio: '',
          links: [],
          profileImageUrl: '',
        },
        setUserInfo: (newUserInfo: EditUserInfoForm) =>
          set((state) => ({
            user: { ...state.user, userInfo: newUserInfo },
          })),
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          const encryptedData = localStorage.getItem(key);
          return encryptedData ? decrypt(encryptedData) : null;
        },
        setItem: (key, value) => {
          const encryptedData = encrypt(value);
          localStorage.setItem(key, encryptedData);
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      })),
      partialize: (state) => ({
        userInfo: state.user.userInfo,
      }),
    },
  ),
);

export default useStore;
