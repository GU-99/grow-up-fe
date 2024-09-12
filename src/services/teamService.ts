import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { User } from '@/types/UserType';
import type { Team } from '@/types/TeamType';

/**
 * 팀에 속한 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {Team['teamId']} teamId - 팀 아이디
 * @param {User['nickname']} nickname - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<User[]>>}
 */
async function findUserByTeam(
  teamId: Team['teamId'],
  nickname: User['nickname'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<User[]>(`/team/${teamId}/user/search?nickname=${nickname}`, axiosConfig);
}

/**
 * 팀에서 탈퇴하기
 * @param {string} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<void>}
 */
export async function leaveTeam(teamId: string, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team/${teamId}/leave`, {}, axiosConfig);
}

/**
 * 팀 삭제하기
 * @param {string} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<void>}
 */
export async function deleteTeam(teamId: string, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.delete(`/team/${teamId}`, axiosConfig);
}

/**
 * 팀 초대 수락하기
 * @param {string} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<void>}
 */
export async function acceptTeamInvitation(teamId: string, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team/${teamId}/invitation/accept`, {}, axiosConfig);
}

/**
 * 팀 초대 거절하기
 * @param {string} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<void>}
 */
export async function declineTeamInvitation(teamId: string, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team/${teamId}/invitation/decline`, {}, axiosConfig);
}
