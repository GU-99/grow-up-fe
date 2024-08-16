import { http, HttpResponse } from 'msw';
import { PROJECT_USER_DUMMY, USER_DUMMY } from '@mocks/mockData';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const handlers = [
  // 프로젝트 팀원 검색 API
  http.get(`${BASE_URL}/project/:projectId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 프로젝트에 속하는 모든 유저 ID 추출
    const userIdList = PROJECT_USER_DUMMY.filter((row) => row.projectId === Number(projectId)).map((row) => row.userId);

    // 유저 ID와 일치하는 유저 정보 추출
    const userList = USER_DUMMY.filter((row) => userIdList.includes(row.userId));

    // 접두사(nickname)과 일치하는 유저 정보 최대 5명 추출
    const prefixRegex = new RegExp(`^${nickname}`);
    const matchedUserList = userList.filter((user) => prefixRegex.test(user.nickname)).slice(0, 5);

    return HttpResponse.json(matchedUserList);
  }),
];

export const test = '';
