import { authAxios, defaultAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type { UserSignInForm } from '@/types/UserType';

/**
 * 사용자 로그인 API
 *
 * @export
 * @async
 * @param {UserSignInForm} loginForm - 로그인 폼 데이터
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse>}
 */
export async function login(loginForm: UserSignInForm, axiosConfig: AxiosRequestConfig = {}) {
  return defaultAxios.post('user/login', loginForm, axiosConfig);
}

/**
 * 사용자 액세스 토큰 갱신 API
 *
 * @export
 * @async
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse>}
 */
export async function getAccessToken(axiosConfig: AxiosRequestConfig = {}) {
  return defaultAxios.post('user/login/refresh', null, { ...axiosConfig, withCredentials: true });
}

/**
 * 사용자 액세스 토큰 갱신 테스트 API
 *
 * @export
 * @async
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse>}
 */
export async function postTest(axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post('test', null, axiosConfig);
}
