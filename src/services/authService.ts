import { authAxios, defaultAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type {
  UpdatePasswordForm,
  EmailVerificationForm,
  SearchIdResult,
  SearchPasswordForm,
  SearchPasswordResult,
  User,
  UserSignInForm,
} from '@/types/UserType';

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
  return defaultAxios.post('user/refresh', null, { ...axiosConfig, withCredentials: true });
}

/**
 * 로그인 한 사용자 조회 API
 *
 * @export
 * @async
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<User>>}
 */
export async function getUserInfo(axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<User>('user/me', axiosConfig);
}

/**
 * 로그아웃 API
 *
 * @export
 * @async
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse>}
 */
export async function logout(axiosConfig: AxiosRequestConfig = {}) {
  return defaultAxios.post('user/logout', null, { ...axiosConfig, withCredentials: true });
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

/**
 * 아이디 찾기 API
 *
 * @export
 * @async
 * @param {EmailVerificationForm} searchUserIdForm - 아이디 찾기 요청 데이터
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<SearchIdResult>>}
 */
export async function searchUserId(searchUserIdForm: EmailVerificationForm, axiosConfig: AxiosRequestConfig = {}) {
  return defaultAxios.post<SearchIdResult>('user/recover/username', searchUserIdForm, axiosConfig);
}

/**
 * 비밀번호 찾기 API
 *
 * @export
 * @async
 * @param {SearchPasswordForm} searchPasswordForm - 비밀번호 찾기 요청 데이터
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<SearchPasswordResult>>}
 */
export async function searchUserPassword(searchPasswordForm: SearchPasswordForm, axiosConfig: AxiosRequestConfig = {}) {
  return defaultAxios.post<SearchPasswordResult>('user/recover/password', searchPasswordForm, axiosConfig);
}

/**
 * 비밀번호 변경 API
 *
 * @export
 * @async
 * @param {UpdatePasswordForm} updatePasswordForm - 비밀번호 변경 요청 데이터
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse>}
 */
export async function updateUserPassword(updatePasswordForm: UpdatePasswordForm, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.patch('user/password', updatePasswordForm, axiosConfig);
}
