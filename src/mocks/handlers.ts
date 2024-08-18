import { http, HttpResponse } from 'msw';
import { PROJECT_USER_DUMMY, ROLE_DUMMY, USER_DUMMY } from '@mocks/mockData';
import type { Role } from '@/types/RoleType';
import type { User } from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const handlers = [
  // 프로젝트 팀원 검색 API
  http.get(`${BASE_URL}/project/:projectId/user/search`, ({ request, params }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname');
    const accessToken = request.headers.get('Authorization');
    const { projectId } = params;

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    // 프로젝트에 속하는 모든 유저 검색
    const projectUserList = PROJECT_USER_DUMMY.filter((row) => row.projectId === Number(projectId));

    // 유저 정보 Hash 형태로 추출
    const USERS: { [key: string | number]: User } = {};
    USER_DUMMY.forEach((user) => (USERS[user.userId] = user));

    // 역할 정보 Hash 형태로 추출
    const ROLES: { [key: string | number]: Role } = {};
    ROLE_DUMMY.forEach((role) => (ROLES[role.roleId] = role));

    // 유저, 역할 정보 병합 추출
    const userList = projectUserList.map((relation) => ({ ...USERS[relation.userId], ...ROLES[relation.roleId] }));

    // 접두사(nickname)과 일치하는 유저 정보 최대 5명 추출
    const prefixRegex = new RegExp(`^${nickname}`);
    const matchedUserList = userList.filter((user) => prefixRegex.test(user.nickname)).slice(0, 5);

    return HttpResponse.json(matchedUserList);
  }),
];
