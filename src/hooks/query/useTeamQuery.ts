import { useQuery } from '@tanstack/react-query';
import { getTeamList } from '@/services/userService';
import type { TeamListWithApproval } from '@/types/TeamType';

export default function useTeamList() {
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery<TeamListWithApproval[], Error>({
    queryKey: ['teamList'],
    queryFn: async () => {
      const { data } = await getTeamList();
      return data;
    },
  });

  const joinedTeamList = data.filter((team) => team.isPendingApproval === true);
  const invitedTeamList = data.filter((team) => team.isPendingApproval === false);
  console.log('Joined Teams:', joinedTeamList);
  console.log('Invited Teams:', invitedTeamList);
  return { joinedTeamList, invitedTeamList, isLoading, isError, error };
}
