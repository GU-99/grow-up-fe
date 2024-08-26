import { http, HttpResponse } from 'msw';

const BASE_URL = import.meta.env.VITE_BASE_URL;

type LoginRequestBody = {
  username: string;
  password: string;
};
const authServiceHandler = [
  // 로그인 API
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as LoginRequestBody;

    if (username === 'test' && password === 'test@123') {
      const accessToken = 'mockedAccessToken';
      const refreshToken = 'mockedRefreshToken';

      return HttpResponse.json(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Set-Cookie': `refreshToken=${refreshToken}`,
        },
      });
    }
    return new HttpResponse(JSON.stringify({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }), { status: 400 });
  }),
  // refresh token 갱신 API
  http.post(`${BASE_URL}/user/login/refresh`, async ({ cookies }) => {
    const { refreshToken } = cookies;

    if (refreshToken === 'mockedRefreshToken') {
      const newAccessToken = 'newMockedAccessToken';

      return new HttpResponse(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          'Set-Cookie': `refreshToken=${refreshToken}`,
        },
      });
    }
    return new HttpResponse(JSON.stringify({ message: '리프레시 토큰이 유효하지 않습니다.' }), { status: 400 });
  }),
];

export default authServiceHandler;
