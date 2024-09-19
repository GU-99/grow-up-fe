import { http, HttpResponse } from 'msw';
import {
  PROJECT_DUMMY,
  PROJECT_USER_DUMMY,
  STATUS_DUMMY,
  TASK_DUMMY,
  TEAM_DUMMY,
  TEAM_USER_DUMMY,
  JWT_TOKEN_DUMMY,
  TASK_USER_DUMMY,
  TASK_FILE_DUMMY,
} from '@mocks/mockData';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const teamServiceHandler = [
  // 팀 소속 유저 검색 API
  http.get(`${BASE_URL}/team/:teamId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json([]);
  }),
  // 팀 탈퇴 API
  http.post(`${BASE_URL}/team/:teamId/leave`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;
    const [, payload] = JWT_TOKEN_DUMMY.split('.');
    // 실제 userId로 넣어주기
    const userId = Number(payload.replace('mocked-payload-', ''));
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const filteredTeamUsers = TEAM_USER_DUMMY.filter(
      (teamUser) => !(teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId)),
    );

    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    const projectIds = PROJECT_DUMMY.filter((project) => project.teamId === Number(teamId)).map(
      (project) => project.projectId,
    );

    const filteredProjectUsers = PROJECT_USER_DUMMY.filter(
      (projectUser) => !(projectIds.includes(projectUser.projectId) && projectUser.userId === Number(userId)),
    );

    PROJECT_USER_DUMMY.length = 0;
    PROJECT_USER_DUMMY.push(...filteredProjectUsers);

    const filteredTaskUsers = TASK_USER_DUMMY.filter((taskUser) => {
      const task = TASK_DUMMY.find((task) => task.taskId === taskUser.taskId);
      const statusId = task ? task.statusId : undefined;
      const projectId = statusId ? STATUS_DUMMY.find((status) => status.statusId === statusId)?.projectId : undefined;
      return !(projectId && projectIds.includes(projectId) && taskUser.userId === Number(userId));
    });
    TASK_USER_DUMMY.length = 0;
    TASK_USER_DUMMY.push(...filteredTaskUsers);

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀 삭제 API
  http.delete(`${BASE_URL}/team/:teamId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 403 });

    const filteredTeams = TEAM_DUMMY.filter((team) => team.teamId !== Number(teamId));
    TEAM_DUMMY.length = 0;
    TEAM_DUMMY.push(...filteredTeams);

    const filteredTeamUsers = TEAM_USER_DUMMY.filter((teamUser) => teamUser.teamId !== Number(teamId));
    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    const projectIdsToDelete = PROJECT_DUMMY.filter((project) => project.teamId === Number(teamId)).map(
      (project) => project.projectId,
    );

    const statusIdsToDelete = STATUS_DUMMY.filter((status) => projectIdsToDelete.includes(status.projectId)).map(
      (status) => status.statusId,
    );

    const filteredProjects = PROJECT_DUMMY.filter((project) => !projectIdsToDelete.includes(project.projectId));
    PROJECT_DUMMY.length = 0;
    PROJECT_DUMMY.push(...filteredProjects);

    const filteredStatuses = STATUS_DUMMY.filter((status) => !statusIdsToDelete.includes(status.statusId));
    STATUS_DUMMY.length = 0;
    STATUS_DUMMY.push(...filteredStatuses);

    const filteredTasks = TASK_DUMMY.filter((task) => !statusIdsToDelete.includes(task.statusId));
    TASK_DUMMY.length = 0;
    TASK_DUMMY.push(...filteredTasks);

    const filteredTaskFiles = TASK_FILE_DUMMY.filter((taskFile) => {
      const task = TASK_DUMMY.find((task) => task.taskId === taskFile.taskId);
      const statusId = task ? task.statusId : undefined;
      const projectId = statusId ? STATUS_DUMMY.find((status) => status.statusId === statusId)?.projectId : undefined;
      return !(projectId && projectIdsToDelete.includes(projectId));
    });
    TASK_FILE_DUMMY.length = 0;
    TASK_FILE_DUMMY.push(...filteredTaskFiles);

    const filteredTaskUsers = TASK_USER_DUMMY.filter((taskUser) => {
      const task = TASK_DUMMY.find((task) => task.taskId === taskUser.taskId);
      const statusId = task ? task.statusId : undefined;
      const projectId = statusId ? STATUS_DUMMY.find((status) => status.statusId === statusId)?.projectId : undefined;
      return !(projectId && projectIdsToDelete.includes(projectId));
    });
    TASK_USER_DUMMY.length = 0;
    TASK_USER_DUMMY.push(...filteredTaskUsers);

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀 초대 수락 API
  http.post(`${BASE_URL}/team/:teamId/invitation/accept`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;
    // TODO: 실제 userId로 넣어주기
    const [, payload] = JWT_TOKEN_DUMMY.split('.');
    const userId = Number(payload.replace('mocked-payload-', ''));

    if (!accessToken) return new HttpResponse(null, { status: 403 });

    const teamUser = TEAM_USER_DUMMY.find(
      (teamUser) => teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId),
    );

    if (teamUser) {
      teamUser.isPendingApproval = true;
    }
    return new HttpResponse(null, { status: 200 });
  }),

  // 팀 초대 거절 API
  http.post(`${BASE_URL}/team/:teamId/invitation/decline`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;
    // TODO: 실제 userId로 넣어주기
    const [, payload] = JWT_TOKEN_DUMMY.split('.');
    const userId = Number(payload.replace('mocked-payload-', ''));

    if (!accessToken) return new HttpResponse(null, { status: 403 });

    const filteredTeamUsers = TEAM_USER_DUMMY.filter(
      (teamUser) => !(teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId)),
    );

    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    return new HttpResponse(null, { status: 200 });
  }),
];

export default teamServiceHandler;
