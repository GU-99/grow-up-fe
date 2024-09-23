import { http, HttpResponse } from 'msw';
import { PROJECT_DUMMY, PROJECT_USER_DUMMY } from '@mocks/mockData';
import { getUserHash } from '@mocks/mockHash';

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
];

export default projectServiceHandler;
