import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { EditUserInfoRequest, EditUserInfoResponse, SearchUser } from '@/types/UserType';
import type { TeamListWithApproval } from '@/types/TeamType';

/**
 * 유저 정보 변경 API
 *
 * @export
 * @async
 * @param {EditUserInfoForm} userInfoForm - 유저 프로필 폼
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<EditUserInfoResponse>>}
 */
export async function updateUserInfo(userInfoForm: EditUserInfoRequest, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.patch<EditUserInfoResponse>('/user', userInfoForm, axiosConfig);
}

/**
 * 유저 프로필 업로드 API
 *
 * @export
 * @async
 * @param {File} file - 파일 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function uploadProfileImage(file: File, axiosConfig: AxiosRequestConfig = {}) {
  const fileFormData = new FormData();
  fileFormData.append('file', file);
  return authAxios.postForm(`/user/profile/image`, fileFormData, axiosConfig);
}

/**
 * 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {User['nickname']} nickname - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<SearchUser[]>>}
 */
export async function findUser(nickname: string, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<SearchUser[]>(`/user/search?nickname=${nickname}`, axiosConfig);
}

/**
 * 가입한 팀과 초대된 팀 전체 목록 조회 API
 *
 * @export
 * @async
 * @param {AxiosRequestConfig} [axiosConnfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<TeamListWithApproval[]>>}
 */
export async function getTeamList(axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<TeamListWithApproval[]>('/user/team', axiosConfig);
}
