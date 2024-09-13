import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTeamList } from '@services/userService';
import { acceptTeamInvitation, declineTeamInvitation, deleteTeam, leaveTeam } from '@services/teamService';
import type { TeamListWithApproval } from '@/types/TeamType';
import useToast from '@/hooks/useToast';

export function useReadTeams() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<TeamListWithApproval[], Error>({
    queryKey: ['teams'],
    queryFn: async () => {
      const { data } = await getTeamList();
      return data;
    },
  });

  const joinedTeamList = data.filter((team) => team.isPendingApproval === true);
  const invitedTeamList = data.filter((team) => team.isPendingApproval === false);

  return { joinedTeamList, invitedTeamList, isLoading, isError, error };
}

export function useLeaveTeam() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: (teamId: number) => leaveTeam(teamId),
    onSuccess: () => {
      toastSuccess('팀에서 탈퇴했습니다.');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toastError('탈퇴에 실패했습니다. 다시 시도해 주세요.');
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: async (teamId: number) => {
      const response = await deleteTeam(teamId);

      return response;
    },
    onSuccess: () => {
      toastSuccess('팀을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toastError('팀 삭제를 실패했습니다. 다시 시도해 주세요.');
    },
  });
}

export function useApproveTeamInvitation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: (teamId: number) => acceptTeamInvitation(teamId),
    onSuccess: () => {
      toastSuccess('초대를 수락했습니다.');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toastError('초대 수락에 실패했습니다. 다시 시도해 주세요.');
    },
  });
}

export function useRejectTeamInvitation() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  return useMutation({
    mutationFn: (teamId: number) => declineTeamInvitation(teamId),
    onSuccess: () => {
      toastSuccess('초대를 거절했습니다.');
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
    onError: () => {
      toastError('초대 거절에 실패했습니다. 다시 시도해 주세요.');
    },
  });
}
