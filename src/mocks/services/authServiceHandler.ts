import Cookies from 'js-cookie';
import { http, HttpResponse } from 'msw';
import { AUTH_SETTINGS } from '@constants/settings';
import { USER_INFO_DUMMY } from '@mocks/mockData';
import { EmailVerificationForm, UserSignInForm } from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const refreshTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION).toISOString();

const authServiceHandler = [
  // 로그인 API
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as UserSignInForm;

    if (username === 'test' && password === 'test@123') {
      const accessToken = 'mockedAccessToken';
      const refreshToken = 'mockedRefreshToken';

      return new HttpResponse(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Set-Cookie': [
            `refreshToken=${refreshToken}; SameSite=Strict; Secure; Path=/; Expires=${refreshTokenExpiryDate}; Max-Age=${AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION / 1000}`,
            `refreshTokenExpiresAt=${refreshTokenExpiryDate}; SameSite=Strict; Secure; Path=/; Expires=${refreshTokenExpiryDate}; Max-Age=${AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION / 1000}`,
          ].join(', '),
        },
      });
    }
    return HttpResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
  }),

  // 액세스 토큰 갱신 API
  http.post(`${BASE_URL}/user/login/refresh`, async ({ cookies }) => {
    const { refreshToken, refreshTokenExpiresAt } = cookies;

    const cookieRefreshToken = Cookies.get('refreshToken');

    if (!refreshToken || !refreshTokenExpiresAt) {
      return HttpResponse.json({ message: '로그인 세션이 존재하지 않습니다.' }, { status: 401 });
    }

    // 리프레시 토큰 검증
    if (refreshToken === cookieRefreshToken) {
      const currentTime = Date.now();

      // 리프레시 토큰 만료 체크
      if (currentTime >= new Date(refreshTokenExpiresAt).getTime()) {
        return HttpResponse.json({ message: '리프레시 토큰이 만료되었습니다.' }, { status: 401 });
      }

      // 액세스 토큰 갱신
      const newAccessToken = 'newMockedAccessToken';
      return new HttpResponse(null, {
        status: 200,
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });
    }
    return HttpResponse.json({ message: '리프레시 토큰이 유효하지 않습니다.' }, { status: 401 });
  }),

  // 로그인 한 사용자 조회 API
  http.get(`${BASE_URL}/user/me`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json(USER_INFO_DUMMY, { status: 200 });
  }),

  // 액세스 토큰 테스트용 API
  http.post(`${BASE_URL}/test`, ({ request }) => {
    console.log('테스트용 API 작동 중');

    const authHeader = request.headers.get('Authorization');

    // Authorization 헤더의 Bearer 토큰 확인
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        console.log('유효한 토큰입니다. 200 응답을 반환합니다.');
        return new HttpResponse(null, { status: 200 });
      }
    }

    console.log('유효하지 않은 토큰입니다. 401 응답을 반환합니다.');
    return new HttpResponse(null, { status: 401 });
  }),

  // 아이디 찾기 API
  http.post(`${BASE_URL}/user/recover/username`, async ({ request }) => {
    const { email, code } = (await request.json()) as EmailVerificationForm;

    // email: 'momoco@gmail.com'
    if (email === USER_INFO_DUMMY.email && code === '1234') {
      return HttpResponse.json({ username: USER_INFO_DUMMY.username }, { status: 200 });
    }

    if (code !== '1234') {
      return HttpResponse.json(
        { message: '이메일 인증 번호가 일치하지 않습니다. 다시 확인해 주세요.' },
        { status: 401 },
      );
    }

    return HttpResponse.json({ message: '이메일을 다시 한 번 확인해 주세요.' }, { status: 400 });
  }),
];

export default authServiceHandler;
