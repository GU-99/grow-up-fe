import { USER_SETTINGS } from '@constants/settings';

export const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,3}(?:\.[a-z]{2,3})?$/i;
export const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
export const PASSWORD_REGEX = new RegExp(
  `^(?=.*[A-Za-z])(?=.*\\d)(?=.*[~\`!@#$%^&*()_\\-+={[}\\]|\\\\:;"'<,>.?/])[A-Za-z\\d~\`!@#$%^&*()_\\-+={[}\\]|\\\\:;"'<,>.?/]{${USER_SETTINGS.MIN_PW_LENGTH},${USER_SETTINGS.MAX_PW_LENGTH}}$`,
);
export const NICKNAME_REGEX = new RegExp(
  `^[a-zA-Z0-9가-힣]{${USER_SETTINGS.MIN_NICKNAME_LENGTH},${USER_SETTINGS.MAX_NICKNAME_LENGTH}}$`,
);
export const ID_REGEX = /^[a-z0-9._+@가-힣-]+(?:@[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2,}))?$/i;

export const TEAM_NAME_PATTERN = /^[가-힣a-zA-Z0-9]*$/;
