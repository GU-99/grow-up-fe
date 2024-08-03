// 회원가입, 로그인 시 필요한 유저 타입 정의
export type UserSignInForm = {
  userId: string;
  password: string;
};

export type UserSignUpForm = UserSignInForm & {
  email: string;
  image: string;
  password: string;
  nickname: string;
  bio: string;
  links: string[];
  phone: string;
};

export type UserSignUp = UserSignUpForm & {
  verificationCode: string;
  checkPassword: string;
};

export type SearchIDForm = {
  email: string;
  code: string;
};

export type SearchPasswordForm = {
  userId: string;
  email: string;
  code: string;
};
