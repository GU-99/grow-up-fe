import { http, HttpResponse } from 'msw';
import { USER_DUMMY } from '@mocks/mockData';
import {
  deleteProfileFileInMemory,
  deleteUserProfile,
  downloadProfileFileInMemory,
  findAllTeamUsersByUserId,
  findRole,
  findTeam,
  findUser,
  saveUserProfileFileInMemory,
  updateUserInfo,
  updateUserLinks,
  updateUserProfile,
} from '@mocks/mockAPI';
import { NICKNAME_REGEX } from '@constants/regex';
import { convertTokenToUserId } from '@utils/converter';
import { fileNameParser } from '@utils/fileNameParser';
import type { EditUserInfoForm, EditUserLinksForm } from '@/types/UserType';

const API_URL = import.meta.env.VITE_API_URL;

const userServiceHandler = [
  // 유저 정보 변경 API
  http.patch(`${API_URL}/user`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    const updatedUserInfo = (await request.json()) as EditUserInfoForm;

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 입력 데이터 검증
    const { nickname } = updatedUserInfo;
    if (!NICKNAME_REGEX.test(nickname)) {
      return HttpResponse.json({ message: '요청 필드의 입력 포맷이 잘못되었습니다.' }, { status: 400 });
    }

    // 유저 정보 변경
    try {
      updateUserInfo(userId, updatedUserInfo);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 401 });
    }

    // 변경된 유저 정보 반환
    const user = findUser(userId);
    if (!user) return new HttpResponse(null, { status: 500 });

    const userInfo = {
      userId: user.userId,
      nickname: user.nickname,
      bio: user.bio,
    };
    return HttpResponse.json(userInfo, { status: 200 });
  }),

  // 링크 변경 API
  http.patch(`${API_URL}/user/links`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    const updatedUserLinks = (await request.json()) as EditUserLinksForm;

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 유저 링크 수정
    try {
      updateUserLinks(userId, updatedUserLinks);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 401 });
    }

    return HttpResponse.json(null, { status: 200 });
  }),

  // 유저 프로필 이미지 업로드 API
  http.post(`${API_URL}/user/profile/image`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');
    const formData = await request.formData();
    const file = formData.get('file');

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 업로드 파일 확인
    if (!file) return new HttpResponse(null, { status: 400 });
    if (!(file instanceof File)) return new HttpResponse('업로드된 문서는 파일이 아닙니다.', { status: 400 });

    // 유저 프로필 이미지 정보 추가
    const { fileName, extension } = fileNameParser(file.name);
    const uploadName = extension ? `${fileName}_${Date.now()}.${extension}` : `${fileName}_${Date.now()}`;
    try {
      updateUserProfile(userId, uploadName);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 401 });
    }

    // 프로필 이미지 더미데이터 추가
    const profileInfo = { userId, uploadName, file: new Blob([file], { type: file.type }) };
    saveUserProfileFileInMemory(userId, profileInfo);

    return HttpResponse.json({ fileName: uploadName }, { status: 200 });
  }),

  // 유저 프로필 이미지 조회 API
  http.get(`${API_URL}/file/profile/:fileName`, async ({ request, params }) => {
    const accessToken = request.headers.get('Authorization');
    const { fileName } = params;

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 유저 프로필 이미지 조회
    const decodedFileName = decodeURIComponent(fileName.toString());
    const fileInfo = downloadProfileFileInMemory(decodedFileName);
    if (!fileInfo) return HttpResponse.json({ message: '프로필 파일 정보를 찾을 수 없습니다.' }, { status: 404 });
    if (fileInfo.userId !== userId) {
      return HttpResponse.json({ message: '해당 파일에 접근 권한이 없습니다.' }, { status: 403 });
    }

    const buffer = await fileInfo.file.arrayBuffer();
    return HttpResponse.arrayBuffer(buffer, {
      headers: {
        'Content-Type': fileInfo.file.type,
      },
    });
  }),

  // 유저 프로필 이미지 삭제 API
  http.delete(`${API_URL}/user/profile/image`, async ({ request }) => {
    const accessToken = request.headers.get('Authorization');

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 유저 프로필 파일 삭제
    try {
      deleteUserProfile(userId);
      deleteProfileFileInMemory(userId);
    } catch (error) {
      const { message } = error as Error;
      return HttpResponse.json({ message }, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // 전체 팀 목록 조회 API (가입한 팀, 대기중인 팀)
  http.get(`${API_URL}/user/team`, ({ request }) => {
    const accessToken = request.headers.get('Authorization');

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 유저가 속한 모든 팀 목록 추출
    const teamUserList = findAllTeamUsersByUserId(userId);

    // 각 팀의 정보 취득
    const teamJoinStatusList = teamUserList.map((teamUser) => {
      const role = findRole(teamUser.roleId);
      const team = findTeam(teamUser.teamId);

      if (!role) return HttpResponse.json({ message: '역할 정보를 찾을 수 없습니다.' }, { status: 404 });
      if (!team) return HttpResponse.json({ message: '팀 정보를 찾을 수 없습니다.' }, { status: 404 });

      const creator = findUser(team?.creatorId);
      if (!creator) return HttpResponse.json({ message: '팀 관리자 정보를 찾을 수 없습니다.' }, { status: 404 });

      return {
        teamId: team.teamId,
        teamName: team.teamName,
        content: team.content,
        creator: creator.nickname,
        creatorId: team.creatorId,
        isPendingApproval: teamUser.isPendingApproval,
        roleName: role.roleName,
      };
    });

    return HttpResponse.json(teamJoinStatusList);
  }),

  // 전체 유저 검색
  http.get(`${API_URL}/user/search`, ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get('nickname') || '';
    const accessToken = request.headers.get('Authorization');

    // 유저 인증 확인
    if (!accessToken) return HttpResponse.json({ message: '토큰 정보가 없습니다.' }, { status: 401 });

    // 유저 ID 정보 취득
    const userId = convertTokenToUserId(accessToken);
    if (!userId) return HttpResponse.json({ message: '토큰에 포함된 유저 정보가 존재하지 않습니다.' }, { status: 401 });

    // 접두사(nickname)와 일치하는 유저 정보 최대 5명 추출
    const matchedSearchUsers = USER_DUMMY.filter((user) => user.nickname.startsWith(nickname) && user.userId !== userId)
      .slice(0, 5)
      .map((user) => ({ userId: user.userId, nickname: user.nickname }));

    return HttpResponse.json(matchedSearchUsers);
  }),
];

export default userServiceHandler;
