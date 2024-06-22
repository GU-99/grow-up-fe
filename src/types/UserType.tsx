// 회원가입, 로그인 시 필요한 유저 타입 정의
export type UserSignIn = {
  email: string;
  password: string;
};

export type UserSignUp = UserSignIn & {
  profile: File[];
  verificationCode: string;
  name: string;
  checkPassword: string;
  bio: string;
  website: string[];
};
