import { useEffect } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useFormContext } from 'react-hook-form';
import { convertBytesToString } from '@utils/converter';
import { USER_SETTINGS } from '@constants/settings';
import useToast from '@hooks/useToast';
import { useUploadProfileImage } from '@hooks/query/useUserQuery';
import useStore from '@stores/useStore';

type ProfileImageContainerProps = {
  imageUrl: string | null;
};

export default function ProfileImageContainer({ imageUrl }: ProfileImageContainerProps) {
  const { setValue } = useFormContext();
  const { toastWarn } = useToast();
  const { mutate: uploadImage } = useUploadProfileImage();
  const { editUserInfo } = useStore();

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

    uploadImage({ file });

    const localImageUrl = URL.createObjectURL(file);
    const uniqueFileName = `PROFILE_IMAGE_${Date.now()}.jpg`;
    setValue('profileImageName', localImageUrl);
    editUserInfo({ profileImageName: uniqueFileName });
  };

  const handleRemoveImg = () => {
    setValue('profileImageName', null);
    editUserInfo({ profileImageName: null });
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
