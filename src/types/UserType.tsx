import type { Role } from '@/types/RoleType';

export type SocialLoginProvider = 'kakao' | 'google';

export type User = {
  userId: number;
  username: string;
  email: string;
  provider: 'LOCAL' | SocialLoginProvider;
  nickname: string;
  bio: string | null;
  links: string[];
  profileImageName: string | null;
};

export type UserInfo = User & {
  password: string | null;
};

export type UserProfileImageForm = Pick<User, 'profileImageName'>;

export type SearchUser = Pick<User, 'userId' | 'nickname'>;
export type UserWithRole = SearchUser & Pick<Role, 'roleName'>;

/* 유저 정보 설정 */
export type EditUserInfoForm = Omit<User, 'userId' | 'provider' | 'links'>;
export type EditUserInfoResponse = Pick<User, 'userId' | 'nickname' | 'bio'>;
export type EditUserInfoRequest = Omit<EditUserInfoResponse, 'userId'>;
export type EditUserLinksForm = Pick<User, 'links'>;

export type UserSignUpForm = Omit<User, 'userId' | 'provider' | 'profileImageName'> & {
  verificationCode: string;
  password: string;
  checkPassword: string;
};

export type UserSignUpRequest = Omit<UserSignUpForm, 'checkPassword'>;

export type CheckNicknameForm = Pick<User, 'nickname'>;

export type UserSignInForm = Pick<User, 'username'> & {
  password: string;
};

export type EmailVerificationForm = Pick<User, 'email'> & { verificationCode: string };

export type SearchPasswordForm = Pick<User, 'username' | 'email'> & { verificationCode: string };

export type UpdatePasswordForm = {
  password: string;
  newPassword: string;
  checkNewPassword: string;
};

export type UpdatePasswordRequest = Omit<UpdatePasswordForm, 'checkNewPassword'>;

export type SearchIdResult = Pick<User, 'username'>;

export type RequestEmailCode = Pick<User, 'email'>;

export type SearchPasswordResult = { password: string };
