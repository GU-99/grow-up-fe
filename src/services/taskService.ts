import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Project } from '@/types/ProjectType';
import type { TaskListWithStatus } from '@/types/TaskType';

/**
 * 프로젝트에 속한 모든 할일 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId - 대상 프로젝트 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<TaskListWithStatus[]>>}
 */
export async function findTaskList(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<TaskListWithStatus[]>(`project/${projectId}/task`, axiosConfig);
}
