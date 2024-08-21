import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import ValidationInput from '@components/common/ValidationInput';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import useToast from '@hooks/useToast';
import useEmailVerification from '@hooks/useEmailVerification';
import reduceImageSize from '@utils/reduceImageSize';
import ProfileImageContainer from '@/components/user/auth-form/ProfileImageContainer';
import LinkContainer from '@/components/user/auth-form/LinkContainer';
import type { UserSignUpForm } from '@/types/UserType';

export default function SignUpPage() {
  const [imageUrl, setImageUrl] = useState('');
  const { toastSuccess, toastError } = useToast();
  const { isVerificationRequested, isTimerVisible, requestVerificationCode, verifyCode, handleTimerTimeout } =
    useEmailVerification();

  const methods = useForm<UserSignUpForm>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      email: '',
      code: '',
      nickname: '',
      password: '',
      checkPassword: '',
      bio: '',
      links: [],
    },
  });

  // form 전송 함수
  const onSubmit = async (data: UserSignUpForm) => {
    const { id, code, checkPassword, ...filteredData } = data;
    console.log(data);

    const verifyResult = verifyCode(methods.watch('code'), methods.setError);
    if (!verifyResult) return;

    // TODO: 폼 제출 로직 수정 필요
    try {
      // 회원가입 폼
      const formData = { ...filteredData, id, code };
      const registrationResponse = await axios.post(`http://localhost:8080/api/v1/user/${id}`, formData);
      if (registrationResponse.status !== 200) return toastError('회원가입에 실패했습니다. 다시 시도해 주세요.');

      // 이미지 폼
      if (!imageUrl) return toastSuccess('회원가입이 완료되었습니다.');
      const imgFormData = new FormData();
      try {
        const jpeg = await reduceImageSize(imageUrl);
        const file = new File([jpeg], new Date().toISOString(), { type: 'image/jpeg' });
        imgFormData.append('profileUrl', file);
        imgFormData.append('id', id ?? '');

        const imageResponse = await axios.post(`http://localhost:8080/api/v1/users/file`, imgFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (imageResponse.status !== 200) return toastError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');

        toastSuccess('회원가입이 완료되었습니다.');
      } catch (err) {
        toastError(`이미지 업로드에 실패했습니다: ${err}`);
      }
    } catch (error) {
      toastError(`회원가입 진행 중 오류가 발생했습니다: ${error}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="w-300 space-y-8">
        {/* 프로필 이미지 */}
        <ProfileImageContainer imageUrl={imageUrl} setImageUrl={setImageUrl} />

        {/* 아이디 */}
        <ValidationInput
          label="아이디"
          errors={methods.formState.errors?.id?.message}
          register={methods.register('id', USER_AUTH_VALIDATION_RULES.ID)}
        />

        {/* 이메일 */}
        <ValidationInput
          label="이메일"
          errors={methods.formState.errors.email?.message}
          register={methods.register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
        />

        {isVerificationRequested && (
          <ValidationInput
            label="인증번호"
            errors={methods.formState.errors.code?.message}
            register={methods.register('code', USER_AUTH_VALIDATION_RULES.CERTIFICATION)}
          />
        )}

        {/* 닉네임, 중복 확인 */}
        <ValidationInput
          label="닉네임"
          errors={methods.formState.errors.nickname?.message}
          register={methods.register('nickname', USER_AUTH_VALIDATION_RULES.NICKNAME)}
          isButtonInput
          buttonLabel="중복확인"
        />

        {/* 비밀번호 */}
        <ValidationInput
          label="비밀번호"
          errors={methods.formState.errors.password?.message}
          register={methods.register('password', USER_AUTH_VALIDATION_RULES.PASSWORD)}
          type="password"
        />

        {/* 비밀번호 확인 */}
        <ValidationInput
          label="비밀번호 확인"
          errors={methods.formState.errors.checkPassword?.message}
          register={methods.register(
            'checkPassword',
            USER_AUTH_VALIDATION_RULES.PASSWORD_CONFIRM(methods.watch('password')),
          )}
          type="password"
        />

        {/* 자기소개 */}
        <section>
          <label htmlFor="bio" className="font-bold">
            자기소개
          </label>
          <textarea
            {...methods.register('bio')}
            id="bio"
            placeholder="ex) 안녕하세요. 홍길동입니다."
            className="block h-70 w-full resize-none rounded-lg border border-input p-8 text-sm outline-none placeholder:text-emphasis"
          />
        </section>

        {/* 링크 */}
        <LinkContainer initialLinks={[]} />

        {/* 인증 요청 및 확인 버튼 */}
        <div className="space-y-8 text-center">
          <VerificationButton
            isVerificationRequested={isVerificationRequested}
            isTimerVisible={isTimerVisible}
            isSubmitting={methods.formState.isSubmitting}
            requestCode={methods.handleSubmit(requestVerificationCode)}
            handleTimerTimeout={handleTimerTimeout}
            buttonLabel="회원가입"
          />
          <Link to="/signin" className="block cursor-pointer font-bold">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
