import Validator from '@utils/Validator';
import { deepFreeze } from '@utils/deepFreeze';
import { EMAIL_REGEX, ID_REGEX, NICKNAME_REGEX, PASSWORD_REGEX, PHONE_REGEX } from './regex';

export const STATUS_VALIDATION_RULES = deepFreeze({
  STATUS_NAME: (nameList: string[]) => ({
    required: '상태명을 입력해주세요.',
    minLength: {
      value: 2,
      message: '상태명을 2자리 이상 20자리 이하로 입력해주세요.',
    },
    maxLength: {
      value: 20,
      message: '상태명을 2자리 이상 20자리 이하로 입력해주세요.',
    },
    validate: {
      isEmpty: (value: string) => !Validator.isEmptyString(value) || '상태명을 제대로 입력해주세요.',
      duplicatedName: (value: string) => !Validator.isDuplicatedName(nameList, value) || '이미 사용중인 상태명입니다.',
    },
  }),
  COLOR: (colorList: string[]) => ({
    required: '색상을 선택해주세요.',
    validate: {
      duplicatedName: (value: string) => !Validator.isDuplicatedName(colorList, value) || '이미 사용중인 색상입니다.',
    },
  }),
  EMAIL: {
    required: '이메일 인증을 진행해 주세요.',
    pattern: {
      value: EMAIL_REGEX,
      message: '이메일 형식에 맞지 않습니다.',
    },
  },
  CERTIFICATION: { required: '인증번호를 입력해 주세요.' },
  NICKNAME: {
    required: '닉네임을 입력해 주세요.',
    minLength: {
      value: 2,
      message: '닉네임은 최소 2자 이상이어야 합니다.',
    },
    maxLength: {
      value: 20,
      message: '닉네임은 최대 20자까지 입력 가능합니다.',
    },
    pattern: {
      value: NICKNAME_REGEX,
      message: '닉네임은 영문, 한글, 숫자만 포함 가능합니다.',
    },
  },
  PASSWORD: {
    required: '비밀번호를 입력해 주세요.',
    minLength: {
      value: 8,
      message: '비밀번호는 최소 8자 이상이어야 합니다.',
    },
    maxLength: {
      value: 16,
      message: '비밀번호는 최대 16자 이하여야 합니다.',
    },
    pattern: {
      value: PASSWORD_REGEX,
      message: '비밀번호는 영문자, 숫자, 기호를 모두 포함해야 합니다.',
    },
  },
  PASSWORD_CONFIRM: (password: string) => ({
    required: '비밀번호를 한 번 더 입력해 주세요.',
    validate: (value: string) => value === password || '비밀번호가 일치하지 않습니다.',
  }),
  ID: {
    required: '아이디를 입력해 주세요.',
    minLength: {
      value: 2,
      message: '아이디는 최소 2자 이상이어야 합니다.',
    },
    maxLength: {
      value: 255,
      message: '아이디는 최대 255자 이하여야 합니다.',
    },
    pattern: {
      value: ID_REGEX,
      message: '아이디는 영문, 한글, 숫자 및 특수기호(., @, _, +, -)만 포함 가능합니다.',
    },
  },
});
