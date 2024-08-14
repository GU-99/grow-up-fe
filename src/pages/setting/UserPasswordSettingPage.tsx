import { useForm } from 'react-hook-form';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import { EditPassword } from '@/types/UserType';

export default function UserPasswordSettingPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditPassword>({
    mode: 'onChange',
  });

  const onSubmit = (data: EditPassword) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-300 flex-col gap-8">
      {/* 현재 비밀번호 */}
      <ValidationInput
        label="현재 비밀번호"
        errors={errors.currentPassword?.message}
        register={register('currentPassword', USER_AUTH_VALIDATION_RULES.PASSWORD)}
      />

      {/* 신규 비밀번호 */}
      <ValidationInput
        label="신규 비밀번호"
        errors={errors.newPassword?.message}
        register={register('newPassword', USER_AUTH_VALIDATION_RULES.PASSWORD)}
      />

      {/* 신규 비밀번호 확인 */}
      <ValidationInput
        label="신규 비밀번호 확인"
        errors={errors.newPasswordChk?.message}
        register={register('newPasswordChk', USER_AUTH_VALIDATION_RULES.PASSWORD_CONFIRM(watch('newPassword')))}
      />

      <div className="flex flex-col text-center">
        <button type="submit" className="auth-btn" disabled={isSubmitting}>
          비밀번호 변경
        </button>
      </div>
    </form>
  );
}
