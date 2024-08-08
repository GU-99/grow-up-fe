export const EMAIL_REGEX = /^[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,3}(?:\.[a-z]{2,3})?$/i;
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/])[A-Za-z\d~`!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/]{8,16}$/;
export const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
export const NICKNAME_REGEX = /^[a-zA-Z0-9가-힣]{2,20}$/;
export const ID_REGEX = /^[a-z0-9._+@가-힣-]+(?:@[a-z0-9.-]+\.[a-z]{2,}(?:\.[a-z]{2,}))?$/i;
