import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import ValidationInput from '@components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@constants/formValidationRules';
import { updateUserPassword } from '@services/authService';
import useToast from '@hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { UpdatePasswordForm } from '@/types/UserType';

export default function UserPasswordSettingPage() {
  const navigate = useNavigate();
  const { toastSuccess, toastError } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: 'onChange',
  });

  const onSubmit = async (data: UpdatePasswordForm) => {
    if (watch('password') === watch('newPassword')) return toastError('신규 비밀번호가 현재 비밀번호와 동일합니다.');

    const { checkNewPassword, ...submitData } = data;

    try {
      await updateUserPassword(submitData);
      toastSuccess('비밀번호가 변경되었습니다.');
      setTimeout(() => {
        navigate('/setting/user', { replace: true });
      }, 2000);
    } catch (error) {
      if (error instanceof AxiosError && error.response) toastError(error.response.data.message);
      else toastError('예상치 못한 에러가 발생했습니다.');
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-300 flex-col gap-8">
        {/* 현재 비밀번호 */}
        <ValidationInput
          label="현재 비밀번호"
          type="password"
          errors={errors.password?.message}
          register={register('password', USER_AUTH_VALIDATION_RULES.PASSWORD)}
        />

        {/* 신규 비밀번호 */}
        <ValidationInput
          label="신규 비밀번호"
          type="password"
          errors={errors.newPassword?.message}
          register={register('newPassword', USER_AUTH_VALIDATION_RULES.PASSWORD)}
        />

        {/* 신규 비밀번호 확인 */}
        <ValidationInput
          label="신규 비밀번호 확인"
          type="password"
          errors={errors.checkNewPassword?.message}
          register={register('checkNewPassword', USER_AUTH_VALIDATION_RULES.PASSWORD_CONFIRM(watch('newPassword')))}
        />

        <div className="flex flex-col text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            비밀번호 변경
          </button>
        </div>
      </form>
    </div>
  );
}
