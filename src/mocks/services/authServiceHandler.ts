import Cookies from 'js-cookie';
import { http, HttpResponse } from 'msw';
import { AUTH_SETTINGS } from '@constants/settings';
import { JWT_TOKEN_DUMMY, TEMP_PASSWORD_DUMMY, USER_DUMMY, VERIFICATION_CODE_DUMMY } from '@mocks/mockData';
import { EMAIL_REGEX } from '@constants/regex';
import { convertTokenToUserId, generateDummyToken } from '@utils/converter';
import axios from 'axios';
import {
  CheckNicknameForm,
  EmailVerificationForm,
  RequestEmailCode,
  SearchPasswordForm,
  UpdatePasswordRequest,
  UserInfo,
  UserSignInForm,
  UserSignUpRequest,
} from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const authServiceHandler = [
  // 회원가입 API
  http.post(`${BASE_URL}/user`, async ({ request }) => {
    const { verificationCode, email, ...restSignUpData } = (await request.json()) as UserSignUpRequest;

    if (verificationCode !== VERIFICATION_CODE_DUMMY) {
      return HttpResponse.json(
        { message: '이메일 인증 번호가 일치하지 않습니다. 다시 확인해 주세요.' },
        { status: 400 },
      );
    }

    const existingUser = USER_DUMMY.find((user) => user.email === email);
    if (existingUser)
      return HttpResponse.json(
        { message: '해당 이메일을 사용할 수 없습니다. 다른 이메일을 등록해 주세요.' },
        { status: 400 },
      );

    const newUser: UserInfo = {
      userId: USER_DUMMY.length + 1,
      provider: 'LOCAL',
      email,
      profileImageName: null,
      ...restSignUpData,
    };
    USER_DUMMY.push(newUser);

    return HttpResponse.json(null, { status: 200 });
  }),

  // 닉네임 중복 확인 API
  http.post(`${BASE_URL}/user/nickname`, async ({ request }) => {
    const { nickname } = (await request.json()) as CheckNicknameForm;

    const nicknameExists = USER_DUMMY.some((user) => user.nickname === nickname);
    if (nicknameExists) return HttpResponse.json({ message: '사용할 수 없는 닉네임입니다.' }, { status: 400 });

    return HttpResponse.json(null, { status: 200 });
  }),

  // 로그인 API
  http.post(`${BASE_URL}/user/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as UserSignInForm;

    const foundUser = USER_DUMMY.find((user) => user.username === username && user.password === password);
    if (!foundUser) return HttpResponse.json({ message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });

    const accessToken = generateDummyToken(foundUser.userId);
    const refreshToken = generateDummyToken(foundUser.userId);
    const refreshTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION).toISOString();

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
  }),

  // 소셜 로그인 API
  http.post(`${BASE_URL}/user/login/kakao`, async ({ request }) => {
    const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
    const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

    const { code: AUTHORIZE_CODE } = (await request.json()) as { code: string };
    let kakaoAccessToken;

    // 인가코드로 액세스 토큰 발급
    try {
      const response = await axios.post(
        `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${AUTHORIZE_CODE}`,
        null,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );

      kakaoAccessToken = response.data.access_token;
      if (!kakaoAccessToken) {
        console.error('토큰 조회 중 오류가 발생했습니다.');
        return new HttpResponse(null, { status: 400 });
      }
    } catch (error) {
      console.error('로그인 도중 오류가 발생했습니다.', error);
      return new HttpResponse(null, { status: 500 });
    }

    // 액세스 토큰을 이용해 유저 정보 요청
    let userResponse;
    try {
      userResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
          Authorization: `Bearer ${kakaoAccessToken}`,
        },
      });
    } catch (error) {
      console.error('유저 정보를 가져오는 도중 오류가 발생했습니다.', error);
      return new HttpResponse(null, { status: 500 });
    }

    // 유저 정보를 기반으로 사용자 회원가입 또는 찾기
    const foundUser = USER_DUMMY.find((user) => user.email === userResponse.data.kakao_account.email);
    let userId;

    if (!foundUser) {
      const newUser: UserInfo = {
        userId: USER_DUMMY.length + 1,
        username: userResponse.data.kakao_account.email,
        password: '',
        email: userResponse.data.kakao_account.email,
        provider: 'KAKAO',
        nickname: userResponse.data.id,
        profileImageName: null,
        bio: null,
        links: [],
      };

      USER_DUMMY.push(newUser);
      userId = newUser.userId;
    } else {
      userId = foundUser.userId;
    }

    const accessToken = generateDummyToken(userId);
    const refreshToken = generateDummyToken(userId);
    const refreshTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION).toISOString();

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
  }),

  // 액세스 토큰 갱신 API
  http.post(`${BASE_URL}/user/refresh`, async ({ cookies, request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return new HttpResponse(null, { status: 401 });

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

      let newAccessToken;

      // ToDo: 추후 삭제
      if (accessToken === JWT_TOKEN_DUMMY) {
        newAccessToken = 'newMockedAccessToken';
      } else {
        // 토큰에서 userId 추출하도록 수정
        const userId = convertTokenToUserId(accessToken);
        if (!userId) return new HttpResponse(null, { status: 401 });

        newAccessToken = generateDummyToken(userId);
      }

      // 액세스 토큰 갱신
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

    let userId;
    // ToDo: 추후 삭제
    if (accessToken === JWT_TOKEN_DUMMY) {
      const payload = JWT_TOKEN_DUMMY.split('.')[1];
      userId = Number(payload.replace('mocked-payload-', ''));
    } else {
      // 토큰에서 userId 추출
      userId = convertTokenToUserId(accessToken);
      if (!userId) return new HttpResponse(null, { status: 401 });
    }

    const foundUser = USER_DUMMY.find((user) => user.userId === userId);
    if (!foundUser) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(foundUser, { status: 200 });
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

    if (!email || !EMAIL_REGEX.test(email))
      return HttpResponse.json({ message: '이메일을 다시 확인해 주세요.' }, { status: 400 });

    return HttpResponse.json(null, { status: 200 });
  }),

  // ToDo: API 확정 후 수정
  // 이메일 인증 번호 확인 API
  http.post(`${BASE_URL}/user/verify/code`, async ({ request }) => {
    const { email, verificationCode } = (await request.json()) as EmailVerificationForm;

    const verifyUserEmailAndCode = (userEmail: string, code: string) => {
      return USER_DUMMY.some((user) => user.email === userEmail) && code === VERIFICATION_CODE_DUMMY;
    };

    if (!verifyUserEmailAndCode(email, verificationCode)) {
      return HttpResponse.json({ message: '인증번호가 일치하지 않습니다.' }, { status: 401 });
    }

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

    const existingUser = USER_DUMMY.find((user) => user.email === email);
    if (!existingUser) return HttpResponse.json({ message: '이메일을 다시 확인해 주세요.' }, { status: 400 });

    return HttpResponse.json({ username: existingUser.username }, { status: 200 });
  }),

  // 비밀번호 찾기 API
  http.post(`${BASE_URL}/user/recover/password`, async ({ request }) => {
    const { username, email, verificationCode } = (await request.json()) as SearchPasswordForm;

    if (verificationCode !== VERIFICATION_CODE_DUMMY) {
      return HttpResponse.json(
        { message: '이메일 인증 번호가 일치하지 않습니다. 다시 확인해 주세요.' },
        { status: 401 },
      );
    }

    const existingUser = USER_DUMMY.find((user) => user.username === username && user.email === email);
    if (!existingUser) return HttpResponse.json({ message: '이메일과 아이디를 다시 확인해 주세요.' }, { status: 400 });

    existingUser.password = TEMP_PASSWORD_DUMMY;
    return HttpResponse.json({ password: TEMP_PASSWORD_DUMMY }, { status: 200 });
  }),

  // 비밀번호 변경 API
  http.patch(`${BASE_URL}/user/password`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return HttpResponse.json({ message: '인증 정보가 존재하지 않습니다.' }, { status: 401 });

    let userId;
    // ToDo: 추후 삭제
    if (accessToken === JWT_TOKEN_DUMMY) {
      const payload = JWT_TOKEN_DUMMY.split('.')[1];
      userId = Number(payload.replace('mocked-payload-', ''));
    } else {
      // 토큰에서 userId 추출
      userId = convertTokenToUserId(accessToken);
      if (!userId) return new HttpResponse(null, { status: 401 });
    }

    const existingUser = USER_DUMMY.find((user) => user.userId === Number(userId));
    if (!existingUser) return HttpResponse.json({ message: '해당 사용자를 찾을 수 없습니다.' }, { status: 404 });

    // 비밀번호 변경
    const { password, newPassword } = (await request.json()) as UpdatePasswordRequest;
    if (password !== existingUser.password)
      return HttpResponse.json({ message: '비밀번호를 다시 확인해주세요.' }, { status: 400 });

    existingUser.password = newPassword;
    return HttpResponse.json(null, { status: 200 });
  }),
];

export default authServiceHandler;
