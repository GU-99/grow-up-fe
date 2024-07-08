// 회원가입, 로그인 시 필요한 유저 타입 정의
export type UserSignIn = {
  email: string;
  password: string;
};

export type UserSignUpForm = UserSignIn & {
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

export type UserSearchIdForm = {
  phone: string;
};
