import { DAY, MB, MINUTE, SECOND } from '@constants/units';
import { TASK_ACCEPT_FILE_TYPES } from '@constants/mimeFileType';

export const AUTH_SETTINGS = Object.freeze({
  // ACCESS_TOKEN_EXPIRATION: 5 * SECOND, // 테스트용 5초
  ACCESS_TOKEN_EXPIRATION: 15 * MINUTE, // 15분
  REFRESH_TOKEN_EXPIRATION: 7 * DAY, // 7일
  VERIFIED_EXPIRATION: 15 * MINUTE,
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

// prettier-ignore
export const TASK_SETTINGS = Object.freeze({
  MAX_FILE_SIZE: 2 * MB,
  MAX_FILE_COUNT: 10,
  FILE_ACCEPT: '.jpg, .jpeg, .png, .svg, .webp, .pdf, .txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .hwp, .zip, .rar, .7z, .alz, .egg',
  FILE_TYPES: TASK_ACCEPT_FILE_TYPES,
});
