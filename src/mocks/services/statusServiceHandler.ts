import { http, HttpResponse } from 'msw';
import { STATUS_DUMMY } from '@mocks/mockData';

import type { ProjectStatusForm } from '@/types/ProjectStatusType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const statusServiceHandler = [
  // 프로젝트 상태 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/status`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const statusList = STATUS_DUMMY.filter((status) => status.projectId === Number(projectId));

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
];

export default statusServiceHandler;
