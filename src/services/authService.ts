import { authAxios } from '@services/axiosProvider';
import type { User, UserSignInForm } from '@/types/UserType';

/**
 * 사용자 로그인 API
 *
 * @export
 * @async
 * @param {UserSignInForm} loginForm - 로그인 폼 데이터
 * @returns {Promise<AxiosResponse<User>>}
 */
export async function login(loginForm: UserSignInForm) {
  return authAxios.post<User>('user/login', loginForm, { withCredentials: true });
}
