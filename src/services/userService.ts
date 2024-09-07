import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { User } from '@/types/UserType';
import type { TeamListWithApproval } from '@/types/TeamType';

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

/**
 * 가입한 팀과 초대된 팀 전체 목록 조회 API
 *
 * @export
 * @async
 * @param {AxiosRequestConfig} [axiosConnfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<TeamListWithApproval[]>>}
 */
export async function getTeamList(axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<TeamListWithApproval[]>('/user/team', axiosConfig);
}
