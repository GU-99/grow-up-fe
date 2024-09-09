import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type { Project } from '@/types/ProjectType';
import type { TaskListWithStatus, TaskOrderForm } from '@/types/TaskType';

/**
 * 프로젝트에 속한 모든 일정 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 대상 프로젝트 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<TaskListWithStatus[]>>}
 */
export async function findTaskList(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<TaskListWithStatus[]>(`/project/${projectId}/task`, axiosConfig);
}

/**
 * 일정 순서 변경 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {TaskOrder} newOrderData              - 새로 정렬된 일정 목록 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateTaskOrder(
  projectId: Project['projectId'],
  newOrderData: TaskOrderForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.patch(`/project/${projectId}/task/order`, newOrderData, axiosConfig);
}
