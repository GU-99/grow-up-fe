import { http, HttpResponse } from 'msw';
import { TEAM_DUMMY } from '@mocks/mockData';
import { createTeamUserFormat } from '@mocks/mockUtils';
import { convertTokenToUserId } from '@utils/converter';
import {
  createTeam,
  createTeamUser,
  deleteAllProjectStatus,
  deleteAllProjectUser,
  deleteAllProjectUserByTeamId,
  deleteAllTask,
  deleteAllTaskFile,
  deleteAllTaskFileInMemory,
  deleteAllTaskUser,
  deleteAllTeamUser,
  deleteProject,
  deleteTeam,
  deleteTeamUser,
  findAllProject,
  findAllProjectStatus,
  findAllTask,
  findAllTeamUsers,
  findRole,
  findRoleByRoleName,
  findTeamUser,
  findUser,
  updateTeam,
  updateTeamUser,
} from '@mocks/mockAPI';

import type { SearchUser } from '@/types/UserType';
import type { Team, TeamCoworkerForm, TeamForm } from '@/types/TeamType';

const API_URL = import.meta.env.VITE_API_URL;
let autoIncrementIdForTeam = TEAM_DUMMY.length + 1;

const teamServiceHandler = [
  // 팀 소속 유저 검색 API
  http.get(`${API_URL}/team/:teamId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname') || '';
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

    // 팀에 참여하고 있는 모든 유저 검색
    const teamUsers = findAllTeamUsers(teamId).filter((teamUser) => teamUser.isPendingApproval === false);
    const searchUsers: SearchUser[] = [];

    // 팀 유저 정보 취득
    for (let i = 0; i < teamUsers.length; i++) {
      const user = findUser(teamUsers[i].userId);
      if (!user) return new HttpResponse(null, { status: 404 });
      searchUsers.push({ userId: user.userId, nickname: user.nickname });
    }

    // 접두사(nickname)과 일치하는 유저 정보 최대 5명 추출
    const matchedSearchUsers = searchUsers
      .filter((user) => user.nickname.startsWith(nickname) && user.userId !== userId)
      .slice(0, 5);

    return HttpResponse.json(matchedSearchUsers);
  }),

  // 팀 생성 API
  http.post(`${API_URL}/team`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamName, content, coworkers } = (await request.json()) as TeamForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 생성
    const newTeamId = autoIncrementIdForTeam++;
    const newTeam: Team = {
      teamId: newTeamId,
      creatorId: userId,
      teamName,
      content,
    };
    createTeam(newTeam);

    // 팀 유저 연결 생성 (팀 생성자, 팀원)
    const teamUsers = [];
    try {
      const headCoworker: TeamCoworkerForm = { userId, roleName: 'HEAD' };
      const headTeamUser = createTeamUserFormat(headCoworker, newTeamId, false);
      teamUsers.push(headTeamUser);

      for (let i = 0; i < coworkers.length; i++) {
        const coworker = coworkers[i];
        const coworkerTeamUser = createTeamUserFormat(coworker, newTeamId, true);
        teamUsers.push(coworkerTeamUser);
      }
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 404 });
    }
    teamUsers.forEach((teamUser) => createTeamUser(teamUser));

    return new HttpResponse(null, {
      status: 201,
      headers: {
        Location: `/api/v1/team/${newTeamId}`,
      },
    });
  }),

  // 팀 탈퇴 API
  http.post(`${API_URL}/team/:teamId/leave`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀내 소속된 모든 프로젝트에서 삭제
    deleteAllProjectUserByTeamId(teamId, userId);

    // 팀에서 삭제
    deleteTeamUser(teamId, userId);

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀 삭제 API
  http.delete(`${API_URL}/team/:teamId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 소속 확인
    const teamUser = findTeamUser(teamId, userId);
    if (!teamUser) return new HttpResponse(null, { status: 403 });

    // 팀 내 권한 확인
    const role = findRole(teamUser.roleId);
    if (!role) return new HttpResponse(null, { status: 500 });
    if (role.roleName !== 'HEAD') return new HttpResponse(null, { status: 403 });

    // 팀에 속한 모든 프로젝트 ID 정보 취득
    const projectIdsToDelete = findAllProject(teamId).map((project) => project.projectId);

    // 프로젝트에 속한 모든 프로젝트 상태 ID 정보 취득
    const statusIdsToDelete = projectIdsToDelete
      .map((projectId) => findAllProjectStatus(projectId).map((status) => status.statusId))
      .flat();

    // 프로젝트에 속한 모든 일정 ID 정보 취득
    const taskIdsToDelete = statusIdsToDelete
      .map((statusId) => findAllTask(statusId).map((task) => task.taskId))
      .flat();

    // 팀 삭제(순서 중요)
    try {
      taskIdsToDelete.forEach((taskId) => {
        deleteAllTaskFileInMemory(taskId);
        deleteAllTaskFile(taskId);
        deleteAllTaskUser(taskId);
      });

      projectIdsToDelete.forEach((projectId) => {
        deleteAllTask(projectId);
        deleteAllProjectStatus(projectId);
        deleteAllProjectUser(projectId);
        deleteProject(projectId);
      });

      deleteAllTeamUser(teamId);
      deleteTeam(teamId);
    } catch (error) {
      console.error((error as Error).message);
      return new HttpResponse(null, { status: 500 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀 초대 수락 API
  http.post(`${API_URL}/team/:teamId/invitation/accept`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 아이디 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 초대 수락
    const teamUser = findTeamUser(teamId, userId);
    if (!teamUser) {
      return HttpResponse.json({ message: '요청 유저에 대한 초대 내역을 찾을 수 없습니다.' }, { status: 500 });
    }
    teamUser.isPendingApproval = false;

    return new HttpResponse(null, { status: 200 });
  }),

  // 팀 초대 거절 API
  http.post(`${API_URL}/team/:teamId/invitation/decline`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 초대 거절
    try {
      deleteTeamUser(teamId, userId);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 404 });
    }

    return new HttpResponse(null, { status: 200 });
  }),

  // 팀원 목록 조회 API
  // ToDo: 응답에 isPendingApproval 추가하기
  http.get(`${API_URL}/team/:teamId/user`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 모든 팀원 조회
    const teamUsers = findAllTeamUsers(teamId);

    // 팀원 정보 조회
    const memberInfo = teamUsers.map((teamUser) => {
      const user = findUser(teamUser.userId);
      const role = findRole(teamUser.roleId);

      return {
        userId: user?.userId,
        nickname: user?.nickname,
        roleName: role?.roleName,
      };
    });

    return HttpResponse.json(memberInfo);
  }),

  // 팀 정보 수정 API
  http.patch(`${API_URL}/team/:teamId`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);
    const updatedTeamInfo = (await request.json()) as TeamForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 정보 수정
    try {
      updateTeam(teamId, updatedTeamInfo);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 500 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀원 추가 API
  http.post(`${API_URL}/team/:teamId/invitation`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const teamId = Number(params.teamId);
    const { userId: coworkerId, roleName } = (await request.json()) as TeamCoworkerForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 역할 정보 조회
    const role = findRoleByRoleName(roleName);
    if (!role) return HttpResponse.json({ message: '유효하지 않은 역할입니다.' }, { status: 400 });

    // 팀 소속 여부 확인
    const existingUser = findTeamUser(teamId, Number(coworkerId));
    if (existingUser) {
      return HttpResponse.json({ message: '이미 팀에 추가된 유저입니다.' }, { status: 404 });
    }

    // 팀원 추가
    const newTeamUser = {
      teamId,
      userId: Number(coworkerId),
      roleId: role.roleId,
      isPendingApproval: true,
    };
    createTeamUser(newTeamUser);

    return HttpResponse.json(null, { status: 200 });
  }),

  // 팀원 삭제 API
  http.delete(`${API_URL}/team/:teamId/user/:userId`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const [teamId, coworkerId] = [params.teamId, params.userId].map(Number);

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 소속 확인
    const teamUser = findTeamUser(teamId, userId);
    if (!teamUser) return new HttpResponse(null, { status: 403 });

    // 팀 내 권한 확인
    const role = findRole(teamUser.roleId);
    if (!role) return new HttpResponse(null, { status: 500 });
    if (role.roleName !== 'HEAD') return new HttpResponse(null, { status: 403 });

    // 팀원이 소속한 프로젝트 삭제
    deleteAllProjectUserByTeamId(teamId, coworkerId);

    // 팀원 삭제
    deleteTeamUser(teamId, coworkerId);

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀원 권한 변경 API
  http.patch(`${API_URL}/team/:teamId/user/:userId/role`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const [teamId, coworkerId] = [params.teamId, params.userId].map(Number);
    const { roleName } = (await request.json()) as TeamCoworkerForm;

    // 유저 인증 확인
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    // 팀 소속 확인
    const teamUser = findTeamUser(teamId, userId);
    if (!teamUser) return new HttpResponse(null, { status: 403 });

    // 팀내 권한 확인
    const role = findRole(teamUser.roleId);
    if (!role) return new HttpResponse(null, { status: 500 });
    if (role.roleName !== 'HEAD') return new HttpResponse(null, { status: 403 });

    // 요청 권한 확인
    const coworkerRole = findRoleByRoleName(roleName);
    if (!coworkerRole) {
      return HttpResponse.json({ message: '유효하지 않은 역할입니다.' }, { status: 400 });
    }

    // 팀원 권한 변경
    try {
      updateTeamUser(teamId, coworkerId, coworkerRole.roleId);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 500 });
    }

    return new HttpResponse(null, { status: 200 });
  }),
];

export default teamServiceHandler;
