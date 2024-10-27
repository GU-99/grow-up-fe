import axios from 'axios';
import Cookies from 'js-cookie';
import { http, HttpResponse } from 'msw';
import { AUTH_SETTINGS } from '@constants/settings';
import { TEMP_PASSWORD_DUMMY, USER_DUMMY, VERIFICATION_CODE_DUMMY } from '@mocks/mockData';
import { EMAIL_REGEX } from '@constants/regex';
import { convertTokenToUserId, generateDummyToken } from '@utils/converter';
import {
  CheckNicknameForm,
  EmailVerificationForm,
  RequestEmailCode,
  SearchPasswordForm,
  SocialLoginProvider,
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
  http.post(`${BASE_URL}/user/login/:provider`, async ({ request, params }) => {
    const { provider } = params as { provider: SocialLoginProvider };
    const { code } = (await request.json()) as { code: string };

    const validProviders = ['KAKAO', 'GOOGLE'];
    if (!validProviders.includes(provider)) {
      return HttpResponse.json({ message: '지원하지 않는 Provider입니다.' }, { status: 400 });
    }

    // 공급업체별 설정 정보
    const providerConfigs = {
      KAKAO: {
        tokenUrl: `https://kauth.kakao.com/oauth/token`,
        userInfoUrl: 'https://kapi.kakao.com/v2/user/me',
        accessTokenParams: {
          grant_type: 'authorization_code',
          client_id: import.meta.env.VITE_KAKAO_CLIENT_ID,
          redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
          code,
        },
        accessTokenKey: 'access_token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      },
      GOOGLE: {
        tokenUrl: `https://oauth2.googleapis.com/token`,
        userInfoUrl: 'https://www.googleapis.com/userinfo/v2/me',
        accessTokenParams: {
          code,
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          client_secret: import.meta.env.VITE_GOOGLE_SECRET,
          redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
        accessTokenKey: 'access_token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      },
    };

    const config = providerConfigs[provider];
    if (!config) {
      return HttpResponse.json({ message: 'Provider 정보 설정에 실패했습니다.' }, { status: 400 });
    }

    // 인가코드를 이용한 액세스 토큰 발급 함수
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(config.tokenUrl, null, {
          params: config.accessTokenParams,
          headers: config.headers,
        });
        return response.data[config.accessTokenKey];
      } catch (error) {
        return null;
      }
    };

    // 액세스 토큰을 이용한 유저 정보 요청 함수
    const fetchUserInfo = async (accessToken: string) => {
      try {
        const response = await axios.get(config.userInfoUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
      } catch (error) {
        return null;
      }
    };

    // 액세스 토큰 발급
    const accessToken = await fetchAccessToken();
    if (!accessToken) {
      return HttpResponse.json({ message: '토큰 조회 중 오류가 발생했습니다.' }, { status: 400 });
    }

    // 유저 정보 요청
    const userInfo = await fetchUserInfo(accessToken);
    if (!userInfo) {
      return HttpResponse.json({ message: '유저 정보를 가져오는 도중 오류가 발생했습니다.' }, { status: 500 });
    }

    // 이메일 기반으로 사용자 검색 또는 회원가입
    const email = provider === 'KAKAO' ? userInfo.kakao_account.email : userInfo.email;
    if (!email) return HttpResponse.json({ message: '이메일 정보를 가져올 수 없습니다.' }, { status: 400 });

    const foundUser = USER_DUMMY.find((user) => user.email === email);

    let userId;

    if (foundUser) {
      userId = foundUser.userId;
    } else {
      const newUser: UserInfo = {
        userId: USER_DUMMY.length + 1,
        username: email,
        password: null,
        email,
        provider,
        nickname: userInfo.id,
        profileImageName: null,
        bio: null,
        links: [],
      };

      USER_DUMMY.push(newUser);
      userId = newUser.userId;
    }

    const accessTokenResponse = generateDummyToken(userId);
    const refreshToken = generateDummyToken(userId);
    const refreshTokenExpiryDate = new Date(Date.now() + AUTH_SETTINGS.REFRESH_TOKEN_EXPIRATION).toISOString();

    return new HttpResponse(null, {
      status: 200,
      headers: {
        Authorization: `Bearer ${accessTokenResponse}`,
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

      const userId = convertTokenToUserId(accessToken);
      if (!userId) return new HttpResponse(null, { status: 401 });

      const newAccessToken = generateDummyToken(userId);

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

    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

    const foundUser = USER_DUMMY.find((user) => user.userId === userId);
    if (!foundUser) return new HttpResponse(null, { status: 404 });

    return HttpResponse.json(foundUser, { status: 200 });
  }),

  // 로그아웃 API
  http.post(`${BASE_URL}/user/logout`, async ({ cookies }) => {
    const { refreshToken } = cookies;
    const currentTime = Date.now();

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

    const userId = convertTokenToUserId(accessToken);
    if (!userId) return new HttpResponse(null, { status: 401 });

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
