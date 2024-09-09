import { useQuery } from '@tanstack/react-query';
import { getTeamList } from '@services/userService';
import type { TeamListWithApproval } from '@/types/TeamType';

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
