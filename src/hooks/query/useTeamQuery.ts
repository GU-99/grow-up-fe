import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { generateProjectUsersQueryKey, generateTeamsQueryKey } from '@utils/queryKeyGenergator';
import { getTeamList } from '@services/userService';
import {
  acceptTeamInvitation,
  addTeamMember,
  changeTeamCoworkerRole,
  createTeam,
  declineTeamInvitation,
  deleteTeam,
  getTeamCoworker,
  leaveTeam,
  removeTeamMember,
  updateTeamInfo,
} from '@services/teamService';
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

// 팀원 추가
export function useAddTeamMember(teamId: number) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) => addTeamMember(teamId, userId, roleName),
    onError: () => {
      toastError('팀원 추가에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원을 추가하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀원 삭제
export function useRemoveTeamMember(teamId: number) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: (userId: number) => removeTeamMember(teamId, userId),
    onError: () => {
      toastError('팀원 삭제에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: teamsQueryKey });
    },
  });

  return mutation;
}

// 팀 권한 변경
export function useChangeRole(teamId: number) {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const teamsQueryKey = generateTeamsQueryKey();

  const mutation = useMutation({
    mutationFn: ({ userId, roleName }: { userId: number; roleName: string }) =>
      changeTeamCoworkerRole(teamId, userId, roleName),
    onError: () => {
      toastError('팀원 권한 변경에 실패했습니다. 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('팀원 권한을 변경하였습니다.');
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
  // 1. 팀 목록 가져오기
  const {
    data: teamList = [],
    isLoading: isTeamLoading,
    isError: isTeamError,
    error: teamError,
  } = useQuery({
    queryKey: generateTeamsQueryKey(),
    queryFn: async () => {
      const { data } = await getTeamList();
      return data;
    },
  });

  // 2. 팀 정보 및 팀원 목록 필터링
  const teamInfo = teamList.find((team) => team.teamId === teamId);

  // 3. 팀원 목록 가져오기
  const {
    data: teamCoworkers = [],
    isLoading: isTeamMembersLoading,
    isError: isTeamMembersError,
    error: teamCoworkerError,
  } = useQuery({
    queryKey: generateProjectUsersQueryKey(teamId),
    queryFn: async () => {
      const { data } = await getTeamCoworker(teamId);
      return data;
    },
  });

  const isLoading = isTeamLoading || isTeamMembersLoading;
  const isError = isTeamError || isTeamMembersError;
  const error = teamError || teamCoworkerError;

  return {
    teamInfo: {
      teamName: teamInfo?.teamName,
      content: teamInfo?.content,
      coworkers: teamCoworkers,
    },
    isLoading,
    isError,
    error,
  };
}
