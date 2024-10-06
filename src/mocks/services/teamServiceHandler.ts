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
  ROLE_DUMMY,
  USER_DUMMY,
} from '@mocks/mockData';
import { TeamForm } from '@/types/TeamType';
import { UserRole } from '@/types/UserType';

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
  // 팀 생성 API
  http.post(`${BASE_URL}/team`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamName, content, coworkers } = (await request.json()) as TeamForm;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const [, payload] = JWT_TOKEN_DUMMY.split('.');
    const creatorId = Number(payload.replace('mocked-payload-', ''));

    // 팀 ID 생성 및 팀 추가
    const newTeamId = TEAM_DUMMY.length + 1;
    TEAM_DUMMY.push({
      teamId: newTeamId,
      creatorId,
      teamName,
      content,
    });

    // 초대된 팀원들 추가
    const validTeamUsers = [];
    for (let i = 0; i < coworkers.length; i++) {
      const coworker = coworkers[i];
      const role = ROLE_DUMMY.find((role) => role.roleName === coworker.roleName);

      if (!role) return HttpResponse.json({ message: '유효하지 않은 역할입니다.' }, { status: 400 });

      validTeamUsers.push({
        teamId: newTeamId,
        userId: coworker.userId,
        roleId: role.roleId,
        isPendingApproval: false,
      });
    }
    TEAM_USER_DUMMY.push(...validTeamUsers);

    // 팀 생성자도 자동으로 팀에 추가
    const creatorRole = ROLE_DUMMY.find((role) => role.roleName === 'HEAD');

    if (!creatorRole) return HttpResponse.json({ message: '유효하지 않은 역할입니다.' }, { status: 404 });

    TEAM_USER_DUMMY.push({
      teamId: newTeamId,
      userId: creatorId,
      roleId: creatorRole.roleId,
      isPendingApproval: true,
    });

    return new HttpResponse(null, {
      status: 201,
      headers: {
        Location: `/api/v1/team/${newTeamId}`,
      },
    });
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

    // TODO: 리팩토링 필요
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

  // 팀원 목록 조회 API
  http.get(`${BASE_URL}/team/:teamId/user`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) {
      return new HttpResponse(null, { status: 401 });
    }

    const teamMembers = TEAM_USER_DUMMY.filter((teamUser) => teamUser.teamId === Number(teamId));

    const membersData = teamMembers.map((member) => {
      const role = ROLE_DUMMY.find((role) => role.roleId === member.roleId);
      const user = USER_DUMMY.find((user) => user.userId === member.userId);

      return {
        userId: user?.userId,
        nickname: user?.nickname,
        roleName: role?.roleName,
      };
    });

    return HttpResponse.json(membersData);
  }),

  // 팀 정보 수정 API
  http.patch(`${BASE_URL}/team/:teamId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;
    const { teamName, content } = (await request.json()) as TeamForm;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const teamIndex = TEAM_DUMMY.findIndex((team) => team.teamId === Number(teamId));

    if (teamIndex === -1) {
      return HttpResponse.json({ message: '팀을 찾을 수 없습니다.' }, { status: 404 });
    }

    TEAM_DUMMY[teamIndex].teamName = teamName;
    TEAM_DUMMY[teamIndex].content = content;

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀원 추가 API
  http.post(`${BASE_URL}/team/:teamId/invitation`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;
    const { userId, roleName } = (await request.json()) as UserRole;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const role = ROLE_DUMMY.find((role) => role.roleName === roleName);
    if (!role) return HttpResponse.json({ message: '유효하지 않은 역할입니다.' }, { status: 400 });

    const existingUser = TEAM_USER_DUMMY.find(
      (user) => user.teamId === Number(teamId) && user.userId === Number(userId),
    );

    if (existingUser) {
      return HttpResponse.json({ message: '이미 팀에 추가된 유저입니다.' }, { status: 404 });
    }

    const newUser = {
      teamId: Number(teamId),
      userId: Number(userId),
      roleId: role.roleId,
      isPendingApproval: true,
    };

    TEAM_USER_DUMMY.push(newUser);

    return HttpResponse.json({ message: '팀원 추가 성공', user: newUser }, { status: 200 });
  }),

  // 팀원 삭제 API
  http.delete(`${BASE_URL}/team/:teamId/user/:userId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId, userId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const filteredTeamUsers = TEAM_USER_DUMMY.filter(
      (teamUser) => !(teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId)),
    );

    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀원 권한 변경 API
  http.patch(`${BASE_URL}/team/:teamId/user/:userId/role`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId, userId } = params;
    const { roleName } = (await request.json()) as UserRole;

    if (!accessToken) {
      return new HttpResponse(null, { status: 401 });
    }
    // 2. 유효한 역할인지 확인
    const role = ROLE_DUMMY.find((role) => role.roleName === roleName);
    if (!role) {
      return HttpResponse.json({ message: '유효하지 않은 역할입니다.' }, { status: 400 });
    }

    const teamUserIndex = TEAM_USER_DUMMY.findIndex(
      (teamUser) => teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId),
    );

    if (teamUserIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    TEAM_USER_DUMMY[teamUserIndex].roleId = role.roleId;

    return new HttpResponse(null, { status: 200 });
  }),
];

export default teamServiceHandler;
