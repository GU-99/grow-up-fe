import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan, FaPlus, FaMinus } from 'react-icons/fa6';
import { ChangeEvent, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import axios from 'axios';
import { UserSignUpForm } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';
import { USER_AUTH_VALIDATION_RULES } from '@/constants/formValidationRules';
import Timer from '@/components/common/Timer';
import reduceImageSize from '@/utils/reduceImageSize';
import { USER_SETTINGS } from '@/constants/userSettings';
import useToast from '@/hooks/useToast';
import { convertBytesToString } from '@/utils/converter';
import LinkForm from '@/components/user/LinkForm';
import ProfileImgForm from '@/components/user/ProfileImgForm';

export default function SignUpPage() {
  const [imageUrl, setImageUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [link, setLink] = useState<string>('');
  const [linksList, setLinksList] = useState<string[]>([]);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);
  // TODO: isVerificationCodeValid 변수가 반드시 필요한지 고민해보기
  // const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false);
  const [isTimerVisible, setIsTimerVisible] = useState(false);
  const { toastSuccess, toastError, toastWarn } = useToast();

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
      links: [''],
    },
  });

  // 이메일 인증번호 요청 함수
  const requestVerificationCode = () => {
    if (!isVerificationRequested) {
      setIsVerificationRequested(true);
      toastSuccess('인증번호가 발송되었습니다. 이메일을 확인해 주세요.');
      setIsTimerVisible(true);
    }
  };

  // 인증번호 확인 함수
  const verifyCode = (verificationCode: string) => {
    if (verificationCode === '1234') {
      // setIsVerificationCodeValid(true);
      return true;
    }

    // 인증번호 불일치
    // setIsVerificationCodeValid(false);
    methods.setError('code', {
      type: 'manual',
      message: '인증번호가 일치하지 않습니다.',
    });
    return false;
  };

  // form 전송 함수
  const onSubmit = async (data: UserSignUpForm) => {
    const { id, code, checkPassword, ...filteredData } = data;
    console.log(data);

    const verifyResult = verifyCode(code);
    if (!verifyResult) return toastError('인증번호가 유효하지 않습니다. 다시 시도해 주세요.');

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
        imgFormData.append('id', id);

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

  // 타이머 만료
  const handleTimerTimeout = () => {
    setIsTimerVisible(false);
    setIsVerificationRequested(false);
    toastError('인증 시간이 만료되었습니다. 다시 시도해 주세요.');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex w-300 flex-col gap-8">
        {/* 프로필 이미지 */}
        <ProfileImgForm initialImage="" />

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
        <LinkForm initialLinks={[]} />

        {/* 인증 요청 및 회원가입 버튼 */}
        <div className="flex flex-col gap-8 text-center">
          {!isVerificationRequested ? (
            <button
              type="submit"
              className="flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
              onClick={methods.handleSubmit(requestVerificationCode)}
            >
              <span>인증요청</span>
            </button>
          ) : (
            <button
              type="submit"
              className="relative flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
              disabled={methods.formState.isSubmitting}
            >
              {isTimerVisible && (
                <div className="absolute left-10">
                  <Timer time={180} onTimeout={handleTimerTimeout} />
                </div>
              )}
              <span>회원가입</span>
            </button>
          )}
          <Link to="/signin" className="cursor-pointer font-bold">
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </form>
    </FormProvider>
  );
}
