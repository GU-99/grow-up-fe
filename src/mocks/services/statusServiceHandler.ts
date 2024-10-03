import { http, HttpResponse } from 'msw';
import { PROJECT_DUMMY, STATUS_DUMMY } from '@mocks/mockData';
import { getStatusHash } from '@mocks/mockHash';

import type { ProjectStatusForm, StatusOrderForm } from '@/types/ProjectStatusType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const statusServiceHandler = [
  // 프로젝트 상태 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/status`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const statusList = STATUS_DUMMY.filter((status) => status.projectId === Number(projectId)).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );

    return HttpResponse.json(statusList);
  }),
  // 프로젝트 상태 생성 API
  http.post(`${BASE_URL}/project/:projectId/status`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;
    const formData = (await request.json()) as ProjectStatusForm;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    STATUS_DUMMY.push({ statusId: STATUS_DUMMY.length, projectId: Number(projectId), ...formData });

    return new HttpResponse(null, { status: 200 });
  }),
  // 상태 순서 변경 API
  http.patch(`${BASE_URL}/project/:projectId/status/order`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { statuses: statusOrders } = (await request.json()) as StatusOrderForm;
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    for (let i = 0; i < statusOrders.length; i++) {
      const { statusId, sortOrder } = statusOrders[i];

      const statusHash = getStatusHash();
      const target = statusHash[statusId];
      if (!target) return new HttpResponse(null, { status: 404 });
      if (target.projectId !== Number(projectId)) return new HttpResponse(null, { status: 400 });

      target.statusId = statusId;
      target.sortOrder = sortOrder;
    }

    return new HttpResponse(null, { status: 204 });
  }),
  // 프로젝트 상태 수정 API
  http.patch(`${BASE_URL}/project/:projectId/status/:statusId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, statusId } = params;
    const formData = (await request.json()) as ProjectStatusForm;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const status = STATUS_DUMMY.find(
      (status) => status.projectId === Number(projectId) && status.statusId === Number(statusId),
    );
    if (!status) return new HttpResponse(null, { status: 404 });

    status.statusName = formData.statusName;
    status.colorCode = formData.colorCode;
    status.sortOrder = formData.sortOrder;
    return new HttpResponse(null, { status: 204 });
  }),
  // 프로젝트 상태 삭제 API
  http.delete(`${BASE_URL}/project/:projectId/status/:statusId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, statusId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // ToDo: JWT의 userId 정보를 가져와 프로젝트 권한 확인이 필요.
    const project = PROJECT_DUMMY.find((project) => project.projectId === Number(projectId));
    if (!project) return new HttpResponse(null, { status: 404 });

    const statuses = STATUS_DUMMY.filter((status) => status.projectId === project.projectId);
    if (statuses.length === 0) return new HttpResponse(null, { status: 404 });

    const isIncludedStatus = statuses.map((status) => status.statusId).includes(Number(statusId));
    if (!isIncludedStatus) return new HttpResponse(null, { status: 404 });

    const statusIndex = STATUS_DUMMY.findIndex((status) => status.statusId === Number(statusId));
    if (statusIndex !== -1) STATUS_DUMMY.splice(statusIndex, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];

export default statusServiceHandler;
