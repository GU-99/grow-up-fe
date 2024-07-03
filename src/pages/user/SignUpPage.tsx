import { Link } from 'react-router-dom';
import { GoPlusCircle } from 'react-icons/go';
import { FaRegTrashCan, FaPlus, FaMinus } from 'react-icons/fa6';
import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX, PASSWORD_REGEX, PHONE_REGEX } from '@/constants/regex';
import { UserSignUpType } from '@/types/UserType';
import ValidationInput from '@/components/common/ValidationInput';

export default function SignUpPage() {
  const [imagePreview, setImagePreview] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [link, setLink] = useState<string>('');
  const [linksList, setLinksList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<UserSignUpType>({
    mode: 'onChange',
    defaultValues: {
      image: [], // 추후 이미지 전송 폼 분리 예정
      email: '',
      emailVerificationCode: '',
      phone: '',
      phoneVerificationCode: '',
      nickname: '',
      password: '',
      checkPassword: '',
      bio: '',
      links: [''],
    },
  });

  // 이미지 미리보기 관련 코드
  const profileImage = watch('image');
  useEffect(() => {
    if (profileImage && profileImage.length > 0) {
      const file = profileImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [profileImage]);

  const handleRemoveImg = () => {
    setValue('image', []);
    setImagePreview('');
  };

  // 웹사이트 링크 관련 코드
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '' || linksList.length === 3) {
      // alert같은 걸로 유저에게 알려줘야 할 듯...?
      return;
    }

    setLinksList([...linksList, newLink.trim()]);
    setValue('links', [...linksList, newLink.trim()]);
    setLink('');
  };

  const handleRemoveLink = (idx: number) => {
    const filteredData = linksList.filter((_, index) => index !== idx);
    setLinksList(filteredData);
    setValue('links', filteredData);
  };

  // form 전송 함수
  const onSubmit = (data: UserSignUpType) => {
    const { emailVerificationCode, phoneVerificationCode, checkPassword, ...filteredData } = data;
    console.log(filteredData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-300 flex-col gap-8">
      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-8">
        <div className="group relative h-100 w-100 overflow-hidden rounded-[50%] border border-input">
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="profileImage" className="h-full w-full object-cover" />
              <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-50 group-hover:flex">
                <p role="presentation" className="cursor-pointer" onClick={handleRemoveImg} onKeyDown={handleRemoveImg}>
                  <FaRegTrashCan size="1.5rem" color="white" />
                </p>
              </div>
            </>
          ) : (
            <label
              htmlFor="image"
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 text-center"
            >
              <input {...register('image')} id="image" type="file" className="hidden" />
              <GoPlusCircle size="1.5rem" color="#5E5E5E" />
            </label>
          )}
        </div>
      </div>

      {/* 이메일(아이디) */}
      <ValidationInput
        label="이메일"
        errors={errors.email?.message}
        register={register('email', {
          required: '이메일 인증을 진행해 주세요.',
          pattern: {
            value: EMAIL_REGEX,
            message: '이메일 형식에 맞지 않습니다.',
          },
        })}
        isButtonInput
        buttonLabel="인증번호 발송"
      />

      {/* 이메일 인증 */}
      {/* 인증번호 발송이 완료되면 해당 폼으로 대체 */}
      <ValidationInput
        label="이메일 인증 확인"
        errors={errors.emailVerificationCode?.message}
        register={register('emailVerificationCode', { required: '인증번호를 입력해 주세요.' })}
        isButtonInput
        buttonLabel="확인"
      />

      {/* 휴대폰 번호 */}
      <ValidationInput
        label="휴대폰 번호"
        errors={errors.phone?.message}
        register={register('phone', {
          required: '휴대폰 번호 인증을 진행해 주세요.',
          pattern: {
            value: PHONE_REGEX,
            message: '휴대폰 번호를 정확히 입력해 주세요.',
          },
        })}
        isButtonInput
        buttonLabel="인증번호 발송"
      />

      {/* 휴대폰 번호 인증 */}
      <ValidationInput
        label="휴대폰 인증 확인"
        errors={errors.phoneVerificationCode?.message}
        register={register('phoneVerificationCode', { required: '인증번호를 입력해 주세요.' })}
        isButtonInput
        buttonLabel="확인"
      />

      {/* 닉네임, 중복 확인 */}
      <ValidationInput
        label="닉네임"
        errors={errors.nickname?.message}
        register={register('nickname', {
          required: '닉네임을 입력해 주세요.',
          maxLength: {
            value: 20,
            message: '닉네임은 최대 20자까지 입력 가능합니다.',
          },
        })}
        isButtonInput
        buttonLabel="중복확인"
      />

      {/* 비밀번호 */}
      <ValidationInput
        label="비밀번호"
        errors={errors.password?.message}
        register={register('password', {
          required: '비밀번호를 입력해 주세요.',
          minLength: {
            value: 8,
            message: '비밀번호는 최소 8자 이상이어야 합니다.',
          },
          maxLength: {
            value: 16,
            message: '비밀번호는 최대 16자 이하여야 합니다.',
          },
          pattern: {
            value: PASSWORD_REGEX,
            message: '비밀번호는 영문자, 숫자, 기호를 포함해야 합니다.',
          },
        })}
        type="password"
      />

      {/* 비밀번호 확인 */}
      <ValidationInput
        label="비밀번호 확인"
        errors={errors.checkPassword?.message}
        register={register('checkPassword', {
          required: '비밀번호를 한 번 더 입력해 주세요.',
          validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
        })}
        type="password"
      />

      {/* 자기소개 */}
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <h1 className="font-bold">자기소개</h1>
          <p>optional</p>
        </div>
        <textarea
          {...register('bio')}
          placeholder="ex) 안녕하세요. 홍길동입니다."
          id="bio"
          className="h-90 flex-grow resize-none rounded-lg border border-input p-8 text-sm outline-none placeholder:text-emphasis"
        />
      </div>

      {/* 링크 */}
      <div>
        <div className="flex flex-row justify-between">
          <h1 className="font-bold">링크</h1>
          <p>optional</p>
        </div>
        <div className="flex flex-col gap-4">
          {linksList &&
            linksList.map((item, index) => (
              // 추후 uuid를 사용해 각 링크별 고유 key를 부여할 예정
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className="flex h-30 items-center rounded-lg border border-input px-6 text-sm">
                <div className="flex h-full w-full flex-row items-center gap-8">
                  <div className="flex w-[90%] items-center overflow-hidden border-transparent bg-inherit">
                    <a href={`http://${item}`} target="_blank" rel="noreferrer">
                      {item}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="flex h-20 w-20 items-center justify-center rounded-lg bg-sub px-8 font-bold shadow-md"
                    aria-label="삭제"
                  >
                    <FaMinus />
                  </button>
                </div>
              </div>
            ))}
          <div
            className={`flex h-30 items-center rounded-lg border border-input ${isFocused ? 'bg-white' : 'bg-disable'} px-6 text-sm`}
          >
            <div className="flex h-full w-full flex-row items-center gap-8">
              <input
                placeholder="ex) www.github.com"
                value={link}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleLinkChange}
                type="text"
                className="w-[90%] bg-inherit outline-none placeholder:text-emphasis"
              />
              <button
                type="button"
                onClick={() => handleAddLink(link)}
                className="flex h-20 w-20 items-center justify-center rounded-lg bg-sub px-8 font-bold shadow-md"
                aria-label="추가"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 회원가입 버튼 */}
      <div className="flex flex-col gap-4 text-center">
        <button
          type="submit"
          className="flex h-30 items-center justify-center rounded-lg bg-sub px-8 font-bold"
          disabled={isSubmitting}
        >
          회원가입
        </button>
        <Link to="/signin" className="cursor-pointer font-bold">
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </form>
  );
}
