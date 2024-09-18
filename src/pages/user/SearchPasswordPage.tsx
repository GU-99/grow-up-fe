import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import ValidationInput from '@components/common/ValidationInput';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import useEmailVerification from '@hooks/useEmailVerification';
import AuthFormLayout from '@layouts/AuthFormLayout';
import type { SearchPasswordForm } from '@/types/UserType';

export default function SearchPasswordPage() {
  const { isVerificationRequested, requestVerificationCode, expireVerificationCode } = useEmailVerification();
  // const [tempPassword, setTempPassword] = useState(null);
  const [tempPassword, settempPassword] = useState('abce@qwer');
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      username: '',
      email: '',
      code: '',
    },
  });

  const onSubmit = (data: SearchPasswordForm) => {
    console.log(data);
  };

  return (
    <AuthFormLayout onSubmit={handleSubmit(onSubmit)} marginTop="mt-34.9">
      {tempPassword ? (
        <div className="mt-90 h-full space-y-20">
          <div className="space-y-5 text-center">
            <p className="text-sm">임시 비밀번호로 로그인해주세요.</p>
            <p>
              임시 비밀번호: <b>{tempPassword}</b>
            </p>
          </div>
          <button type="button" className="auth-btn w-full" onClick={() => nav('/signin')}>
            로그인으로 돌아가기
          </button>
        </div>
      ) : (
        <>
          {/* 아이디 */}
          <ValidationInput
            placeholder="아이디"
            errors={errors.username?.message}
            register={register('username', USER_AUTH_VALIDATION_RULES.ID)}
          />

          {/* 이메일 */}
          <ValidationInput
            placeholder="이메일"
            errors={errors.email?.message}
            register={register('email', USER_AUTH_VALIDATION_RULES.EMAIL)}
          />

          {/* 이메일 인증 */}
          {isVerificationRequested && (
            <ValidationInput
              placeholder="인증번호"
              errors={errors.code?.message}
              register={register('code', USER_AUTH_VALIDATION_RULES.CERTIFICATION)}
            />
          )}

          {/* 인증 요청 및 확인 버튼 */}
          <div className="space-y-8 text-center">
            <VerificationButton
              isVerificationRequested={isVerificationRequested}
              isSubmitting={isSubmitting}
              requestCode={handleSubmit(requestVerificationCode)}
              expireVerificationCode={expireVerificationCode}
              buttonLabel="비밀번호 찾기"
            />
          </div>
          <FooterLinks type="searchPassword" />
        </>
      )}
    </AuthFormLayout>
  );
}
