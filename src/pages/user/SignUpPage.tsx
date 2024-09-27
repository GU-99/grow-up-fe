import { FormProvider, useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import ValidationInput from '@components/common/ValidationInput';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import LinkContainer from '@components/user/auth-form/LinkContainer';
import useToast from '@hooks/useToast';
import useEmailVerification from '@hooks/useEmailVerification';
import { checkNicknameDuplicate } from '@services/authService';
import type { UserSignUpForm } from '@/types/UserType';

export default function SignUpPage() {
  const { toastSuccess, toastError } = useToast();
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();

  const methods = useForm<UserSignUpForm>({
    mode: 'onChange',
    defaultValues: {
      username: null,
      email: '',
      code: '',
      nickname: '',
      password: '',
      checkPassword: '',
      bio: null,
      links: [],
    },
  });

  const { watch, handleSubmit, formState, register } = methods;

  const checkNickname = async () => {
    const nickname = watch('nickname');
    if (!nickname || formState.errors.nickname) return;

    try {
      await checkNicknameDuplicate({ nickname });
      toastSuccess('사용 가능한 닉네임입니다.');
    } catch (error) {
      if (error instanceof AxiosError && error.response) toastError(error.response.data.message);
      else toastError('예상치 못한 에러가 발생했습니다.');
    }
  };

  // form 전송 함수
  const onSubmit = async (data: UserSignUpForm) => {
    const { username, code, checkPassword, ...filteredData } = data;
    console.log(data);
    // TODO: 폼 제출 로직 수정 필요
    try {
      // 회원가입 폼
      const formData = { ...filteredData, username, code };
      const registrationResponse = await axios.post(`http://localhost:8080/api/v1/user/${username}`, formData);
      if (registrationResponse.status !== 200) return toastError('회원가입에 실패했습니다. 다시 시도해 주세요.');
    } catch (error) {
      toastError(`회원가입 진행 중 오류가 발생했습니다: ${error}`);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-300 grow flex-col justify-center gap-8">
        {/* 아이디 */}
        <ValidationInput
          label="아이디"
          errors={formState.errors?.username?.message}
          register={register('username', USER_AUTH_VALIDATION_RULES.ID)}
        />

        {/* 이메일 */}
        <ValidationInput
          label="이메일"
          errors={formState.errors.email?.message}
          register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
        />

        {isVerificationRequested && (
          <ValidationInput
            label="인증번호"
            errors={formState.errors.code?.message}
            register={register('code', USER_AUTH_VALIDATION_RULES.CERTIFICATION)}
          />
        )}

        {/* 닉네임, 중복 확인 */}
        <ValidationInput
          label="닉네임"
          errors={formState.errors.nickname?.message}
          register={register('nickname', USER_AUTH_VALIDATION_RULES.NICKNAME)}
          isButtonInput
          buttonLabel="중복확인"
          onButtonClick={checkNickname}
        />

        {/* 비밀번호 */}
        <ValidationInput
          label="비밀번호"
          errors={formState.errors.password?.message}
          register={register('password', USER_AUTH_VALIDATION_RULES.PASSWORD)}
          type="password"
        />

        {/* 비밀번호 확인 */}
        <ValidationInput
          label="비밀번호 확인"
          errors={formState.errors.checkPassword?.message}
          register={register('checkPassword', USER_AUTH_VALIDATION_RULES.PASSWORD_CONFIRM(watch('password')))}
          type="password"
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

        {/* 링크 */}
        <LinkContainer initialLinks={[]} />

        {/* 인증 요청 및 확인 버튼 */}
        <div className="space-y-8 text-center">
          <VerificationButton
            isVerificationRequested={isVerificationRequested}
            isSubmitting={formState.isSubmitting}
            requestCode={handleSubmit(() => requestVerificationCode(watch('email')))}
            expireVerificationCode={expireVerificationCode}
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
