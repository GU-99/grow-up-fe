import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@services/authService';
import { User } from '@/types/UserType';

export function useReadUserInfo() {
  const { data, isLoading, isError, error } = useQuery<User, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const { data } = await getUserInfo();
      return data;
    },
    staleTime: Infinity,
  });

  return { data, isLoading, isError, error };
}
