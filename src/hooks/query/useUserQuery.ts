import { useMutation, useQueryClient } from '@tanstack/react-query';
import useToast from '@hooks/useToast';
import { updateLinks, updateUserInfo } from '@services/userService';
import { generateLinksQueryKey, generateUserInfoQueryKey } from '@utils/queryKeyGenerator';
import type { EditUserInfoRequest, EditUserLinksForm } from '@/types/UserType';

export function useUpdateUserInfo() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const userInfoQueryKey = generateUserInfoQueryKey();

  const mutation = useMutation({
    mutationFn: (data: EditUserInfoRequest) => updateUserInfo(data),
    onError: () => toastError('유저 정보 수정에 실패했습니다. 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('유저 정보가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: userInfoQueryKey });
    },
  });

  return mutation;
}

export function useUpdateLinks() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const linksQueryKey = generateLinksQueryKey();

  const mutation = useMutation({
    mutationFn: (data: EditUserLinksForm) => updateLinks(data),
    onError: () => toastError('링크 수정에 실패했습니다. 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('링크가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: linksQueryKey });
    },
  });

  return mutation;
}
