import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Team } from '@/types/TeamType';
import type { Project, ProjectForm, ProjectInfoForm } from '@/types/ProjectType';
import type { User, SearchUser, UserWithRole } from '@/types/UserType';
import type { ProjectRoleName } from '@/types/RoleType';

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

/**
 * 프로젝트 수정 API
 *
 * @export
 * @async
 * @param {number} teamId - 팀 ID
 * @param {number} projectId - 수정할 프로젝트 ID
 * @param {ProjectInfoForm} formData - 수정할 프로젝트 정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateProjectInfo(
  teamId: number,
  projectId: number,
  formData: ProjectInfoForm,
  axiosConfig: AxiosRequestConfig = {},
): Promise<AxiosResponse<void>> {
  return authAxios.patch(`/team/${teamId}/project/${projectId}`, formData, axiosConfig);
}

/**
 * 프로젝트 유저 초대 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {User['userId']} userId               - 초대할 유저 ID
 * @param {ProjectRoleName} roleName   - 유저의 역할
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function addProjectCoworker(
  projectId: Project['projectId'],
  userId: User['userId'],
  roleName: ProjectRoleName,
  axiosConfig: AxiosRequestConfig = {},
): Promise<AxiosResponse<void>> {
  return authAxios.post(`/project/${projectId}/user/invitation`, { userId, roleName }, axiosConfig);
}

/**
 * 프로젝트 권한 수정 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {User['userId']} userId               - 유저 ID
 * @param {ProjectRoleName} roleName   - 업데이트할 역할
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateProjectRole(
  projectId: Project['projectId'],
  userId: User['userId'],
  roleName: ProjectRoleName,
  axiosConfig: AxiosRequestConfig = {},
): Promise<AxiosResponse<void>> {
  return authAxios.patch(`/project/${projectId}/user/${userId}/role`, { roleName }, axiosConfig);
}

/**
 * 특정 프로젝트에서 팀원을 삭제하는 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId     - 프로젝트 ID
 * @param {User['userId']} userId              - 삭제할 사용자 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<void>}
 */
export async function deleteProjectUser(
  projectId: Project['projectId'],
  userId: User['userId'],
  axiosConfig: AxiosRequestConfig = {},
): Promise<void> {
  return authAxios.delete(`/project/${projectId}/user/${userId}`, axiosConfig);
}
