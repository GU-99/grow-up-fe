import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateTeamsQueryKey } from '@utils/queryKeyGenergator';
import { getTeamList } from '@services/userService';
import { acceptTeamInvitation, createTeam, declineTeamInvitation, deleteTeam, leaveTeam } from '@services/teamService';
import useToast from '@hooks/useToast';
import type { TeamForm, TeamListWithApproval } from '@/types/TeamType';

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
    onError: () => {
      toastError('팀 생성 중 오류가 발생했습니다.');
    },
    onSuccess: () => {
      toastSuccess('팀을 성공적으로 생성했습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}
