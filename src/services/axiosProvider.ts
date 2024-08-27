import axios from 'axios';
import { SECOND } from '@constants/units';
import { JWT_TOKEN_DUMMY } from '@mocks/mockData';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';
import useToast from '@/hooks/useToast';

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

// 요청 인터셉터
authAxios.interceptors.request.use(
  (config) => {
    const modifiedConfig = { ...config };

    const { accessToken } = useAuthStore.getState();
    if (accessToken) modifiedConfig.headers.Authorization = `Bearer ${accessToken}`;

    return modifiedConfig;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { toastError } = useToast();

    // Access token 만료 시 처리
    if (error.response?.status === 401) {
      try {
        // Refresh token을 이용해 새로운 Access token 발급
        const refreshResponse = await defaultAxios.post('user/login/refresh', null, { withCredentials: true });
        const newAccessToken = refreshResponse.headers.Authorization; // 응답값: `Bearer ${newAccessToken}`

        if (!newAccessToken) {
          toastError('토큰 발급에 실패했습니다. 다시 로그인 해주세요.');
          useAuthStore.getState().Logout();
          return;
        }

        authAxios.defaults.headers.Authorization = newAccessToken;
        useAuthStore.getState().setAccessToken(newAccessToken.replace('Bearer ', ''));

        // 기존 요청에 새로운 Access token 적용
        originalRequest.headers.Authorization = newAccessToken;
        return await axios(originalRequest);
      } catch (refreshError) {
        // Refresh token 에러 시 처리
        console.error('Refresh token error:', refreshError);
        toastError('로그인 정보가 만료되었습니다. 다시 로그인 해주세요.');
        useAuthStore.getState().Logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
