import { http, HttpResponse } from 'msw';
import { STATUS_DUMMY } from '@mocks/mockData';
import {
  createProjectStatus,
  deleteProjectStatus,
  findAllProjectStatus,
  findProject,
  findProjectStatus,
  findProjectUser,
  findTeamUser,
  reorderStatusByProject,
  updateProjectStatus,
} from '@mocks/mockAPI';
import { convertTokenToUserId } from '@utils/converter';

import type { ProjectStatusForm, StatusOrderForm } from '@/types/ProjectStatusType';

const BASE_URL = import.meta.env.VITE_BASE_URL;
let authIncrementIdForStatus = STATUS_DUMMY.length + 1;

const statusServiceHandler = [
  // 프로젝트 상태 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/status`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 프로젝트 정보 취득
    const project = findProject(projectId);
    if (!project) return new HttpResponse(null, { status: 404 });

    // 유저의 팀 접근 권한 확인
    const teamUser = findTeamUser(project.teamId, userId);
    if (!teamUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트의 모든 상태 정보 조회
    const statuses = findAllProjectStatus(projectId).sort((a, b) => a.sortOrder - b.sortOrder);

    return HttpResponse.json(statuses);
  }),

  // 프로젝트 상태 생성 API
  http.post(`${BASE_URL}/project/:projectId/status`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const formData = (await request.json()) as ProjectStatusForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트 상태 생성
    createProjectStatus({ statusId: authIncrementIdForStatus++, projectId, ...formData });

    return new HttpResponse(null, { status: 200 });
  }),

  // 프로젝트 상태 순서 변경 API
  http.patch(`${BASE_URL}/project/:projectId/status/order`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { statuses: statusOrders } = (await request.json()) as StatusOrderForm;
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 상태 순서 재정렬
    for (let i = 0; i < statusOrders.length; i++) {
      const { statusId, sortOrder } = statusOrders[i];

      const status = findProjectStatus(Number(statusId));
      if (!status) return new HttpResponse(null, { status: 404 });
      if (status.projectId !== projectId) return new HttpResponse(null, { status: 400 });

      status.sortOrder = sortOrder;
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // 프로젝트 상태 수정 API
  http.patch(`${BASE_URL}/project/:projectId/status/:statusId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const statusId = Number(params.statusId);
    const newStatusInfo = (await request.json()) as ProjectStatusForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트 상태 정보 수정
    try {
      updateProjectStatus(statusId, newStatusInfo);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 500 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // 프로젝트 상태 삭제 API
  http.delete(`${BASE_URL}/project/:projectId/status/:statusId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const statusId = Number(params.statusId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트 상태 삭제
    try {
      deleteProjectStatus(statusId);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 500 });
    }

    // 프로젝튼 상태 순서 재정렬
    reorderStatusByProject(projectId);

    return new HttpResponse(null, { status: 204 });
  }),
];

export default statusServiceHandler;
