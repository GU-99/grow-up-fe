import { http, HttpResponse } from 'msw';
import { ROLE_DUMMY, TEAM_DUMMY, TEAM_USER_DUMMY, USER_DUMMY } from '@mocks/mockData';
import type { Team } from '@/types/TeamType';
import type { Role } from '@/types/RoleType';
import type { User } from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ToDo: Dummy 데이터 Hash화 한 곳으로 모으기
const userServiceHandler = [
  // 유저 검색 API
  // ToDo: 내부 구현 사항 채울 것
  http.get(`${BASE_URL}/user/search`, ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const accessToken = request.headers.get('Authorization');

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const filteredUsers = USER_DUMMY.filter((user) => user.nickname.includes(nickname || ''));

    return HttpResponse.json(filteredUsers);
  }),
  // 가입한 팀 목록 조회 API
  http.get(`${BASE_URL}/user/team`, ({ request }) => {
    const accessToken = request.headers.get('Authorization');

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const [header, payload, signature] = accessToken.split('.');
    const userId = payload.replace('mocked-payload-', '');

    // 유저가 속한 모든 팀 목록 추출
    const teamUserList = TEAM_USER_DUMMY.filter((row) => row.userId === Number(userId));
    // 유저 정보 Hash 형태로 추출
    const USERS: { [key: string | number]: User } = {};
    USER_DUMMY.forEach((user) => (USERS[user.userId] = user));

    // 역할 정보 Hash 형태로 추출
    const ROLES: { [key: string | number]: Role } = {};
    ROLE_DUMMY.forEach((role) => (ROLES[role.roleId] = role));

    // 팀 정보 Hash 형태로 추출
    const TEAMS: { [key: string | number]: Team } = {};
    TEAM_DUMMY.forEach((team) => (TEAMS[team.teamId] = team));

    const teamJoinStatusList = teamUserList.map((teamUser) => {
      const role = ROLES[teamUser.roleId];
      const team = TEAMS[teamUser.teamId];

      const creatorUser = USERS[team.creatorId];
      const creatorNickname = creatorUser ? creatorUser.nickname : 'Unknown';

      return {
        teamId: team.teamId,
        teamName: team.teamName,
        content: team.content,
        creator: creatorNickname,
        creatorId: team.creatorId,
        isPendingApproval: teamUser.isPendingApproval,
        roleName: role.roleName,
      };
    });

    return HttpResponse.json(teamJoinStatusList);
  }),
];

export default userServiceHandler;
