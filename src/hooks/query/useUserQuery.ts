import { useMutation, useQueryClient } from '@tanstack/react-query';
import useToast from '@hooks/useToast';
import { updateLinks, updateUserInfo, uploadProfileImage } from '@services/userService';
import useStore from '@stores/useStore';
import { generateLinksQueryKey, generateProfileFileQueryKey, generateUserInfoQueryKey } from '@utils/queryKeyGenerator';
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

export function useUploadProfileImage() {
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const { userInfo } = useStore();
  const userProfileImageQueryKey = generateProfileFileQueryKey(userInfo.userId);

  const mutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      uploadProfileImage(file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onError: () => toastError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('이미지가 업로드되었습니다.');
      queryClient.invalidateQueries({ queryKey: userProfileImageQueryKey });
    },
  });

  return mutation;
}

export function useUpdateLinks() {
  const { userInfo } = useStore();
  const queryClient = useQueryClient();
  const { toastSuccess, toastError } = useToast();
  const linksQueryKey = generateLinksQueryKey(userInfo.userId);

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
