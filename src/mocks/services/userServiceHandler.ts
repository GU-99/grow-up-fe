import { http, HttpResponse } from 'msw';
import {
  JWT_TOKEN_DUMMY,
  PROFILE_IMAGE_DUMMY,
  ROLE_DUMMY,
  TEAM_DUMMY,
  TEAM_USER_DUMMY,
  USER_DUMMY,
} from '@mocks/mockData';
import { NICKNAME_REGEX } from '@constants/regex';
import { convertTokenToUserId } from '@utils/converter';
import { fileNameParser } from '@utils/fileNameParser';
import type { Team } from '@/types/TeamType';
import type { Role } from '@/types/RoleType';
import type { EditUserInfoForm, EditUserLinksForm, User } from '@/types/UserType';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// ToDo: Dummy 데이터 Hash화 한 곳으로 모으기
const userServiceHandler = [
  // 유저 정보 변경 API
  http.patch(`${BASE_URL}/user`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const { nickname, bio } = (await request.json()) as EditUserInfoForm;

    // 토큰에서 userId 추출
    const userId = convertTokenToUserId(accessToken);

    const userIndex = userId ? USER_DUMMY.findIndex((user) => user.userId === userId) : -1;

    if (userIndex === -1) {
      return HttpResponse.json(
        { message: '해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.' },
        { status: 401 },
      );
    }

    if (USER_DUMMY[userIndex].nickname !== nickname && !NICKNAME_REGEX.test(nickname)) {
      return HttpResponse.json({ message: '요청 필드의 입력 포맷이 잘못되었습니다.' }, { status: 400 });
    }

    USER_DUMMY[userIndex].nickname = nickname;
    USER_DUMMY[userIndex].bio = bio;

    const userInfo = {
      userId: USER_DUMMY[userIndex].userId,
      nickname: USER_DUMMY[userIndex].nickname,
      bio: USER_DUMMY[userIndex].bio,
    };

    return HttpResponse.json(userInfo, { status: 200 });
  }),
  // 링크 변경 API
  http.patch(`${BASE_URL}/user/links`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const { links } = (await request.json()) as EditUserLinksForm;

    const userId = convertTokenToUserId(accessToken);

    const userIndex = userId ? USER_DUMMY.findIndex((user) => user.userId === userId) : -1;

    if (userIndex === -1) {
      return HttpResponse.json(
        { message: '해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.' },
        { status: 401 },
      );
    }
    USER_DUMMY[userIndex].links = links;

    return HttpResponse.json(null, { status: 200 });
  }),
  // 유저 프로필 이미지 업로드 API
  http.post(`${BASE_URL}/user/profile/image`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) return new HttpResponse(null, { status: 400 });
    if (!(file instanceof File)) return new HttpResponse('업로드된 문서는 파일이 아닙니다.', { status: 400 });

    let userId;
    // ToDo: 추후 삭제
    if (accessToken === JWT_TOKEN_DUMMY) {
      const payload = JWT_TOKEN_DUMMY.split('.')[1];
      userId = Number(payload.replace('mocked-payload-', ''));
    } else {
      // 토큰에서 userId 추출
      userId = convertTokenToUserId(accessToken);
    }

    if (!userId) {
      return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });
    }

    const userIndex = USER_DUMMY.findIndex((user) => user.userId === userId);

    if (userIndex === -1) {
      return HttpResponse.json(
        { message: '해당 사용자를 찾을 수 없습니다. 입력 정보를 확인해 주세요.' },
        { status: 401 },
      );
    }

    const { fileName, extension } = fileNameParser(file.name);
    const uploadName = extension ? `${fileName}_${Date.now()}.${extension}` : `${fileName}_${Date.now()}`;

    // 유저 정보에 이미지 추가
    USER_DUMMY[userIndex].profileImageName = uploadName;

    // 프로필 이미지 더미 데이터 추가
    const profileImageIndex = PROFILE_IMAGE_DUMMY.findIndex((user) => user.userId === userId);
    if (profileImageIndex !== -1) {
      PROFILE_IMAGE_DUMMY[profileImageIndex].uploadName = uploadName;
    } else {
      PROFILE_IMAGE_DUMMY.push({
        userId,
        file: new Blob([file], { type: file.type }),
        uploadName,
      });
    }

    return HttpResponse.json({ imageName: uploadName }, { status: 200 });
  }),
  // 전체 팀 목록 조회 API (가입한 팀, 대기중인 팀)
  http.get(`${BASE_URL}/user/team`, ({ request }) => {
    const accessToken = request.headers.get('Authorization');

    if (!accessToken) return new HttpResponse(null, { status: 401 });

    const userId = convertTokenToUserId(accessToken);

    // 유저가 속한 모든 팀 목록 추출
    const teamUserList = TEAM_USER_DUMMY.filter((row) => row.userId === Number(userId));
    // 유저 정보 Hash 형태로 추출
    const USERS: { [key: string | number]: User } = {};
    USER_DUMMY.forEach((user) => (USERS[user.userId] = user));

    // 역할 정보 Hash 형태로 추출
    const ROLES: { [key: string | number]: Role } = {};
    ROLE_DUMMY.forEach((role) => (ROLES[role.roleId] = role));

    // 팀 정보 Hash 형태로 추출
    const TEAMS: { [key: string | number]: Team } = {};
    TEAM_DUMMY.forEach((team) => (TEAMS[team.teamId] = team));

    const teamJoinStatusList = teamUserList.map((teamUser) => {
      const role = ROLES[teamUser.roleId];
      const team = TEAMS[teamUser.teamId];

      const creatorUser = USERS[team.creatorId];
      const creatorNickname = creatorUser ? creatorUser.nickname : 'Unknown';

      return {
        teamId: team.teamId,
        teamName: team.teamName,
        content: team.content,
        creator: creatorNickname,
        creatorId: team.creatorId,
        isPendingApproval: teamUser.isPendingApproval,
        roleName: role.roleName,
      };
    });

    return HttpResponse.json(teamJoinStatusList);
  }),
];

export default userServiceHandler;
