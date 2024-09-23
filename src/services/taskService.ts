import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type { TaskFile } from '@/types/FileType';
import type { Project } from '@/types/ProjectType';
import type { Assignee } from '@/types/AssigneeType';
import type { Task, TaskInfoForm, TaskListWithStatus, TaskOrderForm } from '@/types/TaskType';

/**
 * 프로젝트에 속한 모든 일정 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<TaskListWithStatus[]>>}
 */
export async function findTaskList(projectId: Project['projectId'], axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<TaskListWithStatus[]>(`/project/${projectId}/task`, axiosConfig);
}

/**
 * 일정 생성 API
 *
 * @export
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {TaskInfoForm} formData               - 새로운 일정 정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export function createTask(
  projectId: Project['projectId'],
  formData: TaskInfoForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.post(`/project/${projectId}/task`, formData, axiosConfig);
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

/**
 * 일정 수행자 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {Task['taskId']} taskId               - 일정 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<Assignee[]>>}
 */
export async function findAssignees(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<Assignee[]>(`/project/${projectId}/task/${taskId}/taskuser`, axiosConfig);
}

/**
 * 일정 파일 목록 조회 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {Task['taskId']} taskId               - 일정 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<TaskFile[]>>}
 */
export async function findTaskFiles(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<TaskFile[]>(`/project/${projectId}/task/${taskId}/attachment`, axiosConfig);
}
