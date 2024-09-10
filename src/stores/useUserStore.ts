/* eslint-disable import/prefer-default-export */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
    },
  ),
);
