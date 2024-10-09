import { ChangeEvent, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useFormContext } from 'react-hook-form';
import { USER_SETTINGS } from '@constants/settings';
import Spinner from '@components/common/Spinner';
import useToast from '@hooks/useToast';
import { useUpdateLinks } from '@hooks/query/useUserQuery';
import useStore from '@stores/useStore';
import { EditUserLinksForm } from '@/types/UserType';

type LinkContainerProps = {
  initialLinks: string[];
  isImmediateUpdate: boolean;
};

export default function LinkContainer({ initialLinks, isImmediateUpdate }: LinkContainerProps) {
  const { setValue } = useFormContext();
  const { editUserInfo } = useStore();
  const [link, setLink] = useState<string>('');
  const [links, setLinks] = useState<string[]>(initialLinks);
  const [isFocused, setIsFocused] = useState(false);
  const { toastWarn } = useToast();

  const { mutate: updateLinksMutate, isPending: updateLinksIsPending } = useUpdateLinks();

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value);

  const handleUpdateLinks = (userLinks: EditUserLinksForm) => {
    updateLinksMutate(userLinks, {
      onSuccess: () => {
        setLinks(userLinks.links);
        setValue('links', userLinks.links);
        setLink('');
        editUserInfo(userLinks);
      },
    });
  };

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '') return;
    if (links.length === USER_SETTINGS.MAX_LINK_COUNT) {
      setLink('');
      return toastWarn(`링크는 최대 ${USER_SETTINGS.MAX_LINK_COUNT}개까지 등록할 수 있습니다.`);
    }

    const isIncludedLink = links.includes(newLink);
    if (isIncludedLink) return toastWarn('이미 등록된 링크입니다.');

    const updatedLinks = [...links, newLink.trim()];

    if (isImmediateUpdate) return handleUpdateLinks({ links: updatedLinks });

    setLinks(updatedLinks);
    setValue('links', updatedLinks);
    setLink('');
  };

  const handleRemoveLink = (removeLink: string) => {
    const filteredData = links.filter((linkItem) => linkItem !== removeLink);

    if (isImmediateUpdate) return handleUpdateLinks({ links: filteredData });

    setLinks(filteredData);
    setValue('links', filteredData);
  };

  return (
    <section className="relative">
      {updateLinksIsPending && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <span className="text-white">
            <Spinner />
          </span>
        </div>
      )}
      <label className="font-bold" htmlFor="link">
        링크
      </label>
      <div className="space-y-4">
        {links &&
          links.map((linkItem) => (
            <div
              key={linkItem}
              className="flex h-25 items-center space-x-8 rounded-lg border border-input px-6 text-sm"
            >
              <div className="grow overflow-hidden">
                <a href={`https://${linkItem}`} target="_blank" rel="noopener noreferrer">
                  {linkItem}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLink(linkItem)}
                className="flex size-18 items-center justify-center rounded-lg bg-sub"
                aria-label="삭제"
              >
                <FaMinus className="size-8" />
              </button>
            </div>
          ))}
        <div
          className={`flex h-25 items-center space-x-8 rounded-lg border border-input px-6 text-sm ${isFocused ? 'bg-white' : 'bg-disable'}`}
        >
          <input
            id="link"
            placeholder="ex) www.github.com"
            value={link}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleLinkChange}
            type="text"
            // TODO: 전체적으로 인풋 관련 스타일링 수정 필요, div 전체를 input이 덮을 수 있도록 수정
            disabled={updateLinksIsPending}
            className="h-full grow bg-inherit outline-none placeholder:text-emphasis"
          />
          <button
            type="button"
            onClick={() => handleAddLink(link)}
            className="flex size-18 items-center justify-center rounded-lg bg-sub"
            aria-label="추가"
            disabled={updateLinksIsPending}
          >
            <FaPlus className="size-8" />
          </button>
        </div>
      </div>
    </section>
  );
}
