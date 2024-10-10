import { authAxios } from '@services/axiosProvider';
import type { AxiosRequestConfig } from 'axios';
import type { SearchUser, User } from '@/types/UserType';
import type { Team, TeamCoworker, TeamForm, TeamInfoForm } from '@/types/TeamType';
import type { TeamRoleName } from '@/types/RoleType';

/**
 * 팀에 속한 유저 목록을 검색하는 API
 *
 * @export
 * @async
 * @param {Team['teamId']} teamId - 팀 아이디
 * @param {User['nickname']} nickname - 유저 닉네임
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<SearchUser[]>>}
 */
export async function findUserByTeam(
  teamId: Team['teamId'],
  nickname: User['nickname'],
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.get<SearchUser[]>(`/team/${teamId}/user/search?nickname=${nickname}`, axiosConfig);
}

/**
 * 팀 생성 API
 *
 * @export
 * @async
 * @param {TeamForm} teamData - 팀 생성정보 객체
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function createTeam(teamData: TeamForm, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team`, teamData, axiosConfig);
}

/**
 * 팀 탈퇴 API
 *
 * @export
 * @async
 * @param {number} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function leaveTeam(teamId: number, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team/${teamId}/leave`, {}, axiosConfig);
}

/**
 * 팀 삭제 API
 *
 * @export
 * @async
 * @param {number} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function deleteTeam(teamId: number, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.delete(`/team/${teamId}`, axiosConfig);
}

/**
 * 팀 초대 수락 API
 *
 * @export
 * @async
 * @param {number} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function acceptTeamInvitation(teamId: number, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team/${teamId}/invitation/accept`, {}, axiosConfig);
}

/**
 * 팀 초대 거절 API
 *
 * @export
 * @async
 * @param {number} teamId - 팀 아이디
 * @param {AxiosRequestConfig} [axiosConfig={}] - axios 요청 옵션 설정 객체
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function declineTeamInvitation(teamId: number, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.post(`/team/${teamId}/invitation/decline`, {}, axiosConfig);
}

/**
 * 팀원 추가 API
 *
 * @export
 * @async
 * @param {number} teamId
 * @param {number} userId
 * @param {string} roleName
 * @param {AxiosRequestConfig} [axiosConfig={}]
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function addTeamMember(
  teamId: number,
  userId: number,
  roleName: TeamRoleName,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.post(`/team/${teamId}/invitation`, { userId, roleName }, axiosConfig);
}

/**
 * 팀원 삭제 API
 *
 * @export
 * @async
 * @param {number} teamId
 * @param {number} userId
 * @param {AxiosRequestConfig} [axiosConfig={}]
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function removeTeamMember(teamId: number, userId: number, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.delete(`/team/${teamId}/user/${userId}`, axiosConfig);
}

/**
 * 팀원 권한 변경 API
 *
 * @export
 * @async
 * @param {number} teamId
 * @param {number} userId
 * @param {TeamRoleName} roleName
 * @param {AxiosRequestConfig} [axiosConfig={}]
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateTeamRole(
  teamId: number,
  userId: number,
  roleName: TeamRoleName,
  axiosConfig: AxiosRequestConfig = {},
) {
  return authAxios.patch(`/team/${teamId}/user/${userId}/role`, { roleName }, axiosConfig);
}

/**
 * 팀에 속한 유저 목록을 가져오는 API
 *
 * @export
 * @async
 * @param {number} teamId
 * @param {AxiosRequestConfig} [axiosConfig={}] -
 * @returns {Promise<AxiosResponse<TeamCoworker[]>>}
 */
export async function findTeamCoworker(teamId: number, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.get<TeamCoworker[]>(`/team/${teamId}/user`, axiosConfig);
}

/**
 * 팀 정보 수정 API
 *
 * @export
 * @async
 * @param {number} teamId
 * @param {TeamForm} teamData
 * @param {AxiosRequestConfig} [axiosConfig={}]
 * @returns {Promise<AxiosResponse<void>>}
 */
export async function updateTeamInfo(teamId: number, teamInfo: TeamInfoForm, axiosConfig: AxiosRequestConfig = {}) {
  return authAxios.patch(`/team/${teamId}`, teamInfo, axiosConfig);
}
