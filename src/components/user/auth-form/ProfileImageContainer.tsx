import { useEffect } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan } from 'react-icons/fa6';
import { convertBytesToString } from '@utils/converter';
import { USER_SETTINGS } from '@constants/settings';
import { JPG, PNG, SVG, WEBP } from '@constants/mimeFileType';
import useToast from '@hooks/useToast';
import { useUploadProfileImage } from '@hooks/query/useUserQuery';
import useStore from '@stores/useStore';

type ProfileImageContainerProps = {
  imageUrl: string | null;
  setImageUrl: (url: string) => void;
};

export default function ProfileImageContainer({ imageUrl, setImageUrl }: ProfileImageContainerProps) {
  const { toastWarn } = useToast();
  const { mutate: uploadImageMutate } = useUploadProfileImage();
  const { editUserInfo, userInfo } = useStore();

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

    const localImageUrl = URL.createObjectURL(file);
    setImageUrl(localImageUrl);
  };

  const handleRemoveImg = () => {
    setImageUrl('');
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
