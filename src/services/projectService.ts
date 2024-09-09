import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type { Team } from '@/types/TeamType';
import type { Project } from '@/types/ProjectType';
import type { User, UserWithRole } from '@/types/UserType';

/**
 * 프로젝트에 속한 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {User['nickname']} nickname           - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<UserWithRole[]>>}
 */
export async function findUserByProject(
  projectId: Project['projectId'],
  nickname: User['nickname'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<UserWithRole[]>(`/project/${projectId}/user/search?nickname=${nickname}`, axiosConfig);
}

/**
 * 프로젝트 목록 조회 API
 *
 * @export
 * @async
 * @param {Team['teamId']} teamId           - 팀 ID
 * @param {AxiosRequestConfig} axiosConfig  - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<Project[]>>}
 */
export async function getProjectList(teamId: Team['teamId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<Project[]>(`/team/${teamId}/project`, axiosConfig);
}
