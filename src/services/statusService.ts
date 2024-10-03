import { authAxios } from '@services/axiosProvider';

import type { AxiosRequestConfig } from 'axios';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, ProjectStatusForm, StatusOrderForm } from '@/types/ProjectStatusType';

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

/**
 * 프로젝트 상태 수정 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {ProjectStatus['statusId']} statusId  - 프로젝트 상태 ID
 * @param {ProjectStatusForm} formData          - 상태 정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateStatus(
  projectId: Project['projectId'],
  statusId: ProjectStatus['statusId'],
  formData: ProjectStatusForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.patch(`/project/${projectId}/status/${statusId}`, formData, axiosConfig);
}

/**
 * 프로젝트 상태 삭제 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {ProjectStatus['statusId']} statusId  - 프로젝트 상태 ID
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function deleteStatus(
  projectId: Project['projectId'],
  statusId: ProjectStatus['statusId'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.delete(`/project/${projectId}/status/${statusId}`, axiosConfig);
}

/**
 * 상태 순서 변경 API
 *
 * @export
 * @async
 * @param {Project['projectId']} projectId      - 프로젝트 ID
 * @param {StatusOrderForm} newOrderData        - 새로 정렬된 상태 목록 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateStatusesOrder(
  projectId: Project['projectId'],
  newOrderData: StatusOrderForm,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.patch(`/project/${projectId}/status/order`, newOrderData, axiosConfig);
}
