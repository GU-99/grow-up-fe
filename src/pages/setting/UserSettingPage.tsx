import { FormProvider, useForm } from 'react-hook-form';
import { useState } from 'react';
import { EditUserInfoForm } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import { USER_INFO_DUMMY } from '@/mocks/mockData';
import LinkForm from '@/components/user/auth-form/LinkForm';
import ProfileImageForm from '@/components/user/auth-form/ProfileImageForm';

export default function UserSettingPage() {
  const [imageUrl, setImageUrl] = useState(USER_INFO_DUMMY.profileUrl);
  const methods = useForm<EditUserInfoForm>({
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
    <FormProvider {...methods}>
      <div className="my-60 flex h-full items-center justify-center">
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex w-full max-w-300 flex-col gap-8">
          {/* 프로필 이미지 */}
          <ProfileImageForm imageUrl={imageUrl} setImageUrl={setImageUrl} />

          {/* 아이디 */}
          <ValidationInput
            disabled
            label="아이디"
            required={false}
            errors={methods.formState.errors.id?.message}
            register={methods.register('id', USER_AUTH_VALIDATION_RULES.ID)}
          />

          {/* 이메일 */}
          <ValidationInput
            disabled
            label="이메일"
            required={false}
            errors={methods.formState.errors.email?.message}
            register={methods.register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
          />

          {/* 닉네임, 중복 확인 */}
          <ValidationInput
            label="닉네임"
            required={false}
            errors={methods.formState.errors.nickname?.message}
            register={methods.register('nickname', USER_AUTH_VALIDATION_RULES.NICKNAME)}
            isButtonInput
            buttonLabel="중복확인"
          />

          {/* 자기소개 */}
          <div className="flex flex-col">
            <label htmlFor="bio" className="font-bold">
              자기소개
            </label>
            <textarea
              {...methods.register('bio')}
              id="bio"
              placeholder="ex) 안녕하세요. 홍길동입니다."
              className="h-90 grow resize-none rounded-lg border border-input p-8 text-sm outline-none placeholder:text-emphasis"
            />
          </div>

          {/* 링크 */}
          <LinkForm initialLinks={USER_INFO_DUMMY.links} />

          {/* 개인정보 수정 버튼 */}
          <div className="flex flex-col gap-8 text-center">
            <button
              type="submit"
              className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
              disabled={methods.formState.isSubmitting}
            >
              <span>변경</span>
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
