import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchUserInfo } from '@services/userService';
import useToast from '@hooks/useToast';
import type { EditUserInfoRequest } from '@/types/UserType';

export function useUpdateUserInfo() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();

  const mutation = useMutation({
    mutationFn: (data: EditUserInfoRequest) => patchUserInfo(data),
    onError: () => toastError('유저 정보 수정에 실패했습니다. 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('유저 정보가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });

  return mutation;
}
