import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { decrypt, encrypt } from '@utils/cryptoHelper';
import { EditUserInfoForm } from '@/types/UserType';

type UserStore = {
  userInfo: EditUserInfoForm;
  setUserInfo: (newUserInfo: EditUserInfoForm) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: {
        username: '',
        email: '',
        nickname: '',
        bio: '',
        links: [],
        profileImageUrl: '',
      },
      setUserInfo: (newUserInfo: EditUserInfoForm) =>
        set({
          userInfo: newUserInfo,
        }),
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
    },
  ),
);
