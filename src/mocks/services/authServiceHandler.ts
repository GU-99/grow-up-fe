import Cookies from 'js-cookie';
import { http, HttpResponse } from 'msw';
import { AUTH_SETTINGS } from '@constants/settings';
import { VERIFICATION_CODE_DUMMY, USER_INFO_DUMMY } from '@mocks/mockData';
import {
  EmailVerificationForm,
  RequestEmailCode,
  SearchPasswordForm,
  UpdatePasswordRequest,
  UserSignInForm,
} from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const refreshTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION).toISOString();

const authServiceHandler = [
  // 로그인 API
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as UserSignInForm;

    if (username === USER_INFO_DUMMY.username && password === USER_INFO_DUMMY.password) {
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
  http.post(`${BASE_URL}/user/refresh`, async ({ cookies }) => {
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

  // 로그인 한 사용자 정보 조회 API
  http.get(`${BASE_URL}/user/me`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    return HttpResponse.json(USER_INFO_DUMMY, { status: 200 });
  }),

  // 로그아웃 API
  http.post(`${BASE_URL}/user/logout`, async ({ cookies }) => {
    const { refreshToken, refreshTokenExpiresAt } = cookies;
    const currentTime = Date.now();

    if (!refreshToken || !refreshTokenExpiresAt) {
      return HttpResponse.json(
        { message: '리프레시 토큰이 유효하지 않습니다. 다시 로그인해 주세요.' },
        { status: 401 },
      );
    }

    return new HttpResponse(null, {
      status: 200,
      headers: {
        'Set-Cookie': [
          `refreshToken=${refreshToken}; SameSite=Strict; Secure; Path=/; Expires=${currentTime}; Max-Age=0`,
          `refreshTokenExpiresAt=${currentTime}; SameSite=Strict; Secure; Path=/; Expires=${currentTime}; Max-Age=0`,
        ].join(', '),
      },
    });
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

  // 이메일 인증 번호 요청 API
  http.post(`${BASE_URL}/user/verify/send`, async ({ request }) => {
    const { email } = (await request.json()) as RequestEmailCode;

    if (email !== USER_INFO_DUMMY.email)
      return HttpResponse.json({ message: '이메일을 다시 확인해 주세요.' }, { status: 400 });

    return HttpResponse.json(null, { status: 200 });
  }),

  // 이메일 인증 번호 확인 API
  http.post(`${BASE_URL}/user/verify/code`, async ({ request }) => {
    const { email, verificationCode } = (await request.json()) as EmailVerificationForm;

    if (email !== USER_INFO_DUMMY.email || verificationCode !== VERIFICATION_CODE_DUMMY)
      return HttpResponse.json({ message: '인증번호가 일치하지 않습니다.' }, { status: 401 });

    return HttpResponse.json(null, { status: 200 });
  }),

  // 아이디 찾기 API
  http.post(`${BASE_URL}/user/recover/username`, async ({ request }) => {
    const { email, verificationCode } = (await request.json()) as EmailVerificationForm;

    if (verificationCode !== VERIFICATION_CODE_DUMMY) {
      return HttpResponse.json(
        { message: '이메일 인증 번호가 일치하지 않습니다. 다시 확인해 주세요.' },
        { status: 401 },
      );
    }

    if (email !== USER_INFO_DUMMY.email)
      return HttpResponse.json({ message: '이메일을 다시 확인해 주세요.' }, { status: 400 });

    return HttpResponse.json({ username: USER_INFO_DUMMY.username }, { status: 200 });
  }),

  // 비밀번호 찾기 API
  http.post(`${BASE_URL}/user/recover/password`, async ({ request }) => {
    const { username, email, verificationCode } = (await request.json()) as SearchPasswordForm;

    const tempPassword = '!1p2l3nqlz';

    if (verificationCode !== VERIFICATION_CODE_DUMMY) {
      return HttpResponse.json(
        { message: '이메일 인증 번호가 일치하지 않습니다. 다시 확인해 주세요.' },
        { status: 401 },
      );
    }

    if (username !== USER_INFO_DUMMY.username || email !== USER_INFO_DUMMY.email) {
      return HttpResponse.json({ message: '이메일과 아이디를 다시 확인해 주세요.' }, { status: 400 });
    }

    return HttpResponse.json({ password: tempPassword }, { status: 200 });
  }),

  // 비밀번호 변경 API
  http.patch(`${BASE_URL}/user/password`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return HttpResponse.json({ message: '인증 정보가 존재하지 않습니다.' }, { status: 401 });

    const userId = accessToken.split('.')[1].replace('mocked-payload-', '');
    if (Number(userId) !== USER_INFO_DUMMY.userId)
      return HttpResponse.json({ message: '해당 사용자를 찾을 수 없습니다.' }, { status: 404 });

    const { password, newPassword } = (await request.json()) as UpdatePasswordRequest;
    if (password !== USER_INFO_DUMMY.password)
      return HttpResponse.json({ message: '비밀번호를 다시 확인해주세요.' }, { status: 400 });

    USER_INFO_DUMMY.password = newPassword;
    return HttpResponse.json(null, { status: 200 });
  }),
];

export default authServiceHandler;
