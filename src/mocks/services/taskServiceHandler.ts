import { http, HttpResponse } from 'msw';
import { PROJECT_USER_DUMMY, STATUS_DUMMY, TASK_DUMMY, TASK_FILE_DUMMY, TASK_USER_DUMMY } from '@mocks/mockData';
import { getRoleHash, getStatusHash, getTaskHash, getUserHash } from '@mocks/mockHash';

import type { UserWithRole } from '@/types/UserType';
import type { TaskCreationForm, TaskOrderForm } from '@/types/TaskType';

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
    const { assignees, ...taskInfoForm } = (await request.json()) as TaskCreationForm;
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const statusList = STATUS_DUMMY.filter((status) => status.projectId === Number(projectId));
    if (!statusList.find((status) => status.statusId === Number(taskInfoForm.statusId))) {
      return new HttpResponse(null, { status: 400 });
    }

    const taskId = TASK_DUMMY.length + 1;
    assignees.forEach((userId) => TASK_USER_DUMMY.push({ taskId, userId }));
    TASK_DUMMY.push({ ...taskInfoForm, statusId: +taskInfoForm.statusId, taskId });
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

  // 일정 수행자 목록 조회
  http.get(`${BASE_URL}/project/:projectId/task/:taskId/taskuser`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const taskUserList = TASK_USER_DUMMY.filter((taskUser) => taskUser.taskId === Number(taskId));
    if (taskUserList.length === 0) return HttpResponse.json([]);

    const assigneeList: UserWithRole[] = [];

    for (let i = 0; i < taskUserList.length; i++) {
      const { userId } = taskUserList[i];

      const userHash = getUserHash();
      const user = userHash[userId];

      const projectUser = PROJECT_USER_DUMMY.find(
        (projectUser) => projectUser.userId === userId && projectUser.projectId === Number(projectId),
      );
      if (!projectUser) return new HttpResponse(null, { status: 403 });

      const roleHash = getRoleHash();
      const role = roleHash[projectUser.roleId];

      const assignee = { userId: user.userId, nickname: user.nickname, roleName: role.roleName };
      assigneeList.push(assignee);
    }

    return HttpResponse.json(assigneeList);
  }),

  // 일정 파일 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/task/:taskId/attachment`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // ToDo: JWT의 userId 정보를 가져와 프로젝트 권한 확인이 필요.
    const fileList = TASK_FILE_DUMMY.filter((taskFile) => taskFile.taskId === Number(taskId));
    if (fileList.length === 0) return HttpResponse.json([]);
    return HttpResponse.json(fileList.length === 0 ? [] : fileList);
  }),
];

export default taskServiceHandler;
