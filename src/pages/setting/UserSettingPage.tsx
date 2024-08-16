import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan, FaPlus, FaMinus } from 'react-icons/fa6';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { UserSignUpForm } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import reduceImageSize from '@/utils/reduceImageSize';
import { USER_SETTINGS } from '@/constants/userSettings';
import useToast from '@/hooks/useToast';
import { convertBytesToString } from '@/utils/converter';
import { USER_INFO_DUMMY } from '@/mocks/mockData';

export default function UserSettingPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [link, setLink] = useState<string>('');
  const [linksList, setLinksList] = useState<string[]>(USER_INFO_DUMMY.links);
  const { toastSuccess, toastError, toastWarn } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UserSignUpForm>({
    mode: 'onChange',
    defaultValues: {
      id: USER_INFO_DUMMY.id,
      email: USER_INFO_DUMMY.email,
      code: '',
      nickname: USER_INFO_DUMMY.nickname,
      bio: USER_INFO_DUMMY.bio,
      links: USER_INFO_DUMMY.links,
    },
  });

  // 이미지 관련 코드
  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > USER_SETTINGS.MAX_IMAGE_SIZE) {
      toastWarn(`최대 ${convertBytesToString(USER_SETTINGS.MAX_IMAGE_SIZE)} 이하의 이미지 파일만 업로드 가능합니다.`);
      e.target.value = '';
      return;
    }

    setImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveImg = () => {
    setValue('profileUrl', '');
    setImageUrl('');
  };

  // 웹사이트 링크 관련 코드
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '') return;
    if (linksList.length === USER_SETTINGS.MAX_LINK_COUNT)
      return toastWarn(`링크는 최대 ${USER_SETTINGS.MAX_LINK_COUNT}개까지 등록할 수 있습니다.`);

    setLinksList([...linksList, newLink.trim()]);
    setValue('links', [...linksList, newLink.trim()]);
    setLink('');
  };

  const handleRemoveLink = (removeLink: string) => {
    const filteredData = linksList.filter((item) => item !== removeLink);
    setLinksList(filteredData);
    setValue('links', filteredData);
  };

  // form 전송 함수
  const onSubmit = async (data: UserSignUpForm) => {
    const { id, ...filteredData } = data;

    // TODO: 폼 제출 로직 수정 필요
    try {
      // 프로필 수정 폼
      const registrationResponse = await axios.post(`http://localhost:8080/api/v1/user/${id}`, filteredData);
      if (registrationResponse.status !== 200) return toastError('프로필 수정에 실패했습니다. 다시 시도해 주세요.');

      // 이미지 폼
      if (!imageUrl) return toastSuccess('프로필 수정이 완료되었습니다.');
      const imgFormData = new FormData();
      try {
        const jpeg = await reduceImageSize(imageUrl);
        const file = new File([jpeg], new Date().toISOString(), { type: 'image/jpeg' });
        imgFormData.append('profile', file);
        imgFormData.append('id', id);

        const imageResponse = await axios.post(`http://localhost:8080/api/v1/users/file`, imgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (imageResponse.status !== 200) return toastError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');

        toastSuccess('프로필 수정이 완료되었습니다.');
      } catch (err) {
        toastError(`이미지 업로드에 실패했습니다: ${err}`);
      }
    } catch (error) {
      toastError(`프로필 수정 진행 중 오류가 발생했습니다: ${error}`);
    }
  };

  return (
    <div className="my-60 flex h-full items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-300 flex-col gap-8">
        {/* 프로필 이미지 */}
        <div className="flex flex-col items-center gap-8">
          <div className="group relative h-100 w-100 overflow-hidden rounded-[50%] border border-input">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="profileImage" className="h-full w-full object-cover" />
                <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-50 group-hover:flex">
                  <p
                    role="presentation"
                    className="cursor-pointer"
                    onClick={handleRemoveImg}
                    onKeyDown={handleRemoveImg}
                  >
                    <FaRegTrashCan size="1.5rem" color="white" />
                  </p>
                </div>
              </>
            ) : (
              <label
                htmlFor="image"
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 text-center"
              >
                <input
                  {...register('profileUrl')}
                  id="image"
                  type="file"
                  className="hidden"
                  onChange={handleChangeImg}
                />
                <GoPlusCircle size="1.5rem" color="#5E5E5E" />
              </label>
            )}
          </div>
        </div>

        {/* 아이디 */}
        <ValidationInput
          disabled
          label="아이디"
          required={false}
          errors={errors.id?.message}
          register={register('id', USER_AUTH_VALIDATION_RULES.ID)}
        />

        {/* 이메일 */}
        <ValidationInput
          disabled
          label="이메일"
          required={false}
          errors={errors.email?.message}
          register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
        />

        {/* 닉네임, 중복 확인 */}
        <ValidationInput
          label="닉네임"
          required={false}
          errors={errors.nickname?.message}
          register={register('nickname', USER_AUTH_VALIDATION_RULES.NICKNAME)}
          isButtonInput
          buttonLabel="중복확인"
        />

        {/* 자기소개 */}
        <div className="flex flex-col">
          <label htmlFor="bio" className="font-bold">
            자기소개
          </label>
          <textarea
            {...register('bio')}
            id="bio"
            placeholder="ex) 안녕하세요. 홍길동입니다."
            className="h-90 grow resize-none rounded-lg border border-input p-8 text-sm outline-none placeholder:text-emphasis"
          />
        </div>

        {/* 링크 */}
        <div>
          <h1 className="font-bold">링크</h1>
          <div className="flex flex-col gap-4">
            {linksList &&
              linksList.map((item) => (
                <div key={item} className="flex h-30 items-center rounded-lg border border-input px-6 text-sm">
                  <div className="flex h-full w-full flex-row items-center gap-8">
                    <div className="flex grow items-center overflow-hidden border-transparent bg-inherit">
                      <a href={`http://${item}`} target="_blank" rel="noreferrer">
                        {item}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(item)}
                      className="flex h-20 w-20 items-center justify-center rounded-lg bg-sub px-8 font-bold shadow-md"
                      aria-label="삭제"
                    >
                      <FaMinus />
                    </button>
                  </div>
                </div>
              ))}
            <div
              className={`flex h-30 items-center rounded-lg border border-input ${isFocused ? 'bg-white' : 'bg-disable'} px-6 text-sm`}
            >
              <div className="flex h-full w-full flex-row items-center gap-8">
                <input
                  placeholder="ex) www.github.com"
                  value={link}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleLinkChange}
                  type="text"
                  className="flex grow bg-inherit outline-none placeholder:text-emphasis"
                />
                <button
                  type="button"
                  onClick={() => handleAddLink(link)}
                  className="flex h-20 w-20 items-center justify-center rounded-lg bg-sub px-8 font-bold shadow-md"
                  aria-label="추가"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 개인정보 수정 버튼 */}
        <div className="flex flex-col gap-8 text-center">
          <button
            type="submit"
            className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
            disabled={isSubmitting}
          >
            <span>변경</span>
          </button>
        </div>
      </form>
    </div>
  );
}
