import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@services/authService';
import { EditUserInfoForm } from '@/types/UserType';

export function useReadUserInfo() {
  const { data, isLoading, isError, error } = useQuery<EditUserInfoForm, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const { data } = await getUserInfo();
      return data;
    },
    staleTime: Infinity,
  });

  return { data, isLoading, isError, error };
}
