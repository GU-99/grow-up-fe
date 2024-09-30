import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type { TaskFile } from '@/types/FileType';
import type { Project } from '@/types/ProjectType';
import type { User, UserWithRole } from '@/types/UserType';
import type { Task, TaskCreationForm, TaskUpdateForm, TaskListWithStatus, TaskOrderForm } from '@/types/TaskType';

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
 * @param {TaskCreationForm} formData           - 새로운 일정 정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<Task>>}
 */
export function createTask(
  projectId: Project['projectId'],
  formData: TaskCreationForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.post<Task>(`/project/${projectId}/task`, formData, axiosConfig);
}

/**
 * 일정 파일 업로드 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId        - 프로젝트 ID
 * @param {Task['taskId']} taskId                 - 일정 ID
 * @param {File} file                             - 단일 파일 객체
 * @param {AxiosRequestConfig} [axiosConfig={}]   - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function uploadTaskFile(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  file: File,
  axiosConfig: AxiosRequestConfig = {},
) {
  const fileFormData = new FormData();
  fileFormData.append('file', file);
  return authAxios.postForm(`/project/${projectId}/task/${taskId}/upload`, fileFormData, axiosConfig);
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
 * @returns {Promise<AxiosResponse<UserWithRole[]>>}
 */
export async function findAssignees(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<UserWithRole[]>(`/project/${projectId}/task/${taskId}/taskuser`, axiosConfig);
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

/**
 * 일정 정보 수정 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {Task['taskId']} taskId               - 일정 ID
 * @param {TaskUpdateForm} formData               - 일정 수정 정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateTaskInfo(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  formData: TaskUpdateForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.patch(`/project/${projectId}/task/${taskId}`, formData, axiosConfig);
}

/**
 * 일정 수행자 추가 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId        - 프로젝트 ID
 * @param {Task['taskId']} taskId                 - 일정 ID
 * @param {User['userId']} userId                 - 수행자 ID
 * @param {AxiosRequestConfig} [axiosConfig={}]   - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function addAssignee(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  userId: User['userId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.post(`/project/${projectId}/task/${taskId}/assignee`, { userId }, axiosConfig);
}

/**
 * 일정 수행자 삭제 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId        - 프로젝트 ID
 * @param {Task['taskId']} taskId                 - 일정 ID
 * @param {User['userId']} userId                 - 수행자 ID
 * @param {AxiosRequestConfig} [axiosConfig={}]   - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function deleteAssignee(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  userId: User['userId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.delete(`/project/${projectId}/task/${taskId}/assignee/${userId}`, axiosConfig);
}

/**
 * 일정 파일 삭제 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {Task['taskId']} taskId               - 일정 ID
 * @param {TaskFile['fileId']} fileId           - 일정 파일 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function deleteTaskFile(
  projectId: Project['projectId'],
  taskId: Task['taskId'],
  fileId: TaskFile['fileId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.delete(`/project/${projectId}/task/${taskId}/file/${fileId}`, axiosConfig);
}
