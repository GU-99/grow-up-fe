import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import Meta from '@components/common/Meta';
import ValidationInput from '@components/common/ValidationInput';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import LinkContainer from '@components/user/auth-form/LinkContainer';
import useToast from '@hooks/useToast';
import useEmailVerification from '@hooks/useEmailVerification';
import useNicknameDuplicateCheck from '@hooks/useNicknameDuplicateCheck';
import { signUp } from '@services/authService';
import type { UserSignUpForm } from '@/types/UserType';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { toastSuccess, toastError, toastWarn } = useToast();
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();

  const methods = useForm<UserSignUpForm>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      verificationCode: '',
      nickname: '',
      password: '',
      checkPassword: '',
      bio: null,
      links: [],
    },
  });

  const { watch, handleSubmit, formState, register, setValue } = methods;
  const nickname = watch('nickname');
  const { checkedNickname, handleCheckNickname } = useNicknameDuplicateCheck(
    nickname,
    formState.errors.nickname?.message,
  );

  const handleRequestVerificationCode = () => {
    if (!checkedNickname) return toastWarn('닉네임 중복 체크를 진행해 주세요.');
    requestVerificationCode(watch('email'));
  };

  // form 전송 함수
  const onSubmit = async (data: UserSignUpForm) => {
    const { checkPassword, ...filteredData } = data;

    // ToDo: useAxios 훅을 이용한 네트워크 로직으로 변경
    try {
      await signUp(filteredData);
      toastSuccess('회원가입에 성공했습니다. 로그인을 진행해 주세요.');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toastError(error.response.data.message);
        if (
          error.response.status === 400 &&
          error.response.data.message.includes('해당 이메일을 사용할 수 없습니다.')
        ) {
          expireVerificationCode(false);
          setValue('verificationCode', '');
        }
      } else toastError('예상치 못한 에러가 발생했습니다.');
    }
  };

  return (
    <>
      <Meta title="Grow Up : 회원가입" />
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
              errors={formState.errors.verificationCode?.message}
              register={register('verificationCode', USER_AUTH_VALIDATION_RULES.VERIFICATION_CODE)}
            />
          )}

          {/* 닉네임, 중복 확인 */}
          <ValidationInput
            label="닉네임"
            errors={formState.errors.nickname?.message}
            register={register('nickname', USER_AUTH_VALIDATION_RULES.NICKNAME)}
            isButtonInput
            buttonLabel="중복확인"
            buttonDisabled={checkedNickname}
            onButtonClick={handleCheckNickname}
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
          <LinkContainer initialLinks={[]} isImmediateUpdate={false} />

          {/* 인증 요청 및 확인 버튼 */}
          <div className="space-y-8 text-center">
            <VerificationButton
              isVerificationRequested={isVerificationRequested}
              isSubmitting={formState.isSubmitting}
              requestCode={handleSubmit(handleRequestVerificationCode)}
              expireVerificationCode={expireVerificationCode}
              buttonLabel="회원가입"
            />
            <Link to="/signin" className="block cursor-pointer font-bold">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
