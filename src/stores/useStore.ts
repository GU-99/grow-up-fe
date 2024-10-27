import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AUTH_SETTINGS } from '@constants/settings';
import { decrypt, encrypt } from '@utils/cryptoHelper';
import { EditUserInfoRequest, EditUserLinksForm, User, UserProfileImageForm } from '@/types/UserType';

// Auth Slice
type AuthStore = {
  isAuthenticated: boolean;
  accessToken: string | null;
  isVerified: boolean;

  setAccessToken: (token: string) => void;
  onLogin: (token: string) => void;
  onVerifyCode: () => void;
  onLogout: () => void;
};

// User Slice
type UserStore = {
  userInfo: User;
  setUserInfo: (newUserInfo: User) => void;
  editUserInfo: (newUserInfo: EditUserInfoRequest | EditUserLinksForm | UserProfileImageForm) => void;
  clearUserInfo: () => void;
};

// Combined Store
type Store = AuthStore & UserStore;

// Auth Slice Creator
const createAuthSlice: StateCreator<Store, [], [], AuthStore> = (set) => ({
  isAuthenticated: false,
  accessToken: null,
  isVerified: false,

  setAccessToken: (token: string) =>
    set({
      accessToken: token,
    }),

  onLogin: (token: string) => {
    set({
      isAuthenticated: true,
      accessToken: token,
    });

    setTimeout(() => {
      set({
        isAuthenticated: false,
        accessToken: null,
      });
    }, AUTH_SETTINGS.ACCESS_TOKEN_EXPIRATION);
  },

  onVerifyCode: () => {
    set({
      isVerified: true,
    });

    setTimeout(() => {
      set({
        isVerified: false,
      });
    }, AUTH_SETTINGS.VERIFIED_EXPIRATION);
  },

  onLogout: () => {
    set({
      isAuthenticated: false,
      accessToken: null,
    });
  },
});

// User Slice Creator
const createUserSlice: StateCreator<Store, [], [], UserStore> = (set) => ({
  userInfo: {
    provider: 'LOCAL',
    userId: 0,
    username: '',
    email: '',
    nickname: '',
    bio: null,
    links: [],
    profileImageName: null,
  },

  setUserInfo: (newUserInfo: User) =>
    set({
      userInfo: newUserInfo,
    }),

  editUserInfo: (newUserInfo: EditUserInfoRequest | EditUserLinksForm | UserProfileImageForm) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...newUserInfo },
    })),

  clearUserInfo: () => {
    set({
      userInfo: {
        provider: 'LOCAL',
        userId: 0,
        username: '',
        email: '',
        nickname: '',
        bio: null,
        links: [],
        profileImageName: null,
      },
    });
    localStorage.removeItem('user-storage');
  },
});

// Combined Store
export const useStore = create<Store>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createUserSlice(...a),
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
        userInfo: state.userInfo,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export default useStore;
