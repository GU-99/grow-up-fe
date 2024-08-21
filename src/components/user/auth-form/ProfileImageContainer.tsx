import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan } from 'react-icons/fa6';
import { useFormContext } from 'react-hook-form';
import { convertBytesToString } from '@utils/converter';
import { USER_SETTINGS } from '@constants/userSettings';
import useToast from '@hooks/useToast';

type ProfileImageContainerProps = {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
};

export default function ProfileImageContainer({ imageUrl, setImageUrl }: ProfileImageContainerProps) {
  const { setValue } = useFormContext();
  const { toastWarn } = useToast();

  // 이미지 관련 코드
  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.size > USER_SETTINGS.MAX_IMAGE_SIZE) {
      e.target.value = '';
      return toastWarn(
        `최대 ${convertBytesToString(USER_SETTINGS.MAX_IMAGE_SIZE)} 이하의 이미지 파일만 업로드 가능합니다.`,
      );
    }

    const image = URL.createObjectURL(file);
    setImageUrl(image);
    setValue('profileUrl', image);
  };

  const handleRemoveImg = () => {
    setImageUrl('');
    setValue('profileUrl', '');
  };

  return (
    <section className="flex flex-col items-center gap-8">
      <div className="group relative flex h-100 w-100 items-center justify-center overflow-hidden rounded-full border border-input">
        {imageUrl ? (
          <>
            <img src={imageUrl} alt="profileImage" className="h-full w-full object-cover" />
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
