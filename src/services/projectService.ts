import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { User } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';

/**
 * 프로젝트에 속한 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId - 프로젝트 아이디
 * @param {User['nickname']} nickname - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<User[]>>}
 */
export async function findUserByProject(
  projectId: Project['projectId'],
  nickname: User['nickname'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<User[]>(`project/${projectId}/user/search?nickname=${nickname}`, axiosConfig);
}
