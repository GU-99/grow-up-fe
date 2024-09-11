import { http, HttpResponse } from 'msw';
import { TEAM_DUMMY, TEAM_USER_DUMMY } from '../mockData';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const teamServiceHandler = [
  // 팀 소속 유저 검색 API
  // ToDo: 내부 구현 사항 채울 것
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
    // TODO: 실제 userId로 넣어주기
    const userId = 4;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 팀 소속 탈퇴 유저만 삭제
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

    // 팀 삭제
    const filteredTeams = TEAM_DUMMY.filter((team) => team.teamId !== Number(teamId));
    TEAM_DUMMY.length = 0;
    TEAM_DUMMY.push(...filteredTeams);

    // 팀 소속 유저 삭제
    const filteredTeamUsers = TEAM_USER_DUMMY.filter((teamUser) => teamUser.teamId !== Number(teamId));
    TEAM_USER_DUMMY.length = 0;
    TEAM_USER_DUMMY.push(...filteredTeamUsers);

    return new HttpResponse(null, { status: 204 });
  }),
];

export default teamServiceHandler;
