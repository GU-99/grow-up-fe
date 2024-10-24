import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Team } from '@/types/TeamType';
import type { Project, ProjectForm } from '@/types/ProjectType';
import type { User, SearchUser, UserWithRole } from '@/types/UserType';

/**
 * 프로젝트에 속한 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {User['nickname']} nickname           - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<SearchUser[]>>}
 */
export async function findUserByProject(
  projectId: Project['projectId'],
  nickname: User['nickname'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<SearchUser[]>(`/project/${projectId}/user/search?nickname=${nickname}`, axiosConfig);
}

/**
 * 프로젝트 목록 조회 API
 *
 * @export
 * @async
 * @param {Team['teamId']} teamId               - 팀 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<Project[]>>}
 */
export async function getProjectList(teamId: Team['teamId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<Project[]>(`/team/${teamId}/project`, {
    transformResponse: (data) => {
      const parsedData: Project[] = JSON.parse(data);
      return parsedData.map((data) => {
        data.startDate = data.startDate && new Date(data.startDate);
        data.endDate = data.endDate && new Date(data.endDate);
        return data;
      });
    },
    ...axiosConfig,
  });
}

/**
 * 프로젝트 팀원 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<UserWithRole[]>>}
 */
export async function getProjectUserRoleList(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<UserWithRole[]>(`/project/${projectId}/user`, axiosConfig);
}

/**
 * 프로젝트 생성 API
 *
 * @export
 * @async
 * @param {Team['teamId']} teamId - 팀 ID
 * @param {ProjectForm} projectData - 프로젝트 생성 정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function createProject(
  teamId: Team['teamId'],
  projectData: ProjectForm,
  axiosConfig: AxiosRequestConfig = {},
): Promise<AxiosResponse<void>> {
  return authAxios.post(`/team/${teamId}/project`, projectData, axiosConfig);
}

/**
 * 프로젝트 삭제 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<void>}
 */
export async function deleteProject(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.delete<void>(`/project/${projectId}`, axiosConfig);
}
