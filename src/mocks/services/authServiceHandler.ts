import { http, HttpResponse } from 'msw';
import { AUTH_SETTINGS } from '@/constants/settings';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// TODO: 타입 분리하기
type Tokens = {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
};

type LoginRequestBody = {
  username: string;
  password: string;
};

let tokens: Tokens | null = null;

const authServiceHandler = [
  // 로그인 API
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as LoginRequestBody;

    if (username === 'test' && password === 'test@123') {
      const accessToken = 'mockedAccessToken';
      const refreshToken = 'mockedRefreshToken';
      const currentTime = Date.now();

      // 토큰 및 발급 시간 저장
      tokens = {
        accessToken,
        accessTokenExpiresAt: currentTime + AUTH_SETTINGS.ACCESS_TOKEN_EXPIRATION,
        refreshToken,
        refreshTokenExpiresAt: currentTime + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION,
      };

      return new HttpResponse(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; SameSite=Strict; Secure; Path=/`,
        },
      });
    }
    return HttpResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 400 });
  }),

  // 액세스 토큰 갱신 API
  http.post(`${BASE_URL}/user/login/refresh`, async ({ cookies }) => {
    const { refreshToken } = cookies;

    if (tokens === null) {
      return HttpResponse.json({ message: '로그인 세션이 존재하지 않습니다.' }, { status: 401 });
    }

    // 리프레시 토큰 검증
    if (refreshToken === tokens.refreshToken) {
      const currentTime = Date.now();

      // 리프레시 토큰 만료 체크
      if (currentTime >= tokens.refreshTokenExpiresAt) {
        tokens = null;
        return HttpResponse.json({ message: '리프레시 토큰이 만료되었습니다.' }, { status: 401 });
      }

      // 액세스 토큰 갱신
      const newAccessToken = 'newMockedAccessToken';
      tokens.accessToken = newAccessToken;
      tokens.accessTokenExpiresAt = currentTime + AUTH_SETTINGS.ACCESS_TOKEN_EXPIRATION;

      return new HttpResponse(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
          'Set-Cookie': `refreshToken=${tokens.refreshToken}; HttpOnly; SameSite=Strict; Secure; Path=/`,
        },
      });
    }
    return HttpResponse.json({ message: '리프레시 토큰이 유효하지 않습니다.' }, { status: 401 });
  }),
];

export default authServiceHandler;
