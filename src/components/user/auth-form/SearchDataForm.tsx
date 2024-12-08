import { useFormContext } from 'react-hook-form';
import ValidationInput from '@components/common/ValidationInput';
import FooterLinks from '@components/user/auth-form/FooterLinks';
import VerificationButton from '@components/user/auth-form/VerificationButton';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import { SearchPasswordForm } from '@/types/UserType';

type SearchDataFormProps = {
  formType: 'searchId' | 'searchPassword';
  isVerificationRequested: boolean;
  requestVerificationCode: (email: string) => Promise<void>;
  expireVerificationCode: () => void;
};

export default function SearchDataForm({
  formType,
  isVerificationRequested,
  requestVerificationCode,
  expireVerificationCode,
}: SearchDataFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useFormContext<SearchPasswordForm>();

  return (
    <>
      {/* 아이디 */}
      {formType === 'searchPassword' && (
        <ValidationInput
          placeholder="아이디"
          errors={errors.username?.message}
          register={register('username', USER_AUTH_VALIDATION_RULES.ID)}
        />
      )}

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
          errors={errors.verificationCode?.message}
          register={register('verificationCode', USER_AUTH_VALIDATION_RULES.VERIFICATION_CODE)}
        />
      )}

      {/* 인증 요청 및 확인 버튼 */}
      <div className="space-y-8 text-center">
        <VerificationButton
          isVerificationRequested={isVerificationRequested}
          isSubmitting={isSubmitting}
          requestCode={handleSubmit(() => requestVerificationCode(watch('email')))}
          expireVerificationCode={expireVerificationCode}
          buttonLabel={formType === 'searchId' ? '아이디 찾기' : '비밀번호 찾기'}
        />
      </div>

      <FooterLinks type={formType} />
    </>
  );
}
