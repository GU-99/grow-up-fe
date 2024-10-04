import { http, HttpResponse } from 'msw';
import {
  FILE_DUMMY,
  PROJECT_DUMMY,
  PROJECT_USER_DUMMY,
  STATUS_DUMMY,
  TASK_DUMMY,
  TASK_FILE_DUMMY,
  TASK_USER_DUMMY,
  USER_DUMMY,
} from '@mocks/mockData';
import { getRoleHash, getStatusHash, getTaskHash, getUserHash } from '@mocks/mockHash';

import type { UserWithRole } from '@/types/UserType';
import type { TaskAssigneeForm, TaskCreationForm, TaskOrderForm, TaskUpdateForm } from '@/types/TaskType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ToDo: 로직 반복을 줄이기 위한 아이디 검색 함수들 추가할 것
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

    const newTask = { ...taskInfoForm, statusId: +taskInfoForm.statusId, taskId };
    TASK_DUMMY.push(newTask);
    return HttpResponse.json(newTask);
  }),
  // 일정 단일  파일 업로드
  http.post(`${BASE_URL}/project/:projectId/task/:taskId/upload`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId } = params;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!accessToken) return new HttpResponse(null, { status: 401 });
    if (!file) return new HttpResponse(null, { status: 400 });
    if (!(file instanceof File)) return new HttpResponse('업로드된 문서는 파일이 아닙니다.', { status: 400 });

    // ToDo: JWT의 userId 정보를 가져와 프로젝트 권한 확인이 필요.
    const project = PROJECT_DUMMY.find((project) => project.projectId === Number(projectId));
    if (!project) return new HttpResponse(null, { status: 404 });

    const task = TASK_DUMMY.find((task) => task.taskId === Number(taskId));
    if (!task) return new HttpResponse(null, { status: 404 });

    // TODO: fileURL은 파일 다운로드시 재설정할 것
    const newFileId = TASK_FILE_DUMMY.length + 1;
    TASK_FILE_DUMMY.push({
      fileId: newFileId,
      taskId: task.taskId,
      fileName: file.name,
      fileUrl: '',
    });

    // MSW 파일 다운로드 테스트를 위해 메모리에 임시 저장
    FILE_DUMMY.push({
      fileId: newFileId,
      taskId: task.taskId,
      file: new Blob([file], { type: file.type }),
    });

    return new HttpResponse(null, { status: 200 });
  }),
  // 일정 파일 삭제 API
  http.delete(`${BASE_URL}/project/:projectId/task/:taskId/file/:fileId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId, fileId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // ToDo: JWT의 userId 정보를 가져와 프로젝트 권한 확인이 필요.
    const task = TASK_DUMMY.find((task) => task.taskId === Number(taskId));
    if (!task) return new HttpResponse(null, { status: 404 });

    const taskFileIndex = TASK_FILE_DUMMY.findIndex(
      (taskFile) => taskFile.fileId === Number(fileId) && taskFile.taskId === Number(taskId),
    );
    if (taskFileIndex === -1) return new HttpResponse(null, { status: 404 });
    TASK_FILE_DUMMY.splice(taskFileIndex, 1);

    const fileIndex = FILE_DUMMY.findIndex((file) => file.fileId === Number(fileId) && file.taskId === Number(taskId));
    if (fileIndex === -1) return new HttpResponse(null, { status: 404 });
    FILE_DUMMY.splice(fileIndex, 1);

    return new HttpResponse(null, { status: 204 });
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
  // 일정 정보 수정 API
  http.patch(`${BASE_URL}/project/:projectId/task/:taskId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId } = params;
    const taskInfoData = (await request.json()) as TaskUpdateForm;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // ToDo: JWT의 userId 정보를 가져와 프로젝트 권한 확인이 필요.
    const project = PROJECT_DUMMY.find((project) => project.projectId === Number(projectId));
    if (!project) return new HttpResponse(null, { status: 404 });

    const statuses = STATUS_DUMMY.filter((status) => status.projectId === project.projectId);
    if (statuses.length === 0) return new HttpResponse(null, { status: 404 });

    const task = TASK_DUMMY.find((task) => task.taskId === Number(taskId));
    if (!task) return new HttpResponse(null, { status: 404 });

    const isIncludedTask = statuses.map((status) => status.statusId).includes(task.statusId);
    if (!isIncludedTask) return new HttpResponse(null, { status: 404 });

    const index = TASK_DUMMY.findIndex((task) => task.taskId === Number(taskId));
    if (index !== -1) {
      TASK_DUMMY[index] = { ...TASK_DUMMY[index], ...taskInfoData, statusId: Number(taskInfoData.statusId) };
    }

    return new HttpResponse(null, { status: 200 });
  }),
  // 일정 삭제 API
  http.delete(`${BASE_URL}/project/:projectId/task/:taskId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // ToDo: JWT의 userId 정보를 가져와 프로젝트 권한 확인이 필요.
    const project = PROJECT_DUMMY.find((project) => project.projectId === Number(projectId));
    if (!project) return new HttpResponse(null, { status: 404 });

    const statuses = STATUS_DUMMY.filter((status) => status.projectId === project.projectId);
    if (statuses.length === 0) return new HttpResponse(null, { status: 404 });

    const task = TASK_DUMMY.find((task) => task.taskId === Number(taskId));
    if (!task) return new HttpResponse(null, { status: 404 });

    const isIncludedTask = statuses.map((status) => status.statusId).includes(task.statusId);
    if (!isIncludedTask) return new HttpResponse(null, { status: 404 });

    // 일정 삭제
    const taskIndex = TASK_DUMMY.findIndex((task) => task.taskId === Number(taskId));
    if (taskIndex !== -1) TASK_DUMMY.splice(taskIndex, 1);

    // 프로젝트 상태에 남은 일정 순서 재정렬
    TASK_DUMMY.filter((target) => target.statusId === task.statusId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach((task, index) => (task.sortOrder = index + 1));

    // 일정의 수행자 삭제
    const filteredTaskUser = TASK_USER_DUMMY.filter((taskUser) => taskUser.taskId !== Number(taskId));
    if (filteredTaskUser.length !== TASK_USER_DUMMY.length) {
      TASK_USER_DUMMY.length = 0;
      TASK_USER_DUMMY.push(...filteredTaskUser);
    }

    // 일정의 파일 삭제
    const filteredTaskFile = TASK_FILE_DUMMY.filter((taskFile) => taskFile.taskId !== Number(taskId));
    if (filteredTaskFile.length !== TASK_FILE_DUMMY.length) {
      TASK_FILE_DUMMY.length = 0;
      TASK_FILE_DUMMY.push(...filteredTaskFile);
    }

    // MSW용 파일 정보 삭제
    const filteredFile = FILE_DUMMY.filter((file) => file.taskId !== Number(taskId));
    if (filteredFile.length !== FILE_DUMMY.length) {
      FILE_DUMMY.length = 0;
      FILE_DUMMY.push(...filteredFile);
    }

    return new HttpResponse(null, { status: 204 });
  }),
  // 일정 수행자 추가 API
  http.post(`${BASE_URL}/project/:projectId/task/:taskId/assignee`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { userId } = (await request.json()) as TaskAssigneeForm;
    const { projectId, taskId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const projectUser = PROJECT_USER_DUMMY.find(
      (projectUser) => projectUser.userId === Number(userId) && projectUser.projectId === Number(projectId),
    );
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    const user = USER_DUMMY.find((user) => user.userId === Number(userId));
    if (!user) return new HttpResponse(null, { status: 404 });

    const project = PROJECT_DUMMY.find((project) => project.projectId === Number(projectId));
    if (!project) return new HttpResponse(null, { status: 404 });

    const statuses = STATUS_DUMMY.filter((status) => status.projectId === project.projectId);
    if (statuses.length === 0) return new HttpResponse(null, { status: 404 });

    const task = TASK_DUMMY.find((task) => task.taskId === Number(taskId));
    if (!task) return new HttpResponse(null, { status: 404 });

    const isIncludedTask = statuses.map((status) => status.statusId).includes(task.statusId);
    if (!isIncludedTask) return new HttpResponse(null, { status: 404 });

    const isAlreadyAssigned = TASK_USER_DUMMY.find(
      (taskUser) => taskUser.taskId === Number(taskId) && taskUser.userId === userId,
    );
    if (isAlreadyAssigned) return new HttpResponse(null, { status: 400 });

    TASK_USER_DUMMY.push({ taskId: Number(taskId), userId });

    return new HttpResponse(null, { status: 200 });
  }),
  // 일정 수행자 삭제 API
  http.delete(`${BASE_URL}/project/:projectId/task/:taskId/assignee/:userId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId, userId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const projectUser = PROJECT_USER_DUMMY.find(
      (projectUser) => projectUser.userId === Number(userId) && projectUser.projectId === Number(projectId),
    );
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    const user = USER_DUMMY.find((user) => user.userId === Number(userId));
    if (!user) return new HttpResponse(null, { status: 404 });

    const project = PROJECT_DUMMY.find((project) => project.projectId === Number(projectId));
    if (!project) return new HttpResponse(null, { status: 404 });

    const statuses = STATUS_DUMMY.filter((status) => status.projectId === project.projectId);
    if (statuses.length === 0) return new HttpResponse(null, { status: 404 });

    const task = TASK_DUMMY.find((task) => task.taskId === Number(taskId));
    if (!task) return new HttpResponse(null, { status: 404 });

    const isIncludedTask = statuses.map((status) => status.statusId).includes(task.statusId);
    if (!isIncludedTask) return new HttpResponse(null, { status: 404 });

    const isExistedAssignee = TASK_USER_DUMMY.find(
      (taskUser) => taskUser.taskId === Number(taskId) && taskUser.userId === Number(userId),
    );
    if (!isExistedAssignee) return new HttpResponse(null, { status: 404 });

    const index = TASK_USER_DUMMY.findIndex(
      (taskUser) => taskUser.taskId === Number(taskId) && taskUser.userId === Number(userId),
    );
    if (index !== -1) {
      TASK_USER_DUMMY.splice(index, 1);
    }
    return new HttpResponse(null, { status: 204 });
  }),
];

export default taskServiceHandler;
