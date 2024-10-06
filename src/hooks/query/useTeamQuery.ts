import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateProjectUsersQueryKey, generateTeamQueryKey, generateTeamsQueryKey } from '@utils/queryKeyGenerator';

import { getTeamList } from '@services/userService';
import {
  acceptTeamInvitation,
  addTeamMember,
  updateTeamRole,
  createTeam,
  declineTeamInvitation,
  deleteTeam,
  getTeamCoworker,
  leaveTeam,
  removeTeamMember,
  updateTeamInfo,
} from '@services/teamService';
import useToast from '@hooks/useToast';
import { useMemo } from 'react';
import { AxiosError } from 'axios';
import type { TeamForm, TeamListWithApproval } from '@/types/TeamType';
import type { TeamRoleName } from '@/types/RoleType';

// 팀 목록 조회
export function useReadTeams() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<TeamListWithApproval[], Error>({
    queryKey: generateTeamsQueryKey(),
    queryFn: async () => {
      const { data } = await getTeamList();
      return data;
    },
  });

  const joinedTeamList = data.filter((team) => team.isPendingApproval === true);
  const invitedTeamList = data.filter((team) => team.isPendingApproval === false);

  return { joinedTeamList, invitedTeamList, isLoading, isError, error };
}

// 팀 탈퇴
export function useLeaveTeam() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: (teamId: number) => leaveTeam(teamId),
    onError: () => {
      toastError('탈퇴에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀에서 탈퇴했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀 삭제
export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: (teamId: number) => deleteTeam(teamId),
    onError: () => {
      toastError('팀 삭제를 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀 초대 수락
export function useApproveTeamInvitation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: (teamId: number) => acceptTeamInvitation(teamId),
    onError: () => {
      toastError('초대 수락에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('초대를 수락했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀 초대 거절
export function useRejectTeamInvitation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: (teamId: number) => declineTeamInvitation(teamId),
    onError: () => {
      toastError('팀 생성 중 오류가 발생했습니다.');
    },
    onSuccess: () => {
      toastSuccess('초대를 거절했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀 생성
export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: async (data: TeamForm) => {
      return createTeam(data);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          toastError('이미 팀에 추가된 유저입니다.');
        } else {
          toastError('팀원 추가에 실패했습니다. 다시 시도해 주세요.');
        }
      }
    },
    onSuccess: () => {
      toastSuccess('팀을 성공적으로 생성했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀원 추가
export function useAddTeamCoworker(teamId: number) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamQueryKey = generateTeamQueryKey(teamId);
  const projectUsersQueryKey = generateProjectUsersQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: TeamRoleName }) =>
      addTeamMember(teamId, userId, roleName),
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          toastError('이미 팀에 추가된 유저입니다.');
        } else {
          toastError('팀원 추가에 실패했습니다. 다시 시도해 주세요.');
        }
      }
    },
    onSuccess: () => {
      toastSuccess('팀원을 추가하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamQueryKey });
      queryClient.invalidateQueries({ queryKey: projectUsersQueryKey });
    },
  });

  return mutation;
}

// 팀원 삭제
export function useDeleteCoworker(teamId: number) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();
  const projectUsersQueryKey = generateProjectUsersQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: (userId: number) => removeTeamMember(teamId, userId),
    onError: () => {
      toastError('팀원 삭제에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
      queryClient.invalidateQueries({ queryKey: projectUsersQueryKey });
    },
  });

  return mutation;
}

// 팀 권한 변경
export function useUpdateRole(teamId: number) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();
  const projectUsersQueryKey = generateProjectUsersQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: TeamRoleName }) =>
      updateTeamRole(teamId, userId, roleName),
    onError: () => {
      toastError('팀원 권한 변경에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원 권한을 변경하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
      queryClient.invalidateQueries({ queryKey: projectUsersQueryKey });
    },
  });

  return mutation;
}

// 팀 정보 수정
export function useUpdateTeamInfo() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: ({ teamId, teamData }: { teamId: number; teamData: TeamForm }) => updateTeamInfo(teamId, teamData),
    onError: () => {
      toastError('팀 정보 수정에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀 정보를 성공적으로 수정했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀 목록 조회
export function useReadTeamInfo(teamId: number) {
  // 팀 목록 가져오기
  const {
    data: teamList = [],
    isLoading: isTeamLoading,
    isError: isTeamError,
    error: teamError,
  } = useQuery({
    queryKey: generateTeamsQueryKey(),
    queryFn: async () => {
      const { data } = await getTeamList();
      console.log('팀 목록:', data);
      data.forEach((team) => {
        console.log(`팀 이름: ${team.teamName}, isPendingApproval: ${team.isPendingApproval}`);
      });
      return data;
    },
  });

  // 팀 정보 및 팀원 목록 필터링
  const teamInfo = useMemo(() => teamList.find((team) => team.teamId === teamId), [teamList, teamId]);

  // 팀원 목록 가져오기
  const {
    data: teamCoworkers = [],
    isLoading: isTeamCoworkersLoading,
    isError: isTeamCoworkersError,
    error: teamCoworkersError,
  } = useQuery({
    queryKey: generateProjectUsersQueryKey(teamId),
    queryFn: async () => {
      const { data } = await getTeamCoworker(teamId);
      console.log('팀원 목록:', data);
      return data;
    },
    enabled: !!teamId, // teamId가 있을 때만 쿼리 실행
  });

  const isLoading = isTeamLoading || isTeamCoworkersLoading;
  const isError = isTeamError || isTeamCoworkersError;
  const error = teamError || teamCoworkersError;

  return {
    teamName: teamInfo?.teamName,
    content: teamInfo?.content,
    coworkers: teamCoworkers,
    isLoading,
    isError,
    error,
  };
}
