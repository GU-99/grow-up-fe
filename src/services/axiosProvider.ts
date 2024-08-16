import axios from 'axios';
import { SECOND } from '@constants/units';
import { JWT_TOKEN_DUMMY } from '@mocks/mockData';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

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
