import { FormProvider, useForm } from 'react-hook-form';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import ValidationInput from '@components/common/ValidationInput';
import ProfileImageContainer from '@components/user/auth-form/ProfileImageContainer';
import LinkContainer from '@components/user/auth-form/LinkContainer';
import { useStore } from '@stores/useStore';
import useToast from '@hooks/useToast';
import useNicknameDuplicateCheck from '@hooks/useNicknameDuplicateCheck';
import { useUpdateUserInfo } from '@hooks/query/useUserQuery';
import type { EditUserInfoForm } from '@/types/UserType';

export default function UserSettingPage() {
  const { toastWarn } = useToast();
  const { editUserInfo, userInfo: userInfoData } = useStore();

  const { mutate: updateUserInfoMutate } = useUpdateUserInfo();

  const methods = useForm<EditUserInfoForm>({
    mode: 'onChange',
    defaultValues: {
      username: userInfoData?.username || '',
      email: userInfoData?.email || '',
      nickname: userInfoData?.nickname || '',
      bio: userInfoData?.bio || '',
      profileImageName: userInfoData?.profileImageName || '',
    },
  });
  const { formState, register, setValue, watch, handleSubmit } = methods;
  const nickname = watch('nickname');

  const { checkedNickname, lastCheckedNickname, handleCheckNickname } = useNicknameDuplicateCheck(
    nickname,
    formState.errors.nickname?.message,
    userInfoData?.nickname || '',
  );

  const onSubmit = (data: EditUserInfoForm) => {
    if (lastCheckedNickname !== nickname && !checkedNickname) {
      return toastWarn('닉네임 중복 체크를 진행해 주세요.');
    }

    updateUserInfoMutate({
      nickname: data.nickname,
      bio: data.bio,
    });

    editUserInfo(data);
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-300 py-30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 프로필 이미지 */}
          <ProfileImageContainer
            imageUrl={watch('profileImageName')}
            setImageUrl={(url: string) => setValue('profileImageName', url)}
          />

          {/* 아이디 */}
          <ValidationInput
            disabled
            label="아이디"
            required={false}
            errors={formState.errors.username?.message}
            register={register('username', USER_AUTH_VALIDATION_RULES.ID)}
          />

          {/* 이메일 */}
          <ValidationInput
            disabled
            label="이메일"
            required={false}
            errors={formState.errors.email?.message}
            register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
          />

          {/* 닉네임, 중복 확인 */}
          <ValidationInput
            label="닉네임"
            required={false}
            errors={formState.errors.nickname?.message}
            register={register('nickname', USER_AUTH_VALIDATION_RULES.NICKNAME)}
            isButtonInput
            buttonLabel="중복확인"
            buttonDisabled={checkedNickname}
            onButtonClick={handleCheckNickname}
          />

          {/* 자기소개 */}
          <section>
            <label htmlFor="bio" className="font-bold">
              자기소개
            </label>
            <textarea
              {...register('bio')}
              id="bio"
              placeholder="ex) 안녕하세요. 홍길동입니다."
              className="block h-70 w-full resize-none rounded-lg border border-input p-8 text-sm outline-none placeholder:text-emphasis"
            />
          </section>

          {/* 개인정보 수정 버튼 */}
          <button
            type="submit"
            className="h-25 w-full rounded-lg bg-sub px-8 font-bold"
            disabled={formState.isSubmitting}
          >
            변경
          </button>
        </form>
        <div>
          <hr className="my-20" />

          {/* 링크 */}
          <LinkContainer initialLinks={userInfoData?.links || []} />
        </div>
      </div>
    </FormProvider>
  );
}
