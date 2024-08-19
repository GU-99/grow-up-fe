import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { User } from '@/types/UserType';

/**
 * 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {User['nickname']} nickname - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<User[]>>}
 */
async function findUser(nickname: string, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<User[]>(`/user/search?nickname=${nickname}`, axiosConfig);
}
