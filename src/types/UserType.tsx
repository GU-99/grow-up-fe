// 회원가입, 로그인 시 필요한 유저 타입 정의
export type UserSignInForm = {
  id: string;
  password: string;
};

export type UserSignUpForm = UserSignInForm & {
  email: string;
  image: File[];
  password: string;
  nickname: string;
  bio: string;
  links: string[];
  phone: string;
};

export type UserSignUp = UserSignUpForm & {
  emailVerificationCode: string;
  phoneVerificationCode: string;
  checkPassword: string;
};

export type SearchIDForm = {
  email: string;
  code: string;
};

export type SearchPasswordForm = {
  id: string;
  email: string;
  code: string;
};
