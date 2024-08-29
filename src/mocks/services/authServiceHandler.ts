import { http, HttpResponse } from 'msw';

const BASE_URL = import.meta.env.VITE_BASE_URL;

type Tokens = {
  accessTokenIssuedAt: number;
  refreshTokenIssuedAt: number;
};

// 토큰 만료 시간
const ACCESS_TOKEN_EXPIRATION = 15 * 60 * 1000; // 15분
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7일

// 토큰 및 발급 시간 저장
let tokens: Tokens;

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
      const currentTime = Date.now();

      // 토큰 발급 시간 저장
      tokens = {
        accessTokenIssuedAt: currentTime,
        refreshTokenIssuedAt: currentTime,
      };

      return HttpResponse.json(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Set-Cookie': `refreshToken=${refreshToken}; Max-Age=${REFRESH_TOKEN_EXPIRATION / 1000}; HttpOnly; SameSite=Strict; Secure`,
        },
      });
    }
    return new HttpResponse(JSON.stringify({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }), { status: 400 });
  }),

  // access token 갱신 API
  http.post(`${BASE_URL}/user/login/refresh`, async ({ cookies }) => {
    const { refreshToken } = cookies;

    if (refreshToken === 'mockedRefreshToken') {
      const currentTime = Date.now();

      // 리프레시 토큰 만료 체크
      const isTokenExpired = currentTime - tokens.refreshTokenIssuedAt > REFRESH_TOKEN_EXPIRATION;
      if (isTokenExpired) {
        return new HttpResponse(JSON.stringify({ message: '리프레시 토큰이 만료되었습니다.' }), { status: 401 });
      }

      // 액세스 토큰 갱신
      const newAccessToken = `${currentTime};newMockedAccessToken`;
      tokens.accessTokenIssuedAt = currentTime;

      return new HttpResponse(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          'Set-Cookie': `refreshToken=${refreshToken}; Max-Age=${REFRESH_TOKEN_EXPIRATION / 1000}; HttpOnly; SameSite=Strict; Secure`,
        },
      });
    }
    return new HttpResponse(JSON.stringify({ message: '리프레시 토큰이 유효하지 않습니다.' }), { status: 400 });
  }),
];

export default authServiceHandler;
