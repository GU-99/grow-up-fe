import { useCallback, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import { FormProvider, useForm } from 'react-hook-form';
import { IoMdCloseCircle } from 'react-icons/io';

import { TASK_SETTINGS } from '@constants/settings';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import Spinner from '@components/common/Spinner';
import RoleIcon from '@components/common/RoleIcon';
import StatusRadio from '@components/common/StatusRadio';
import FileDropZone from '@components/common/FileDropZone';
import MarkdownEditor from '@components/common/MarkdownEditor';
import PeriodDateInput from '@components/common/PeriodDateInput';
import SearchUserInput from '@components/common/SearchUserInput';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import useToast from '@hooks/useToast';
import useAxios from '@hooks/useAxios';
import { useReadStatusTasks } from '@hooks/query/useTaskQuery';
import { useReadStatuses } from '@hooks/query/useStatusQuery';
import { convertBytesToString } from '@utils/converter';
import { findUserByProject } from '@services/projectService';

import type { SubmitHandler } from 'react-hook-form';
import type { UserWithRole } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';
import type { Task, TaskForm } from '@/types/TaskType';
import type { CustomFile } from '@/types/FileType';

type ModalTaskFormProps = {
  formId: string;
  project: Project;
  taskId?: Task['taskId'];
  onSubmit: SubmitHandler<TaskForm>;
};

// ToDo: React Query Error시 처리 추가할 것
export default function ModalTaskForm({ formId, project, taskId, onSubmit }: ModalTaskFormProps) {
  const { projectId, startDate, endDate } = project;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [keyword, setKeyword] = useState('');
  const [workers, setWorkers] = useState<UserWithRole[]>([]);
  const [files, setFiles] = useState<CustomFile[]>([]);

  const { statusList, isStatusLoading } = useReadStatuses(projectId, taskId);
  const { taskNameList } = useReadStatusTasks(projectId);
  const { data = [], loading, clearData, fetchData } = useAxios(findUserByProject);
  const { toastInfo, toastWarn } = useToast();

  // ToDo: 상태 수정 모달 작성시 기본값 설정 방식 변경할 것
  const methods = useForm<TaskForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      content: '',
      userId: [],
      startDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      endDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      statusId: statusList[0]?.statusId,
    },
  });
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const searchUsers = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    fetchData(projectId, keyword, { signal });
  }, [fetchData, projectId, keyword]);

  useEffect(() => {
    if (!isStatusLoading && statusList) {
      setValue('statusId', statusList[0].statusId);
    }
  }, [isStatusLoading, statusList]);

  useEffect(() => {
    if (keyword) debounceRef.current = setTimeout(() => searchUsers(), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [searchUsers, keyword]);

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

  const handleWorkerDeleteClick = (user: UserWithRole) => {
    const filteredWorker = workers.filter((worker) => worker.userId !== user.userId);
    const workersIdList = filteredWorker.map((worker) => worker.userId);
    setWorkers(filteredWorker);
    setValue('userId', workersIdList);
  };

  const updateFiles = (newFiles: FileList) => {
    // 최대 파일 등록 개수 확인
    if (files.length + newFiles.length > TASK_SETTINGS.MAX_FILE_COUNT) {
      return toastWarn(`최대로 등록 가능한 파일수는 ${TASK_SETTINGS.MAX_FILE_COUNT}개입니다.`);
    }

    // 새로운 파일별 파일 크기 확인 & 고유 ID 부여
    const customFiles: CustomFile[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (file.size > TASK_SETTINGS.MAX_FILE_SIZE) {
        return toastWarn(`최대 ${convertBytesToString(TASK_SETTINGS.MAX_FILE_SIZE)} 이하의 파일만 업로드 가능합니다.`);
      }
      customFiles.push({ id: `${file.name}_${file.size}_${Date.now()}`, file });
    }

    setFiles((prev) => [...prev, ...customFiles]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;
    updateFiles(files);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLElement>) => {
    const { files } = e.dataTransfer;
    if (!files || files.length === 0) return;
    updateFiles(files);
  };

  const handleFileDeleteClick = (fileId: string) => {
    const filteredFiles = files.filter((file) => file.id !== fileId);
    setFiles(filteredFiles);
  };

  if (isStatusLoading) return <Spinner />;

  return (
    <FormProvider {...methods}>
      <form id={formId} className="mb-20 flex w-4/5 grow flex-col justify-center" onSubmit={handleSubmit(onSubmit)}>
        <StatusRadio statusFieldName="statusId" statusList={statusList} />

        <DuplicationCheckInput
          id="name"
          label="일정"
          value={watch('name')}
          placeholder="일정명을 입력해주세요."
          errors={errors.name?.message}
          register={register('name', TASK_VALIDATION_RULES.TASK_NAME(taskNameList))}
        />

        <PeriodDateInput
          startDateLabel="시작일"
          endDateLabel="종료일"
          startDateId="startDate"
          endDateId="endDate"
          startDate={startDate}
          endDate={endDate}
          startDateFieldName="startDate"
          endDateFieldName="endDate"
        />

        {/* ToDo: 검색UI 공용 컴포넌트로 추출할 것 */}
        <div className="mb-20">
          <SearchUserInput
            id="search"
            label="수행자"
            keyword={keyword}
            loading={loading}
            userList={data}
            onKeywordChange={handleKeywordChange}
            onSearchKeyup={handleSearchKeyUp}
            onSearchClick={handleSearchClick}
            onUserClick={handleUserClick}
          />
          <section className="flex w-full flex-wrap items-center gap-4">
            {workers.map((user) => (
              <div key={user.userId} className="flex items-center space-x-4 rounded-md bg-button px-5">
                <RoleIcon roleName={user.roleName} />
                <div>{user.nickname}</div>
                <button type="button" aria-label="delete-worker" onClick={() => handleWorkerDeleteClick(user)}>
                  <IoMdCloseCircle className="text-close" />
                </button>
              </div>
            ))}
          </section>
        </div>

        <MarkdownEditor id="content" label="내용" contentFieldName="content" />

        <FileDropZone
          id="files"
          label="첨부파일"
          files={files}
          onFileChange={handleFileChange}
          onFileDrop={handleFileDrop}
          onFileDeleteClick={handleFileDeleteClick}
        />
      </form>
    </FormProvider>
  );
}
