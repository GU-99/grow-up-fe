import { http, HttpResponse } from 'msw';
import { STATUS_DUMMY, TASK_DUMMY, TASK_USER_DUMMY } from '@mocks/mockData';
import { getStatusHash, getTaskHash } from '@mocks/mockHash';
import type { TaskForm, TaskOrderForm } from '@/types/TaskType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const taskServiceHandler = [
  // 일정 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/task`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const statusList = STATUS_DUMMY.filter((status) => status.projectId === Number(projectId)).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
    const statusTaskList = statusList.map((status) => {
      const tasks = TASK_DUMMY.filter((task) => task.statusId === status.statusId).sort(
        (a, b) => a.sortOrder - b.sortOrder,
      );
      return { ...status, tasks };
    });

    return HttpResponse.json(statusTaskList);
  }),
  // 일정 생성 API
  http.post(`${BASE_URL}/project/:projectId/task`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { assignees, ...restFormData } = (await request.json()) as TaskForm;
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const statusList = STATUS_DUMMY.filter((status) => status.projectId === Number(projectId));
    if (!statusList.find((status) => status.statusId === Number(restFormData.statusId))) {
      return new HttpResponse(null, { status: 400 });
    }

    const taskId = TASK_DUMMY.length + 1;
    assignees.forEach((userId) => TASK_USER_DUMMY.push({ taskId, userId }));
    TASK_DUMMY.push({ ...restFormData, statusId: +restFormData.statusId, taskId, files: [] });
    return new HttpResponse(null, { status: 201 });
  }),
  // 일정 순서 변경 API
  http.patch(`${BASE_URL}/project/:projectId/task/order`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { tasks: taskOrders } = (await request.json()) as TaskOrderForm;
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    for (let i = 0; i < taskOrders.length; i++) {
      const { taskId, statusId, sortOrder } = taskOrders[i];

      const taskHash = getTaskHash();
      const target = taskHash[taskId];
      if (!target) return new HttpResponse(null, { status: 404 });

      const statusHash = getStatusHash();
      const status = statusHash[statusId];
      if (status.projectId !== Number(projectId)) return new HttpResponse(null, { status: 400 });

      target.statusId = statusId;
      target.sortOrder = sortOrder;
    }
    return new HttpResponse(null, { status: 204 });
  }),
];

export default taskServiceHandler;
