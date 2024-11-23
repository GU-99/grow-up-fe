import { http, HttpResponse } from 'msw';
import {
  createAssignee,
  createTask,
  createTaskFile,
  deleteAllAssignee,
  deleteAllTaskFile,
  deleteAllTaskFileInMemory,
  deleteAssignee,
  deleteTask,
  deleteTaskFile,
  deleteTaskFileInMemory,
  downloadTaskFileInMemory,
  findAllAssignee,
  findAllProjectStatus,
  findAllTask,
  findAllTaskFile,
  findAssignee,
  findProject,
  findProjectStatus,
  findProjectUser,
  findRole,
  findTask,
  findTeamUser,
  findUser,
  reorderTaskByStatus,
  saveTaskFileInMemory,
  updateTask,
} from '@mocks/mockAPI';
import { fileNameParser } from '@utils/fileNameParser';
import { convertTokenToUserId } from '@utils/converter';
import { TASK_DUMMY, TASK_FILE_DUMMY } from '@mocks/mockData';

import type { UserWithRole } from '@/types/UserType';
import type { TaskAssigneeForm, TaskCreationForm, TaskOrderForm, TaskUpdateForm } from '@/types/TaskType';

const API_URL = import.meta.env.VITE_API_URL;
let autoIncrementIdForTask = TASK_DUMMY.length + 1;
let autoIncrementIdForTaskFile = TASK_FILE_DUMMY.length + 1;

