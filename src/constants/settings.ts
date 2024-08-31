import { MB } from '@constants/units';

export const AUTH_SETTINGS = Object.freeze({
  // ACCESS_TOKEN_EXPIRATION: 3000, // 테스트용 3초
  ACCESS_TOKEN_EXPIRATION: 15 * 60 * 1000, // 15분
  REFRESH_TOKEN_EXPIRATION: 7 * 24 * 60 * 60 * 1000, // 7일
});

export const USER_SETTINGS = Object.freeze({
  MAX_IMAGE_SIZE: 2 * MB,
  MAX_LINK_COUNT: 5,
  MIN_ID_LENGTH: 2,
  MAX_ID_LENGTH: 32,
  MIN_PW_LENGTH: 8,
  MAX_PW_LENGTH: 16,
  MIN_NICKNAME_LENGTH: 2,
  MAX_NICKNAME_LENGTH: 20,
  MAX_EMAIL_LENGTH: 128,
});

export const TASK_SETTINGS = Object.freeze({
  MAX_FILE_SIZE: 2 * MB,
  MAX_FILE_COUNT: 10,
});
