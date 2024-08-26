import { MB } from '@constants/units';

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