const taskServiceHandler = [
  // 일정 목록 조회 API
  http.get(`${API_URL}/project/:projectId/task`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 아이디 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 프로젝트 정보 취득
    const project = findProject(projectId);
    if (!project) return new HttpResponse(null, { status: 404 });

    // 유저의 팀 접근 권한 확인
    const teamUser = findTeamUser(project.teamId, userId);
    if (!teamUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트 상태 정보 취득
    const statuses = findAllProjectStatus(projectId);
    if (statuses.length === 0) return HttpResponse.json([]);

    // 프로젝트 일정 정보 취득
    const sortedStatuses = statuses.sort((a, b) => a.sortOrder - b.sortOrder);
    const statusTasks = sortedStatuses.map((status) => {
      const tasks = findAllTask(status.statusId).sort((a, b) => a.sortOrder - b.sortOrder);
      return { ...status, tasks };
    });

    return HttpResponse.json(statusTasks);
  }),

  // 일정 생성 API
  http.post(`${API_URL}/project/:projectId/task`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { assignees, ...taskInfoForm } = (await request.json()) as TaskCreationForm;
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 아이디 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트 상태 정보 취득
    const taskInfoFormStatusId = Number(taskInfoForm.statusId);
    const statusIds = findAllProjectStatus(projectId).map((status) => status.statusId);
    if (!statusIds.includes(taskInfoFormStatusId)) return new HttpResponse(null, { status: 400 });

    // 일정 정보 추가
    const taskId = autoIncrementIdForTask++;
    assignees.forEach((userId) => createAssignee({ taskId, userId }));

    const newTask = { ...taskInfoForm, statusId: taskInfoFormStatusId, taskId };
    createTask({ ...taskInfoForm, statusId: taskInfoFormStatusId, taskId });

    return HttpResponse.json(newTask);
  }),

  // 일정 단일 파일 업로드 API
  http.post(`${API_URL}/project/:projectId/task/:taskId/upload`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);
    const formData = await request.formData();
    const file = formData.get('file');

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 업로드 파일 확인
    if (!file) return new HttpResponse(null, { status: 400 });
    if (!(file instanceof File)) return new HttpResponse('업로드된 문서는 파일이 아닙니다.', { status: 400 });

    // 일정 정보 취득
    const task = findTask(taskId);
    if (!task) return new HttpResponse(null, { status: 404 });

    // 일정 파일 정보 추가
    const newFileId = autoIncrementIdForTaskFile++;
    const { fileName, extension } = fileNameParser(file.name);
    const uploadName = extension ? `${fileName}_${Date.now()}.${extension}` : `${fileName}_${Date.now()}`;
    createTaskFile({
      fileId: newFileId,
      taskId: task.taskId,
      fileName: file.name,
      uploadName,
    });

    // MSW 파일 다운로드 테스트를 위해 메모리에 임시 저장
    saveTaskFileInMemory({
      fileId: newFileId,
      taskId: task.taskId,
      file: new Blob([file], { type: file.type }),
      uploadName,
    });

    return new HttpResponse(null, { status: 200 });
  }),

  // 일정 파일 다운로드 API
  http.get(`${API_URL}/file/project/:projectId/:taskId/:fileName`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId, taskId, fileName } = params;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(Number(projectId), userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 일정 파일 정보 취득
    const decodedFileName = decodeURIComponent(fileName.toString());
    const fileInfo = downloadTaskFileInMemory(decodedFileName);
    if (!fileInfo) return new HttpResponse(null, { status: 404 });

    // 일정 파일 검증
    if (fileInfo.taskId !== Number(taskId)) return new HttpResponse(null, { status: 400 });

    // 일정 파일 다운로드 응답
    const buffer = await fileInfo.file.arrayBuffer();
    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        'Content-Type': fileInfo.file.type,
      },
    });
  }),

  // 일정 파일 삭제 API
  http.delete(`${API_URL}/project/:projectId/task/:taskId/file/:fileId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);
    const fileId = Number(params.fileId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 일정 정보 취득
    const task = findTask(taskId);
    if (!task) return new HttpResponse(null, { status: 404 });

    // 일정 파일 삭제
    try {
      deleteTaskFile(taskId, fileId);
      deleteTaskFileInMemory(taskId, fileId);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 500 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // 일정 순서 변경 API
  http.patch(`${API_URL}/project/:projectId/task/order`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { tasks: taskOrders } = (await request.json()) as TaskOrderForm;
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 일정 정렬 순서 변경
    for (let i = 0; i < taskOrders.length; i++) {
      const { taskId, statusId, sortOrder } = taskOrders[i];

      const status = findProjectStatus(statusId);
      if (!status) return new HttpResponse(null, { status: 404 });
      if (status.projectId !== projectId) return new HttpResponse(null, { status: 400 });

      const task = findTask(taskId);
      if (!task) return new HttpResponse(null, { status: 404 });

      task.statusId = statusId;
      task.sortOrder = sortOrder;
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // 일정 수행자 목록 조회
  http.get(`${API_URL}/project/:projectId/task/:taskId/taskuser`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);

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

    // 일정 수행자 (유저/일정 ID) 정보 취득
    const taskUsers = findAllAssignee(taskId);
    if (taskUsers.length === 0) return HttpResponse.json([]);

    // 일정 수행자 정보 가공
    const assigneeList: UserWithRole[] = [];
    for (let i = 0; i < taskUsers.length; i++) {
      const { userId } = taskUsers[i];

      const projectUser = findProjectUser(projectId, userId);
      if (!projectUser) return new HttpResponse(null, { status: 403 });

      const user = findUser(userId);
      const role = findRole(projectUser.roleId);
      if (!user || !role) return new HttpResponse(null, { status: 404 });

      const assignee = { userId: user.userId, nickname: user.nickname, roleName: role.roleName };
      assigneeList.push(assignee);
    }

    return HttpResponse.json(assigneeList);
  }),

  // 일정 파일 목록 조회 API
  http.get(`${API_URL}/project/:projectId/task/:taskId/attachment`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);

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

    // 모든 일정 파일 정보 조회
    const files = findAllTaskFile(taskId);
    if (files.length === 0) return HttpResponse.json([]);

    return HttpResponse.json(files.length === 0 ? [] : files);
  }),

  // 일정 정보 수정 API
  http.patch(`${API_URL}/project/:projectId/task/:taskId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);
    const newTaskInfo = (await request.json()) as TaskUpdateForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 일정 존재 여부 확인
    const task = findTask(taskId);
    if (!task) return new HttpResponse(null, { status: 404 });

    // 일정 정보 수정
    try {
      updateTask(taskId, newTaskInfo);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 500 });
    }

    return new HttpResponse(null, { status: 200 });
  }),

  // 일정 삭제 API
  http.delete(`${API_URL}/project/:projectId/task/:taskId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 일정 존재 여부 확인
    const task = findTask(taskId);
    if (!task) return new HttpResponse(null, { status: 404 });

    // 일정 삭제
    try {
      deleteTask(taskId);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 404 });
    }

    // 일정의 모든 수행자 삭제
    deleteAllAssignee(taskId);

    // 일정의 모든 파일 삭제
    deleteAllTaskFile(taskId);

    // MSW용 모든 파일 정보 삭제
    deleteAllTaskFileInMemory(taskId);

    // 프로젝트 상태에 남은 일정 순서 재정렬
    reorderTaskByStatus(task.statusId);

    return new HttpResponse(null, { status: 204 });
  }),

  // 일정 수행자 추가 API
  http.post(`${API_URL}/project/:projectId/task/:taskId/assignee`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const taskAssigneeForm = (await request.json()) as TaskAssigneeForm;
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);
    const assigneeId = Number(taskAssigneeForm.userId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 수행자 존재 여부 확인
    const assignee = findUser(assigneeId);
    if (!assignee) return new HttpResponse(null, { status: 404 });

    // 수행자의 프로젝트 접근 권한 확인
    const projectAssignee = findProjectUser(projectId, assigneeId);
    if (!projectAssignee) return new HttpResponse(null, { status: 403 });

    // 일정 존재 여부 확인
    const task = findTask(taskId);
    if (!task) return new HttpResponse(null, { status: 404 });

    // 이미 포함된 수행자인지 확인
    const isAlreadyAssigned = findAssignee(taskId, assigneeId);
    if (isAlreadyAssigned) return new HttpResponse(null, { status: 400 });

    // 일정 수행자 추가
    createAssignee({ taskId, userId: assigneeId });

    return new HttpResponse(null, { status: 200 });
  }),

  // 일정 수행자 삭제 API
  http.delete(`${API_URL}/project/:projectId/task/:taskId/assignee/:userId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const taskId = Number(params.taskId);
    const assigneeId = Number(params.userId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 수행자 존재 여부 확인
    const assignee = findUser(Number(assigneeId));
    if (!assignee) return new HttpResponse(null, { status: 404 });

    // 수행자의 프로젝트 접근 권한 확인
    const projectAssignee = findProjectUser(projectId, assigneeId);
    if (!projectAssignee) return new HttpResponse(null, { status: 403 });

    // 일정 존재 여부 확인
    const task = findTask(taskId);
    if (!task) return new HttpResponse(null, { status: 404 });

    // 수행자가 존재하는지 확인
    const isExistedAssignee = findAssignee(taskId, assigneeId);
    if (!isExistedAssignee) return new HttpResponse(null, { status: 404 });

    // 수행자 삭제
    deleteAssignee(taskId, assigneeId);

    return new HttpResponse(null, { status: 204 });
  }),
];

export default taskServiceHandler;
