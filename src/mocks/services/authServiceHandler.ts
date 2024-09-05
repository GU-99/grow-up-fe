import { http, HttpResponse } from 'msw';
import { AUTH_SETTINGS } from '@constants/settings';
import { UserSignInForm } from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// TODO: 타입 분리하기
type Tokens = {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
};

// TODO: 토큰 관리 변수 분리
let tokens: Tokens | null = null;

const accessTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.ACCESS_TOKEN_EXPIRATION).toISOString();
const refreshTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION).toISOString();

const authServiceHandler = [
  // 로그인 API
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as UserSignInForm;

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
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; SameSite=Strict; Secure; Path=/; Expires=${refreshTokenExpiryDate}; Max-Age=${AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION / 1000}`,
        },
      });
    }
    return HttpResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
  }),

  // TODO: 액세스 토큰 발급 방식이 확정지어지면 수정하기
  // 액세스 토큰 갱신 API
  http.post(`${BASE_URL}/user/login/refresh`, async ({ cookies }) => {
    const { refreshToken } = cookies;

    // TODO: 토큰 관리 변수 분리
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
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; SameSite=Strict; Secure; Path=/; Expires=${refreshTokenExpiryDate}; Max-Age=${AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION / 1000}`,
        },
      });
    }
    return HttpResponse.json({ message: '리프레시 토큰이 유효하지 않습니다.' }, { status: 401 });
  }),
];

export default authServiceHandler;
