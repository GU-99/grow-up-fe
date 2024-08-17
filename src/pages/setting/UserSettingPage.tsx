import { useForm } from 'react-hook-form';
import { EditUserInfoForm } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import { USER_INFO_DUMMY } from '@/mocks/mockData';
import ProfileImageUploader from '@/components/user/ProfileImgForm';
import LinkForm from '@/components/user/LinkForm';

export default function UserSettingPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<EditUserInfoForm>({
    mode: 'onChange',
    defaultValues: {
      id: USER_INFO_DUMMY.id,
      email: USER_INFO_DUMMY.email,
      nickname: USER_INFO_DUMMY.nickname,
      bio: USER_INFO_DUMMY.bio,
      links: USER_INFO_DUMMY.links,
      profileUrl: USER_INFO_DUMMY.profileUrl,
    },
  });

  // form 전송 함수
  const onSubmit = async (data: EditUserInfoForm) => {
    const { id, email, profileUrl, ...filteredData } = data;
    console.log(data);

    // TODO: 폼 제출 로직 작성
  };

  return (
    <div className="my-60 flex h-full items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-300 flex-col gap-8">
        {/* 프로필 이미지 */}
        <ProfileImageUploader initialImage={USER_INFO_DUMMY.profileUrl} setValue={setValue} />

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
        <LinkForm initialLinks={USER_INFO_DUMMY.links} setValue={setValue} />

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
