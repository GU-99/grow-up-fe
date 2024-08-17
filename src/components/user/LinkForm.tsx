import { ChangeEvent, useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import { useFormContext } from 'react-hook-form';
import { USER_SETTINGS } from '@/constants/userSettings';
import useToast from '@/hooks/useToast';

type LinkFormProps = {
  initialLinks: string[];
};

export default function LinkForm({ initialLinks }: LinkFormProps) {
  const { setValue } = useFormContext();
  const [link, setLink] = useState<string>('');
  const [linksList, setLinksList] = useState<string[]>(initialLinks);
  const [isFocused, setIsFocused] = useState(false);
  const { toastWarn } = useToast();

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
    if (newLink.trim() === '') return;
    if (linksList.length === USER_SETTINGS.MAX_LINK_COUNT)
      return toastWarn(`링크는 최대 ${USER_SETTINGS.MAX_LINK_COUNT}개까지 등록할 수 있습니다.`);

    const updatedLinks = [...linksList, newLink.trim()];
    setLinksList(updatedLinks);
    setValue('links', updatedLinks);
    setLink('');
  };

  const handleRemoveLink = (removeLink: string) => {
    const filteredData = linksList.filter((item) => item !== removeLink);
    setLinksList(filteredData);
    setValue('links', filteredData);
  };

  return (
    <div>
      <h1 className="font-bold">링크</h1>
      <div className="flex flex-col gap-4">
        {linksList.map((item) => (
          <div key={item} className="flex h-30 items-center rounded-lg border border-input px-6 text-sm">
            <div className="flex h-full w-full flex-row items-center gap-8">
              <div className="flex grow items-center overflow-hidden border-transparent bg-inherit">
                <a href={`http://${item}`} target="_blank" rel="noreferrer">
                  {item}
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveLink(item)}
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
              className="flex grow bg-inherit outline-none placeholder:text-emphasis"
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
  );
}
