import { ChangeEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants/regex';

type FormData = {
  profile: File[];
  email: string;
  verificationCode: string;
  name: string;
  password: string;
  checkPassword: string;
  bio: string;
  website: string[];
};

export default function SignUpPage() {
  const [imagePreview, setImagePreview] = useState('');
  const [link, setLink] = useState<string>('');
  const [websiteList, setWebsiteList] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      profile: [],
      email: '',
      verificationCode: '',
      name: '',
      password: '',
      checkPassword: '',
      bio: '',
      website: [''],
    },
  });

  const image = watch('profile');
  useEffect(() => {
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  const handleRemoveImg = () => {
    setValue('profile', []);
    setImagePreview('');
  };

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '') {
      return;
    }
    setWebsiteList([...websiteList, newLink.trim()]);
    setValue('website', [...websiteList, newLink.trim()]);
    setLink('');
  };

  const handleRemoveLink = (idx: number) => {
    const filteredData = websiteList.filter((_, index) => index !== idx);
    setWebsiteList(filteredData);
    setValue('website', filteredData);
  };

  const onSubmit = (data: FormData) => {
    const { verificationCode, checkPassword, ...filteredData } = data;
    console.log(filteredData);
  };

  return (
    <div className="flex flex-col overflow-y-scroll rounded-2xl border border-[#A9A9A9] bg-main p-30 shadow-xl shadow-gray-500/50 scrollbar-hide">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex w-300 flex-col gap-8">
        <div className="flex flex-col items-center gap-8">
          <div className="group relative h-100 w-100 overflow-hidden rounded-[50%] bg-white">
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                <div className="absolute inset-0 hidden items-center justify-center bg-black bg-opacity-50 group-hover:flex">
                  <p
                    role="presentation"
                    className="cursor-pointer text-white"
                    onClick={handleRemoveImg}
                    onKeyDown={handleRemoveImg}
                  >
                    삭제
                  </p>
                </div>
              </>
            ) : (
              <label
                htmlFor="profile"
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 text-center"
              >
                <input {...register('profile')} id="profile" type="file" className="hidden" />
                {/* <GoPlusCircle size="1.5rem" color="#5E5E5E" /> */}+<p className="text-[#5E5E5E]">프로필 이미지</p>
              </label>
            )}
          </div>
        </div>

        <div className="flex flex-row gap-8">
          <input
            {...register('email', {
              required: '이메일(아이디)을 입력해 주세요.',
              pattern: {
                value: EMAIL_REGEX,
                message: '이메일 형식에 맞지 않습니다.',
              },
            })}
            type="email"
            placeholder="(필수) 이메일(아이디)을 입력하세요."
            className={`auth-input ${errors.email && `border-2 border-[#FF0000]`}`}
          />
          <button type="button" className="auth-btn">
            인증번호 발송
          </button>
        </div>
        {errors.email && <p className="text-sm text-[#FF0000]">{errors.email.message}</p>}

        <div className="flex flex-row gap-8">
          <input
            {...register('verificationCode', { required: '인증번호를 입력해 주세요.' })}
            placeholder="(필수) 인증번호를 입력하세요."
            type="text"
            id="verificationCode"
            className={`auth-input ${errors.verificationCode && `border-2 border-[#FF0000]`}`}
          />
          <button type="button" className="auth-btn">
            확인
          </button>
        </div>
        {errors.verificationCode && <p className="text-sm text-[#FF0000]">{errors.verificationCode.message}</p>}

        <div className="flex flex-row gap-8">
          <input
            {...register('name', {
              required: '닉네임을 입력해 주세요.',
              maxLength: {
                value: 20,
                message: '닉네임은 최대 20자까지 입력 가능합니다.',
              },
            })}
            placeholder="(필수) 닉네임을 입력하세요."
            type="text"
            id="name"
            className={`auth-input ${errors.name && `border-2 border-[#FF0000]`}`}
          />
          <button type="button" className="auth-btn">
            중복확인
          </button>
        </div>
        {errors.name && <p className="text-sm text-[#FF0000]">{errors.name.message}</p>}

        <input
          {...register('password', {
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
          placeholder="(필수) 비밀번호를 입력하세요. (영문자, 숫자, 기호 포함 8~16자리)"
          type="password"
          id="password"
          className={`auth-input ${errors.password && `border-2 border-[#FF0000]`}`}
        />
        {errors.password && <p className="text-sm text-[#FF0000]">{errors.password.message}</p>}

        <input
          {...register('checkPassword', {
            required: '비밀번호를 한 번 더 입력해 주세요.',
            validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
          })}
          placeholder="(필수) 비밀번호를 한 번 더 입력해 주세요."
          type="password"
          id="checkPassword"
          className={`auth-input ${errors.checkPassword && `border-2 border-[#FF0000]`}`}
        />
        {errors.checkPassword && <p className="text-sm text-[#FF0000]">{errors.checkPassword.message}</p>}

        <input
          {...register('bio')}
          placeholder="(선택) 자신을 소개해 주세요."
          type="text"
          id="bio"
          className="auth-input h-90"
        />

        {websiteList &&
          websiteList.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="flex flex-row gap-8">
              <div className="auth-input flex items-center">
                <a href={`http://${item}`} target="_blank" className="underline underline-offset-4" rel="noreferrer">
                  {item}
                </a>
              </div>
              <button type="button" onClick={() => handleRemoveLink(index)} className="auth-btn">
                -
              </button>
            </div>
          ))}

        <div className="flex flex-row gap-8">
          <input
            placeholder="(선택) 링크를 추가해 보세요.(GitHub, Blog 등)"
            value={link}
            onChange={handleLinkChange}
            type="text"
            className="auth-input bg-disable"
          />
          <button type="button" onClick={() => handleAddLink(link)} className="auth-btn">
            +
          </button>
        </div>

        <div className="flex flex-col gap-4 text-center">
          <button type="submit" className="auth-btn" disabled={isSubmitting}>
            회원가입
          </button>

          <p className="cursor-pointer font-bold text-sub">로그인 페이지로 돌아가기</p>
        </div>
      </form>
    </div>
  );
}
