import { useCallback, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { useForm } from 'react-hook-form';
import { IoSearch } from 'react-icons/io5';
import { IoMdCloseCircle } from 'react-icons/io';

import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import RoleIcon from '@components/common/RoleIcon';
import ToggleButton from '@components/common/ToggleButton';
import CustomMarkdown from '@components/common/CustomMarkdown';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import useToast from '@hooks/useToast';
import useAxios from '@hooks/useAxios';
import useTaskQuery from '@hooks/query/useTaskQuery';
import useStatusQuery from '@hooks/query/useStatusQuery';
import { findUserByProject } from '@services/projectService';

import type { SubmitHandler } from 'react-hook-form';
import type { UserWithRole } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';
import type { Task, TaskForm } from '@/types/TaskType';

type ModalTaskFormProps = {
  formId: string;
  project: Project;
  taskId?: Task['taskId'];
  onSubmit: SubmitHandler<TaskForm>;
};

export default function ModalTaskForm({ formId, project, taskId, onSubmit }: ModalTaskFormProps) {
  const { projectId, startDate, endDate } = project;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [hasDeadline, setHasDeadline] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [workers, setWorkers] = useState<UserWithRole[]>([]);
  const [preview, setPreview] = useState(false);

  const { statusList } = useStatusQuery(projectId, taskId);
  const { taskNameList } = useTaskQuery(projectId);
  const { data, loading, clearData, fetchData } = useAxios(findUserByProject);
  const { toastInfo } = useToast();

  // ToDo: 상태 수정 모달 작성시 기본값 설정 방식 변경할 것
  const {
    register,
    watch,
    setValue,
    getValues,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      content: '',
      userId: [],
      startDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      endDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      statusId: statusList[0].statusId,
    },
  });

  const searchUsers = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    fetchData(projectId, keyword, { signal });
  }, [fetchData, projectId, keyword]);

  useEffect(() => {
    if (keyword) {
      debounceRef.current = setTimeout(() => searchUsers(), 500);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [searchUsers, keyword]);

  const handleDeadlineToggle = () => {
    setValue('endDate', getValues('startDate'));
    clearErrors('endDate');
    setHasDeadline((prev) => !prev);
  };

  const handlePreviewToggle = () => setPreview((prev) => !prev);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value.trim());

  const handleSearchClick = () => searchUsers();

  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLowerCase() === 'enter') {
      e.preventDefault();
      searchUsers();
    }
  };

  const handleUserClick = (user: UserWithRole) => {
    const isIncludedUser = workers.find((worker) => worker.userId === user.userId);
    if (isIncludedUser) return toastInfo('이미 포함된 수행자입니다');

    const updatedWorkers = [...workers, user];
    const workersIdList = updatedWorkers.map((worker) => worker.userId);
    setWorkers(updatedWorkers);
    setValue('userId', workersIdList);
    setKeyword('');
    clearData();
  };

  const handleDeleteClick = (user: UserWithRole) => {
    const filteredWorker = workers.filter((worker) => worker.userId !== user.userId);
    const workersIdList = filteredWorker.map((worker) => worker.userId);
    setWorkers(filteredWorker);
    setValue('userId', workersIdList);
  };

  return (
    <form id={formId} className="mb-20 flex w-4/5 grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
      {/* ToDo: 상태 선택 리팩토링 할 것 */}
      <div className="flex items-center justify-start gap-4">
        {statusList.map((status) => {
          const { statusId, name, color } = status;
          const isChecked = +watch('statusId') === statusId;
          return (
            <label
              key={statusId}
              htmlFor={name}
              className={`flex items-center rounded-lg border px-5 py-3 text-emphasis ${isChecked ? 'border-input bg-white' : 'bg-button'}`}
            >
              <input
                id={name}
                type="radio"
                className="invisible h-0 w-0"
                value={statusId}
                checked={isChecked}
                {...register('statusId', TASK_VALIDATION_RULES.STATUS)}
              />
              <div style={{ borderColor: color }} className="mr-3 h-8 w-8 rounded-full border" />
              <h3 className="text-xs">{name}</h3>
            </label>
          );
        })}
      </div>
      <div className={`my-5 h-10 grow text-xs text-error ${errors.statusId ? 'visible' : 'invisible'}`}>
        {errors.statusId?.message}
      </div>

      <DuplicationCheckInput
        id="name"
        label="일정"
        value={watch('name')}
        placeholder="일정명을 입력해주세요."
        errors={errors.name?.message}
        register={register('name', TASK_VALIDATION_RULES.TASK_NAME(taskNameList))}
      />

      <div className="flex items-center justify-center gap-10">
        <label htmlFor="startDate" className="w-1/2">
          <h3 className="text-large">시작일</h3>
          <input
            type="date"
            id="startDate"
            {...register('startDate', TASK_VALIDATION_RULES.START_DATE(startDate, endDate))}
          />
          <div className={`my-5 h-10 grow text-xs text-error ${errors.startDate ? 'visible' : 'invisible'}`}>
            {errors.startDate?.message}
          </div>
        </label>
        <label htmlFor="endDate" className="w-1/2">
          <h3 className="flex items-center space-x-2 text-large">
            <span>종료일</span>
            <ToggleButton id="deadline" checked={hasDeadline} onChange={handleDeadlineToggle} />
          </h3>
          <input
            type="date"
            id="endDate"
            className={`${hasDeadline ? '' : '!bg-disable'}`}
            disabled={!hasDeadline}
            {...register(
              'endDate',
              TASK_VALIDATION_RULES.END_DATE(hasDeadline, startDate, endDate, watch('startDate')),
            )}
          />
          <div className={`my-5 h-10 grow text-xs text-error ${errors.endDate ? 'visible' : 'invisible'}`}>
            {errors.endDate?.message}
          </div>
        </label>
      </div>

      {/* ToDo: 검색UI 공용 컴포넌트로 추출할 것 */}
      <div className="mb-20">
        <label htmlFor="search" className="group mb-10 flex items-center gap-5">
          <h3 className="text-large">수행자</h3>
          <section className="relative grow">
            <input
              type="text"
              id="search"
              className="h-25 w-full rounded-md border border-input pl-10 pr-25 text-regular placeholder:text-xs"
              value={keyword}
              onChange={handleKeywordChange}
              onKeyDown={handleSearchKeyUp}
              placeholder="닉네임을 검색해주세요."
            />
            <button
              type="button"
              aria-label="search"
              className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={handleSearchClick}
            >
              <IoSearch className="size-15 text-emphasis hover:text-black" />
            </button>
            {keyword && !loading && (
              <ul className="invisible absolute left-0 right-0 z-10 max-h-110 overflow-auto rounded-md border-2 bg-white group-focus-within:visible">
                {data && data.length === 0 ? (
                  <div className="h-20 border px-10 leading-8">&apos;{keyword}&apos; 의 검색 결과가 없습니다.</div>
                ) : (
                  data?.map((user) => (
                    <li className="h-20 border" key={user.userId}>
                      <button
                        type="button"
                        className="h-full w-full px-10 text-left hover:bg-sub"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.blur();
                          handleUserClick(user);
                        }}
                      >
                        {user.nickname}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            )}
          </section>
        </label>
        <section className="flex w-full flex-wrap items-center gap-4">
          {workers.map((user) => (
            <div key={user.userId} className="flex items-center space-x-4 rounded-md bg-button px-5">
              <RoleIcon roleName={user.roleName} />
              <div>{user.nickname}</div>
              <button type="button" aria-label="delete-worker" onClick={() => handleDeleteClick(user)}>
                <IoMdCloseCircle className="text-error" />
              </button>
            </div>
          ))}
        </section>
      </div>

      <label htmlFor="content" className="mb-20">
        <h3 className="flex items-center space-x-2">
          <span className="text-large">내용</span>
          <ToggleButton id="preview" checked={preview} onChange={handlePreviewToggle} />
        </h3>
        {preview ? (
          <CustomMarkdown markdown={watch('content')} />
        ) : (
          <textarea
            id="content"
            rows={10}
            className="w-full border border-input p-10 placeholder:text-xs"
            placeholder="마크다운 형식으로 입력해주세요."
            {...register('content')}
          />
        )}
      </label>

      <label htmlFor="files">
        <h3 className="text-large">첨부파일</h3>
        <input type="file" id="files" />
      </label>
    </form>
  );
}
