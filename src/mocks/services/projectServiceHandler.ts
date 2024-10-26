import { http, HttpResponse } from 'msw';
import {
  createProject,
  createProjectUser,
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
  findRoleByRoleName,
  findTeamUser,
  findUser,
} from '@mocks/mockAPI';
import { PROJECT_DUMMY } from '@mocks/mockData';
import { convertTokenToUserId } from '@utils/converter';
import type { SearchUser, UserWithRole } from '@/types/UserType';
import { Project, ProjectForm } from '@/types/ProjectType';

const BASE_URL = import.meta.env.VITE_BASE_URL;
let autoIncrementIdForProject = PROJECT_DUMMY.length + 1;

const projectServiceHandler = [
  // 프로젝트 소속 유저 검색 API
  http.get(`${BASE_URL}/project/:projectId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname') || '';
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
      if (!user) return new HttpResponse(null, { status: 404 });
      searchUsers.push({ userId: user.userId, nickname: user.nickname });
    }

    // 접두사(nickname)과 일치하는 유저 정보 최대 5명 추출
    const matchedSearchUsers = searchUsers.filter((user) => user.nickname.startsWith(nickname)).slice(0, 5);

    return HttpResponse.json(matchedSearchUsers);
  }),

  // 프로젝트 생성 API
  http.post(`${BASE_URL}/team/:teamId/project`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);
    const { coworkers, ...projectInfo } = (await request.json()) as ProjectForm;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 접근 권한 확인
    const teamUser = findTeamUser(teamId, userId);
    if (!teamUser) return new HttpResponse('매칭되는 팀 역할이 없습니다.', { status: 403 });

    // 팀 역할별 권한 확인
    const userRole = findRole(teamUser.roleId);
    if (!userRole) return new HttpResponse(null, { status: 500 });
    if (!(userRole.roleName === 'HEAD' || userRole.roleName === 'LEADER')) {
      return new HttpResponse('팀 생성 권한이 없습니다.', { status: 403 });
    }

    // 프로젝트 생성
    const projectId = autoIncrementIdForProject++;
    const newProject: Project = {
      projectId,
      teamId,
      ...projectInfo,
      startDate: new Date(projectInfo.startDate),
      endDate: projectInfo.endDate ? new Date(projectInfo.endDate) : null,
    };
    createProject(newProject);

    // 프로젝트 유저 연결 생성
    // ToDo: 중간에 잘못되면 일관성, 정합성을 유지할 수 없음 수정 필요.
    coworkers.push({ userId, roleName: 'ADMIN' });
    for (let i = 0; i < coworkers.length; i++) {
      const coworker = coworkers[i];
      const role = findRoleByRoleName(coworker.roleName);
      if (!role) return new HttpResponse(null, { status: 500 });

      const { roleId } = role;
      createProjectUser({ userId: coworker.userId, projectId, roleId });
    }

    return new HttpResponse(null, { status: 200 });
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
      if (!user || !role) return new HttpResponse(null, { status: 404 });

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

  // 프로젝트 수정 API
  http.patch(`${BASE_URL}/team/:teamId/project/:projectId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const projectId = Number(params.projectId);
    const teamId = Number(params.teamId);
    const updatedProjectInfo = (await request.json()) as ProjectForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 유저의 팀 및 프로젝트 접근 권한 확인
    const projectUser = findProjectUser(projectId, userId);
    if (!projectUser) return new HttpResponse(null, { status: 403 });

    // 유저의 역할 권한 확인 (프로젝트 수정 권한 확인)
    const userRole = findRole(projectUser.roleId);
    if (!userRole || (userRole.roleName !== 'ADMIN' && userRole.roleName !== 'LEADER')) {
      return new HttpResponse('프로젝트 수정 권한이 없습니다.', { status: 403 });
    }

    // 프로젝트 정보 취득
    const project = findProject(projectId);
    if (!project) return new HttpResponse(null, { status: 404 });

    // 프로젝트 수정
    project.projectName = updatedProjectInfo.projectName;
    project.content = updatedProjectInfo.content;
    project.startDate = new Date(updatedProjectInfo.startDate);
    project.endDate = updatedProjectInfo.endDate ? new Date(updatedProjectInfo.endDate) : null;

    return new HttpResponse(null, { status: 200 });
  }),
];

export default projectServiceHandler;
