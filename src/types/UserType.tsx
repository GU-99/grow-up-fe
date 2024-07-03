// 회원가입, 로그인 시 필요한 유저 타입 정의
export type UserSignInType = {
  email: string;
  password: string;
};

export type UserSignUpFormType = UserSignInType & {
  image: File[];
  password: string;
  nickname: string;
  bio: string;
  links: string[];
  phone: string;
};

export type UserSignUpType = UserSignUpFormType & {
  emailVerificationCode: string;
  phoneVerificationCode: string;
  checkPassword: string;
};

export type UserSearchIdFormType = {
  phone: string;
};
