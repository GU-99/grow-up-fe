import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '@services/authService';
import { EditUserInfoForm } from '@/types/UserType';

export function useReadUserInfo() {
  const {
    data: userInfoData,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
    error: userInfoError,
  } = useQuery<EditUserInfoForm, Error>({
    queryKey: ['userInfo'],
    queryFn: async () => {
      const { data } = await getUserInfo();
      return data;
    },
    staleTime: Infinity,
  });

  return { userInfoData, isUserInfoLoading, isUserInfoError, userInfoError };
}
