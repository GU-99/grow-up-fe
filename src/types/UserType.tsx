export type User = {
  userId: number;
  id: string;
  email: string;
  provider: 'LOCAL' | 'KAKAO' | 'GOOGLE';
  nickname: string;
  bio: string | null;
  links: string[];
  profileUrl: string | null;
};

export type UserSignUpForm = Omit<User, 'userId' | 'provider'> & {
  code: string;
  password: string;
  checkPassword: string;
};

export type UserSignInForm = Pick<User, 'id'> & {
  password: string;
};

export type EmailVerificationForm = Pick<User, 'email'> & {
  code: string;
};

export type SearchPasswordForm = Pick<User, 'id'> & EmailVerificationForm;

export type EditPasswordForm = {
  password: string;
  newPassword: string;
  checkNewPassword: string;
};
