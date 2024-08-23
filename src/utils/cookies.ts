import { Cookies } from 'react-cookie';

type CookieOption = {
  path?: string;
  expires?: Date;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: boolean;
  partitioned?: boolean;
};

const cookies = new Cookies();

export const setCookie = (name: string, value: string, options?: CookieOption) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};

export const removeCookie = (name: string) => {
  return cookies.remove(name, { path: '/' });
};
