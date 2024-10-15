import { http, HttpResponse } from 'msw';
import {
  PROJECT_DUMMY,
  PROJECT_USER_DUMMY,
  STATUS_DUMMY,
  TASK_DUMMY,
  TASK_FILE_DUMMY,
  TASK_USER_DUMMY,
} from '@mocks/mockData';
import { getRoleHash, getUserHash } from '@mocks/mockHash';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const projectServiceHandler = [
  // 프로젝트 소속 유저 검색 API
  http.get(`${BASE_URL}/project/:projectId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 프로젝트에 속하는 모든 유저 검색
    const projectUserList = PROJECT_USER_DUMMY.filter((row) => row.projectId === Number(projectId));
    const userHash = getUserHash();

    const userList = projectUserList.map((relation) => {
      const { userId, nickname } = userHash[relation.userId];
      return { userId, nickname };
    });

    // 접두사(nickname)과 일치하는 유저 정보 최대 5명 추출
    const prefixRegex = new RegExp(`^${nickname}`);
    const matchedUserList = userList.filter((user) => prefixRegex.test(user.nickname)).slice(0, 5);

    return HttpResponse.json(matchedUserList);
  }),

  // 프로젝트 목록 조회 API
  http.get(`${BASE_URL}/team/:teamId/project`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const projectList = PROJECT_DUMMY.filter((project) => project.teamId === Number(teamId));

    return HttpResponse.json(projectList);
  }),

  // 프로젝트 팀원 목록 조회 API
  http.get(`${BASE_URL}/project/:projectId/user`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const projectUserList = PROJECT_USER_DUMMY.filter((projectUser) => projectUser.projectId === Number(projectId));

    const userHash = getUserHash();
    const roleHash = getRoleHash();
    const userRoleList = projectUserList.map((projectUser) => {
      const { userId, nickname } = userHash[projectUser.userId];
      const { roleName } = roleHash[projectUser.roleId];
      return { userId, nickname, roleName };
    });

    return HttpResponse.json(userRoleList);
  }),
  // 프로젝트 삭제 API
  http.delete(`${BASE_URL}/project/:projectId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const projectIdToDelete = Number(projectId);

    const statusIdsToDelete = STATUS_DUMMY.filter((status) => status.projectId === projectIdToDelete).map(
      (status) => status.statusId,
    );

    const filteredProjects = PROJECT_DUMMY.filter((project) => project.projectId !== projectIdToDelete);
    PROJECT_DUMMY.length = 0;
    PROJECT_DUMMY.push(...filteredProjects);

    const filteredProjectUsers = PROJECT_USER_DUMMY.filter(
      (projectUser) => projectUser.projectId !== projectIdToDelete,
    );
    PROJECT_USER_DUMMY.length = 0;
    PROJECT_USER_DUMMY.push(...filteredProjectUsers);

    const filteredStatuses = STATUS_DUMMY.filter((status) => status.projectId !== projectIdToDelete);
    STATUS_DUMMY.length = 0;
    STATUS_DUMMY.push(...filteredStatuses);

    const filteredTasks = TASK_DUMMY.filter((task) => !statusIdsToDelete.includes(task.statusId));
    TASK_DUMMY.length = 0;
    TASK_DUMMY.push(...filteredTasks);

    const filteredTaskUsers = TASK_USER_DUMMY.filter((taskUser) => {
      const taskExists = TASK_DUMMY.some((task) => task.taskId === taskUser.taskId);
      return taskExists;
    });
    TASK_USER_DUMMY.length = 0;
    TASK_USER_DUMMY.push(...filteredTaskUsers);

    const filteredTaskFiles = TASK_FILE_DUMMY.filter((taskFile) => {
      const taskExists = TASK_DUMMY.some((task) => task.taskId === taskFile.taskId);
      return taskExists;
    });
    TASK_FILE_DUMMY.length = 0;
    TASK_FILE_DUMMY.push(...filteredTaskFiles);

    return new HttpResponse(null, { status: 204 });
  }),
];

export default projectServiceHandler;
