import { useEffect, useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { FormProvider, useForm } from 'react-hook-form';

import { TASK_SETTINGS } from '@constants/settings';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import Spinner from '@components/common/Spinner';
import StatusRadio from '@components/common/StatusRadio';
import AssigneeList from '@components/common/AssigneeList';
import FileDropZone from '@components/common/FileDropZone';
import MarkdownEditor from '@components/common/MarkdownEditor';
import PeriodDateInput from '@components/common/PeriodDateInput';
import SearchUserInput from '@components/common/SearchUserInput';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import useToast from '@hooks/useToast';
import useAxios from '@hooks/useAxios';
import useTaskFile from '@hooks/useTaskFile';
import { useReadStatuses } from '@hooks/query/useStatusQuery';
import { useReadStatusTasks } from '@hooks/query/useTaskQuery';
import { useReadProjectUserRoleList } from '@hooks/query/useProjectQuery';
import { findUserByProject } from '@services/projectService';
import Validator from '@utils/Validator';

import type { SubmitHandler } from 'react-hook-form';
import type { SearchUser, UserWithRole } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';
import type { CustomFile } from '@/types/FileType';
import type { Task, TaskForm } from '@/types/TaskType';
import type { ProjectSearchCallback } from '@/types/SearchCallbackType';

type ModalTaskFormProps = {
  formId: string;
  project: Project;
  taskId?: Task['taskId'];
  onSubmit: SubmitHandler<TaskForm>;
};

// ToDo: React Query Error시 처리 추가할 것
export default function ModalTaskForm({ formId, project, taskId, onSubmit }: ModalTaskFormProps) {
  const { projectId, startDate, endDate } = project;

  const [keyword, setKeyword] = useState('');
  const [assignees, setAssignees] = useState<UserWithRole[]>([]);
  const [files, setFiles] = useState<CustomFile[]>([]);

  const { statusList, isStatusLoading } = useReadStatuses(projectId, taskId);
  const { taskNameList, isTaskLoading } = useReadStatusTasks(projectId);
  const { projectUserRoleList, isProjectUserRoleLoading } = useReadProjectUserRoleList(projectId);
  const { data: userList = [], loading, clearData, fetchData } = useAxios(findUserByProject);
  const { isValidTaskFile } = useTaskFile(project.projectId);
  const { toastInfo, toastWarn } = useToast();

  const searchCallbackInfo: ProjectSearchCallback = useMemo(
    () => ({ type: 'PROJECT', searchCallback: fetchData }),
    [fetchData],
  );

  const methods = useForm<TaskForm>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      content: '',
      assignees: [],
      startDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      endDate: DateTime.fromJSDate(new Date()).toFormat('yyyy-LL-dd'),
      statusId: statusList[0]?.statusId,
      files: [],
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!isStatusLoading && statusList) {
      setValue('statusId', statusList[0].statusId);
    }
  }, [isStatusLoading, statusList]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value.trim());

  const handleAssigneeClick = (user: SearchUser) => {
    const isIncludedUser = assignees.find((assignee) => assignee.userId === user.userId);
    if (isIncludedUser) return toastInfo('이미 포함된 수행자입니다');

    const userWithRole = projectUserRoleList.find((projectUser) => projectUser.userId === user.userId);
    if (!userWithRole) {
      return toastWarn('프로젝트 팀원 목록에서 추가한 사용자를 찾을 수 없습니다. 확인 후 다시 시도해주세요.');
    }

    const updatedAssignees = [...assignees, userWithRole];
    const assigneesIdList = updatedAssignees.map((assignee) => assignee.userId);
    setAssignees(updatedAssignees);
    setValue('assignees', assigneesIdList);
    setKeyword('');
    clearData();
  };

  const handleAssigneeDeleteClick = (user: SearchUser) => {
    const filteredAssignees = assignees.filter((assignee) => assignee.userId !== user.userId);
    const assigneesIdList = filteredAssignees.map((assignee) => assignee.userId);
    setAssignees(filteredAssignees);
    setValue('assignees', assigneesIdList);
  };

  const updateTaskFiles = (newFiles: FileList) => {
    // 최대 파일 등록 개수 확인
    if (!Validator.isValidFileCount(TASK_SETTINGS.MAX_FILE_COUNT, files.length + newFiles.length)) {
      return toastWarn(`최대로 등록 가능한 파일수는 ${TASK_SETTINGS.MAX_FILE_COUNT}개입니다.`);
    }

    // 새로운 파일 Validation & 고유 ID 부여
    const originFiles: File[] = files.map(({ file }) => file);
    const customFiles: CustomFile[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];

      if (isValidTaskFile(file)) {
        originFiles.push(file);
        customFiles.push({ fileId: `${file.name}_${Date.now()}`, fileName: file.name, file });
      }
    }
    setValue('files', originFiles);
    setFiles((prev) => [...prev, ...customFiles]);
  };

  const handleFileDeleteClick = (fileId: string) => {
    const filteredFiles = files.filter((file) => file.fileId !== fileId);
    const originFiles = filteredFiles.map(({ file }) => file);
    setValue('files', originFiles);
    setFiles(filteredFiles);
  };

  if (isStatusLoading || isTaskLoading || isProjectUserRoleLoading) return <Spinner />;

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

        <div className="mb-20">
          <SearchUserInput
            id="search"
            label="수행자"
            keyword={keyword}
            searchId={projectId}
            loading={loading}
            userList={userList}
            searchCallbackInfo={searchCallbackInfo}
            onKeywordChange={handleKeywordChange}
            onUserClick={handleAssigneeClick}
          />
          <AssigneeList assigneeList={assignees} onAssigneeDeleteClick={handleAssigneeDeleteClick} />
        </div>

        <MarkdownEditor id="content" label="내용" contentFieldName="content" />

        <FileDropZone
          id="files"
          label="첨부파일"
          files={files}
          accept={TASK_SETTINGS.FILE_ACCEPT}
          updateFiles={updateTaskFiles}
          onFileDeleteClick={handleFileDeleteClick}
        />
      </form>
    </FormProvider>
  );
}
