import axios from 'axios';
import { SECOND } from '@constants/units';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

const JWT_TOKEN_DUMMY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const defaultConfigOptions: AxiosRequestConfig = {
  baseURL: BASE_URL,
  timeout: 10 * SECOND,
  headers: { 'Content-Type': 'application/json' },
};

export function axiosProvider(configOptions: AxiosRequestConfig = {}): AxiosInstance {
  return axios.create({ ...defaultConfigOptions, ...configOptions });
}

// ToDo: authAxios에 로그인 기능 완료시 AccessToken, RefreshToken 처리 Interceptor 추가할 것
export const defaultAxios = axiosProvider();
export const authAxios = axiosProvider({
  headers: {
    'Content-Type': 'application/json',
    Authorization: JWT_TOKEN_DUMMY,
  },
  withCredentials: true,
});
