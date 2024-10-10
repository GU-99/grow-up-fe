import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateTeamCoworkersQueryKey, generateTeamsQueryKey } from '@utils/queryKeyGenerator';

import { getTeamList } from '@services/userService';
import {
  acceptTeamInvitation,
  addTeamMember,
  updateTeamRole,
  createTeam,
  declineTeamInvitation,
  deleteTeam,
  findTeamCoworker,
  leaveTeam,
  removeTeamMember,
  updateTeamInfo,
} from '@services/teamService';
import useToast from '@hooks/useToast';
import { useMemo } from 'react';
import type {
  Team,
  TeamCoworker,
  TeamForm,
  TeamListWithApproval,
  TeamInfoForm,
  TeamCoworkerForm,
} from '@/types/TeamType';
import type { User } from '@/types/UserType';

// 전체 팀 목록 조회
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
    mutationFn: (teamId: Team['teamId']) => leaveTeam(teamId),
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

  const mutation = useMutation({
    mutationFn: (teamId: Team['teamId']) => deleteTeam(teamId),
    onError: () => {
      toastError('팀 삭제를 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: (_, teamId) => {
      const teamCoworkersQueryKey = generateTeamCoworkersQueryKey(teamId);
      toastSuccess('팀을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamCoworkersQueryKey });
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
    mutationFn: (teamId: Team['teamId']) => acceptTeamInvitation(teamId),
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
    mutationFn: (teamId: Team['teamId']) => declineTeamInvitation(teamId),
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
    onError: () => {
      toastError('팀 생성에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀을 성공적으로 생성했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
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
    mutationFn: ({ teamId, teamInfo }: { teamId: Team['teamId']; teamInfo: TeamInfoForm }) =>
      updateTeamInfo(teamId, teamInfo),
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

// 팀원 추가
export function useAddTeamCoworker(teamId: Team['teamId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamCoworkersQueryKey = generateTeamCoworkersQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: TeamCoworkerForm) => addTeamMember(teamId, userId, roleName),
    onError: () => {
      toastError('팀원 추가에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원을 추가하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamCoworkersQueryKey });
    },
  });

  return mutation;
}

// 팀원 삭제
export function useDeleteTeamCoworker(teamId: Team['teamId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamCoworkersQueryKey = generateTeamCoworkersQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: (userId: User['userId']) => removeTeamMember(teamId, userId),
    onError: () => {
      toastError('팀원 삭제에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamCoworkersQueryKey });
    },
  });

  return mutation;
}

// 팀 권한 변경
export function useUpdateTeamCoworkerRole(teamId: Team['teamId']) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamCoworkersQueryKey = generateTeamCoworkersQueryKey(teamId);

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: TeamCoworkerForm) => updateTeamRole(teamId, userId, roleName),

    onError: () => {
      toastError('팀원 권한 변경에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원 권한을 변경하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamCoworkersQueryKey });
    },
  });

  return mutation;
}

// 팀원 목록 조회
export function useReadTeamCoworkers(teamId: Team['teamId']) {
  const {
    data: coworkers = [] as TeamCoworker[],
    isLoading,
    isError,
  } = useQuery({
    queryKey: generateTeamCoworkersQueryKey(teamId),
    queryFn: async () => {
      const { data } = await findTeamCoworker(teamId);
      return data;
    },
  });

  return { coworkers, isLoading, isError };
}

// 팀 상세 조회
export function useReadTeam(teamId: Team['teamId']) {
  const { joinedTeamList, invitedTeamList } = useReadTeams();

  const teamList = useMemo(() => {
    return [...joinedTeamList, ...invitedTeamList];
  }, [joinedTeamList, invitedTeamList]);

  const teamInfo = useMemo(() => {
    return teamList.find((team) => team.teamId === teamId);
  }, [teamList, teamId]);

  const {
    coworkers: teamCoworkers,
    isLoading: isTeamCoworkersLoading,
    isError: isTeamCoworkersError,
  } = useReadTeamCoworkers(teamId);

  const team = useMemo(
    () => ({
      teamName: teamInfo?.teamName,
      content: teamInfo?.content,
      coworkers: teamCoworkers,
      isLoading: isTeamCoworkersLoading,
      isError: isTeamCoworkersError,
    }),
    [teamInfo, teamCoworkers, isTeamCoworkersError, isTeamCoworkersLoading],
  );

  return team;
}
