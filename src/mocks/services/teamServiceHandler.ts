import { http, HttpResponse } from 'msw';
import { TEAM_DUMMY, TEAM_USER_DUMMY } from '../mockData';

const BASE_URL = import.meta.env.VITE_BASE_URL;
// TODO: 실제 userId로 넣어주기
const userId = 4;

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

  // 팀 탈퇴하기
  http.post(`${BASE_URL}/team/:teamId/leave`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const filteredTeamUsers = TEAM_USER_DUMMY.filter(
      (teamUser) => !(teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId)),
    );

    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    return new HttpResponse(JSON.stringify({ message: `팀 ${teamId}에서 성공적으로 탈퇴했습니다.` }), { status: 200 });
  }),

  // 팀 삭제하기
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

    return new HttpResponse(null, { status: 204 });
  }),

  // 팀 초대 수락하기
  http.post(`${BASE_URL}/team/:teamId/invitation/accept`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 403 });

    const teamUser = TEAM_USER_DUMMY.find(
      (teamUser) => teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId),
    );

    if (teamUser) {
      teamUser.isPendingApproval = true;
    }
    return new HttpResponse(JSON.stringify({ message: `팀 ${teamId}에 성공적으로 가입했습니다.` }), { status: 200 });
  }),

  // 팀 초대 거절하기
  http.post(`${BASE_URL}/team/:teamId/invitation/decline`, ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { teamId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 403 });

    const filteredTeamUsers = TEAM_USER_DUMMY.filter(
      (teamUser) => !(teamUser.teamId === Number(teamId) && teamUser.userId === Number(userId)),
    );

    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    return new HttpResponse(JSON.stringify({ message: `팀 ${teamId} 초대를 거절했습니다.` }), { status: 200 });
  }),
];

export default teamServiceHandler;
