import { http, HttpResponse } from 'msw';

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
];

export default teamServiceHandler;
