import { http, HttpResponse } from 'msw';
import {
  deleteAllProjectStatus,
  deleteAllProjectUser,
  deleteAllTask,
  deleteAllTaskFile,
  deleteAllTaskFileInMemory,
  deleteAllTaskUser,
  deleteProject,
  findAllProject,
  findAllProjectStatus,
  findAllProjectUser,
  findAllTask,
  findProject,
  findProjectUser,
  findRole,
  findTeamUser,
  findUser,
} from '@mocks/mockAPI';
import { convertTokenToUserId } from '@utils/converter';
import type { SearchUser, UserWithRole } from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const projectServiceHandler = [
  // 프로젝트 소속 유저 검색 API
  http.get(`${BASE_URL}/project/:projectId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트에 속하는 모든 유저 검색
    const projectUsers = findAllProjectUser(projectId);

    // 프로젝트 유저 정보 취득
    const searchUsers: SearchUser[] = [];
    for (let i = 0; i < projectUsers.length; i++) {
      const user = findUser(projectUsers[i].userId);
      if (!user) return new HttpResponse(null, { status: 500 });
      searchUsers.push({ userId: user.userId, nickname: user.nickname });
    }

    // 접두사(nickname)과 일치하는 유저 정보 최대 5명 추출
    const prefixRegex = new RegExp(`^${nickname}`);
    const matchedSearchUsers = searchUsers.filter((user) => prefixRegex.test(user.nickname)).slice(0, 5);

    return HttpResponse.json(matchedSearchUsers);
  }),

  // 프로젝트 목록 조회 API
  http.get(`${BASE_URL}/team/:teamId/project`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 팀 접근 권한 확인
    const teamUser = findTeamUser(teamId, userId);
    if (!teamUser) return new HttpResponse(null, { status: 403 });

    // 특정 팀의 모든 프로젝트 조회
    const projects = findAllProject(teamId);
    return HttpResponse.json(projects);
  }),

  // 프로젝트 팀원 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/user`, ({ request, params }) => {
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

    // 프로젝트의 모든 유저 조회
    const projectUsers = findAllProjectUser(projectId);

    // 프로젝트에 포함된 유저 정보 취득
    const userRoles: UserWithRole[] = [];
    for (let i = 0; i < projectUsers.length; i++) {
      const { userId, roleId } = projectUsers[i];

      const user = findUser(userId);
      const role = findRole(roleId);
      if (!user || !role) return new HttpResponse(null, { status: 500 });

      userRoles.push({ userId, nickname: user.nickname, roleName: role.roleName });
    }

    return HttpResponse.json(userRoles);
  }),

  // 프로젝트 삭제 API
  http.delete(`${BASE_URL}/project/:projectId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 프로젝트의 모든 프로젝트 상태 ID 정보 취득
    const statusIds = findAllProjectStatus(projectId).map((status) => status.statusId);

    // 프로젝트의 모든 일정 ID 정보 취득
    const taskIds: number[] = [];
    statusIds.forEach((statusId) => {
      const tasks = findAllTask(statusId);
      tasks.forEach((task) => taskIds.push(task.taskId));
    });

    // 프로젝트 삭제(순서 중요)
    try {
      taskIds.forEach((taskId) => {
        deleteAllTaskFileInMemory(taskId);
        deleteAllTaskFile(taskId);
        deleteAllTaskUser(taskId);
      });
      deleteAllTask(projectId);
      deleteAllProjectStatus(projectId);
      deleteProject(projectId);
      deleteAllProjectUser(projectId);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 500 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];

export default projectServiceHandler;
