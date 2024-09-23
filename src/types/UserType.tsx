import type { Role } from '@/types/RoleType';

export type User = {
  userId: number;
  username: string | null;
  email: string;
  provider: 'LOCAL' | 'KAKAO' | 'GOOGLE';
  nickname: string;
  bio: string | null;
  links: string[];
  profileImageName: string | null;
};

export type UserWithRole = User & Role;

export type EditUserInfoForm = Omit<User, 'userId' | 'provider'>;

export type UserSignUpForm = Omit<User, 'userId' | 'provider'> & {
  code: string;
  password: string;
  checkPassword: string;
};

export type UserSignInForm = Pick<User, 'username'> & {
  password: string;
};

export type EmailVerificationForm = Pick<User, 'email'> & { code: string };

export type SearchPasswordForm = Pick<User, 'username' | 'email'> & { code: string };

export type UpdatePasswordForm = {
  password: string;
  newPassword: string;
  checkNewPassword: string;
};

export type UpdatePasswordRequest = Omit<UpdatePasswordForm, 'checkNewPassword'>;

export type SearchIdResult = Pick<User, 'username'>;

export type RequestEmailCode = Pick<User, 'email'>;

export type SearchPasswordResult = { password: string };
