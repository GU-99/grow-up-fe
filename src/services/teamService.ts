import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { User } from '@/types/UserType';
import type { Team } from '@/types/TeamType';

/**
 * 팀에 속한 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {Team['teamId']} teamId - 팀 아이디
 * @param {User['nickname']} nickname - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<User[]>>}
 */
async function findUserByTeam(
  teamId: Team['teamId'],
  nickname: User['nickname'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<User[]>(`team/${teamId}/user/search?nickname=${nickname}`, axiosConfig);
}
