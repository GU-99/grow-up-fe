import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, ProjectStatusForm } from '@/types/ProjectStatusType';

/**
 * 프로젝트 상태 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId - 프로젝트 ID
 * @param {AxiosRequestConfig} axiosConfig - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<ProjectStatus[]>>}
 */
export async function getStatusList(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<ProjectStatus[]>(`/project/${projectId}/status`, axiosConfig);
}

/**
 * 프로젝트 상태 생성 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId - 프로젝트 ID
 * @param {ProjectStatusForm} formData     - 상태 정보 객체
 * @param {AxiosRequestConfig} axiosConfig - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function createStatus(
  projectId: Project['projectId'],
  formData: ProjectStatusForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.post(`/project/${projectId}/status`, formData, axiosConfig);
}
