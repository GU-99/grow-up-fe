import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SECOND } from '@constants/units';
import { JWT_TOKEN_DUMMY } from '@mocks/mockData';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import useToast from '@hooks/useToast';
import { getAccessToken } from '@services/authService';
import { useStore } from '@stores/useStore';

type InterceptorProps = {
  children: ReactNode;
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const defaultConfigOptions: AxiosRequestConfig = {
  baseURL: BASE_URL,
  timeout: 10 * SECOND,
  headers: { 'Content-Type': 'application/json' },
};

export function axiosProvider(configOptions: AxiosRequestConfig = {}): AxiosInstance {
  return axios.create({ ...defaultConfigOptions, ...configOptions });
}

export const defaultAxios = axiosProvider();
export const authAxios = axiosProvider({
  headers: {
    'Content-Type': 'application/json',
    Authorization: JWT_TOKEN_DUMMY,
  },
  withCredentials: true,
});

export const Interceptor = ({ children }: InterceptorProps) => {
  const { toastError } = useToast();
  const navigate = useNavigate();
  const { onLogout, setAccessToken, clearUserInfo } = useStore.getState();

  useEffect(() => {
    // 요청 인터셉터
    const requestInterceptor = authAxios.interceptors.request.use(
      (config) => {
        const { accessToken } = useStore.getState();

        const modifiedConfig = { ...config };
        if (accessToken) modifiedConfig.headers.Authorization = `Bearer ${accessToken}`;

        return modifiedConfig;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터
    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 액세스 토큰 만료 시 처리
        if (error.response?.status === 401 && !originalRequest.isRetry) {
          originalRequest.isRetry = true;

          try {
            // 리프레시 토큰을 이용해 새로운 액세스 토큰 발급
            const refreshResponse = await getAccessToken();
            const newAccessToken = refreshResponse.headers.authorization; // 응답값: `Bearer newAccessToken`

            if (!newAccessToken) throw new Error('토큰 발급에 실패했습니다.');

            setAccessToken(newAccessToken.split(' ')[1]);

            // 기존 설정 객체에 새로운 액세스 토큰 적용
            originalRequest.headers.Authorization = newAccessToken;
            return await authAxios(originalRequest);
          } catch (refreshError) {
            // 리프레시 토큰 에러 시 처리
            toastError('로그인 정보가 만료되었습니다. 다시 로그인 해주세요.');
            setTimeout(() => {
              onLogout();
              clearUserInfo();
              navigate('/signin', { replace: true });
            }, 2000);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      authAxios.interceptors.request.eject(requestInterceptor);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return children;
};
