import { ChangeEvent, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useFormContext } from 'react-hook-form';
import { USER_SETTINGS } from '@constants/userSettings';
import useToast from '@hooks/useToast';

type LinkContainerProps = {
  initialLinks: string[];
};

export default function LinkContainer({ initialLinks }: LinkContainerProps) {
  const { setValue } = useFormContext();
  const [link, setLink] = useState<string>('');
  const [links, setLinks] = useState<string[]>(initialLinks);
  const [isFocused, setIsFocused] = useState(false);
  const { toastWarn } = useToast();

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value);

  const handleAddLink = (newLink: string) => {
    if (newLink.trim() === '') return;
    if (links.length === USER_SETTINGS.MAX_LINK_COUNT) {
      setLink('');
      return toastWarn(`링크는 최대 ${USER_SETTINGS.MAX_LINK_COUNT}개까지 등록할 수 있습니다.`);
    }

    const isIncludedLink = links.includes(newLink);
    if (isIncludedLink) return toastWarn('이미 등록된 링크입니다.');

    const updatedLinks = [...links, newLink.trim()];
    setLinks(updatedLinks);
    setValue('links', updatedLinks);
    setLink('');
  };

  const handleRemoveLink = (removeLink: string) => {
    const filteredData = links.filter((linkItem) => linkItem !== removeLink);
    setLinks(filteredData);
    setValue('links', filteredData);
  };

  return (
    <section>
      <label className="font-bold" htmlFor="link">
        링크
      </label>
      <div className="space-y-4" id="link">
        {links.map((linkItem) => (
          <div key={linkItem} className="flex h-25 items-center space-x-8 rounded-lg border border-input px-6 text-sm">
            <div className="grow overflow-hidden">
              <a href={`https://${linkItem}`} target="_blank" rel="noopener noreferrer">
                {linkItem}
              </a>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveLink(linkItem)}
              className="flex size-18 items-center justify-center rounded-lg bg-sub px-8"
              aria-label="삭제"
            >
              {/* TODO: 버튼 내부 아이콘 사이즈 적절히 조절할 것 */}
              <FaMinus />
            </button>
          </div>
        ))}
        <label
          htmlFor="newLink"
          className={`flex h-25 items-center space-x-8 rounded-lg border border-input px-6 text-sm ${isFocused ? 'bg-white' : 'bg-disable'}`}
        >
          <input
            id="newLink"
            placeholder="ex) www.github.com"
            value={link}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleLinkChange}
            type="text"
            className="grow bg-inherit outline-none placeholder:text-emphasis"
          />
          <button
            type="button"
            onClick={() => handleAddLink(link)}
            className="flex size-18 items-center justify-center rounded-lg bg-sub px-8"
            aria-label="추가"
          >
            {/* TODO: 버튼 내부 아이콘 사이즈 적절히 조절할 것 */}
            <FaPlus />
          </button>
        </label>
      </div>
    </section>
  );
}
