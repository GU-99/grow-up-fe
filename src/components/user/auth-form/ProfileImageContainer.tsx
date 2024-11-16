import { useEffect } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan } from 'react-icons/fa6';
import { convertBytesToString } from '@utils/converter';
import { USER_SETTINGS } from '@constants/settings';
import { JPG, PNG, SVG, WEBP } from '@constants/mimeFileType';
import useAxios from '@hooks/useAxios';
import useToast from '@hooks/useToast';
import { useDeleteProfileImage, useUploadProfileImage } from '@hooks/query/useUserQuery';
import useStore from '@stores/useStore';
import { getProfileImage } from '@services/userService';

type ProfileImageContainerProps = {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
};

export default function ProfileImageContainer({ imageUrl, setImageUrl }: ProfileImageContainerProps) {
  const { toastWarn } = useToast();
  const { userInfo } = useStore();
  const { mutate: uploadImageMutate } = useUploadProfileImage();
  const { mutateAsync: deleteImageMutate } = useDeleteProfileImage();
  const { fetchData } = useAxios(getProfileImage);
  const { toastError } = useToast();

  useEffect(() => {
    const handleGetProfileImage = async (uploadName: string) => {
      const response = await fetchData(uploadName);
      if (response == null)
        return toastError('프로필 이미지 조회 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const profileImageUrl = URL.createObjectURL(blob);
      setImageUrl(profileImageUrl);
    };

    if (userInfo.profileImageName) handleGetProfileImage(userInfo.profileImageName);
  }, [userInfo.profileImageName]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > USER_SETTINGS.MAX_IMAGE_SIZE) {
      e.target.value = '';
      return toastWarn(
        `최대 ${convertBytesToString(USER_SETTINGS.MAX_IMAGE_SIZE)} 이하의 이미지 파일만 업로드 가능합니다.`,
      );
    }

    const IMG_EXTENSIONS = [JPG, PNG, WEBP, SVG];
    const permitType = IMG_EXTENSIONS.some((extensions) => extensions === file.type);
    if (!permitType) {
      e.target.value = '';
      return toastWarn(`${IMG_EXTENSIONS.join(', ')} 형식의 이미지 파일만 업로드 가능합니다.`);
    }

    uploadImageMutate({ file });
  };

  const handleRemoveImg = async () => {
    try {
      await deleteImageMutate();
      setImageUrl('');
    } catch (error) {
      console.error('이미지 삭제 중 에러 발생:', error);
    }
  };

  return (
    <section className="flex flex-col items-center">
      <div className="group relative flex size-100 items-center justify-center overflow-hidden rounded-full border border-input">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="profileImage" className="size-full object-cover" />
            <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-50 group-hover:flex">
              <p role="presentation" className="cursor-pointer" onClick={handleRemoveImg} onKeyDown={handleRemoveImg}>
                <FaRegTrashCan className="size-15 text-white" />
              </p>
            </div>
          </>
        ) : (
          <label htmlFor="image" className="cursor-pointer">
            <input id="image" type="file" className="hidden" onChange={handleChangeImg} />
            <GoPlusCircle className="size-15 text-[#5E5E5E]" />
          </label>
        )}
      </div>
    </section>
  );
}
