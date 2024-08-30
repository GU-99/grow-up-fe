import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

/**
 * 프로젝트 상태 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId - 프로젝트 ID
 * @param {AxiosRequestConfig} axiosConfig - - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<ProjectStatus[]>>}
 */
export async function getStatusList(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<ProjectStatus[]>(`/project/${projectId}/status`, axiosConfig);
}
