import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ModalLayout from '@layouts/ModalLayout';
import Spinner from '@components/common/Spinner';
import ModalPortal from '@components/modal/ModalPortal';
import ModalButton from '@components/modal/ModalButton';
import StatusRadio from '@components/common/StatusRadio';
import AssigneeList from '@components/common/AssigneeList';
import FileDropZone from '@components/common/FileDropZone';
import MarkdownEditor from '@components/common/MarkdownEditor';
import SearchUserInput from '@components/common/SearchUserInput';
import PeriodDateInput from '@components/common/PeriodDateInput';
import DuplicationCheckInput from '@components/common/DuplicationCheckInput';
import { TASK_SETTINGS } from '@constants/settings';
import { TASK_VALIDATION_RULES } from '@constants/formValidationRules';
import useAxios from '@hooks/useAxios';
import useToast from '@hooks/useToast';
import { useReadStatuses } from '@hooks/query/useStatusQuery';
import {
  useAddAssignee,
  useDeleteAssignee,
  useDeleteTaskFile,
  useReadAssignees,
  useReadStatusTasks,
  useReadTaskFiles,
  useUpdateTaskInfo,
} from '@hooks/query/useTaskQuery';
import { useReadProjectUserRoleList } from '@hooks/query/useProjectQuery';
import { findUserByProject } from '@services/projectService';

import type { SubmitHandler } from 'react-hook-form';
import type { SearchUser } from '@/types/UserType';
import type { Task, TaskUpdateForm } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';
import type { ProjectSearchCallback } from '@/types/SearchCallbackType';

type UpdateModalTaskProps = {
  project: Project;
  taskId: Task['taskId'];
  onClose: () => void;
};

export default function UpdateModalTask({ project, taskId, onClose: handleClose }: UpdateModalTaskProps) {
  const updateTaskFormId = 'updateTaskForm';
  const { projectId, startDate, endDate } = project;

  const [keyword, setKeyword] = useState('');
  const { toastInfo, toastWarn } = useToast();
  const { data: userList = [], loading, clearData, fetchData } = useAxios(findUserByProject);
  const searchCallbackInfo: ProjectSearchCallback = useMemo(
    () => ({ type: 'PROJECT', searchCallback: fetchData }),
    [fetchData],
  );

  const { statusList, isStatusLoading } = useReadStatuses(projectId, taskId);
  const { task, taskNameList, isTaskLoading } = useReadStatusTasks(projectId, taskId);
  const { projectUserRoleList, isProjectUserRoleLoading } = useReadProjectUserRoleList(projectId);
  const { assigneeList, isAssigneeLoading } = useReadAssignees(projectId, taskId);
  const { taskFileList, isTaskFileLoading } = useReadTaskFiles(projectId, taskId);

  const { mutate: updateTaskInfoMutate } = useUpdateTaskInfo(projectId, taskId);
  const { mutate: addAssigneeMutate } = useAddAssignee(projectId, taskId);
  const { mutate: deleteAssigneeMutate } = useDeleteAssignee(projectId, taskId);
  const { mutate: deleteTaskFileMutate } = useDeleteTaskFile(projectId, taskId);

  const methods = useForm<TaskUpdateForm>({ mode: 'onChange' });
  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (task) {
      reset({
        statusId: task.statusId.toString(),
        name: task.name,
        content: task.content,
        startDate: task.startDate,
        endDate: task.endDate,
      });
    }
  }, [task, reset]);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value.trim());

  const handleUserClick = (user: SearchUser) => {
    const isIncludedUser = assigneeList.find((assignee) => assignee.userId === user.userId);
    if (isIncludedUser) return toastInfo('이미 포함된 수행자입니다');

    const userWithRole = projectUserRoleList.find((projectUser) => projectUser.userId === user.userId);
    if (!userWithRole) {
      return toastWarn('프로젝트 팀원 목록에서 추가한 사용자를 찾을 수 없습니다. 확인 후 다시 시도해주세요.');
    }
    addAssigneeMutate(user.userId);
    setKeyword('');
    clearData();
  };

  const handleAssigneeDeleteClick = (user: SearchUser) => {
    const isIncludedUser = assigneeList.find((assignee) => assignee.userId === user.userId);
    if (!isIncludedUser) return toastInfo('수행자 목록에 없는 대상입니다. 확인 후 다시 시도 해주세요.');
    deleteAssigneeMutate(user.userId);
  };

  // ToDo: 일정 파일 업로드 작업시 같이 작업할 것
  const updateTaskFiles = (newFiles: FileList) => {
    if (taskFileList.length + newFiles.length > TASK_SETTINGS.MAX_FILE_COUNT) {
      return toastWarn(`최대로 등록 가능한 파일수는 ${TASK_SETTINGS.MAX_FILE_COUNT}개입니다.`);
    }
  };

  const handleFileDeleteClick = (fileId: string) => deleteTaskFileMutate(Number(fileId));

  if (isStatusLoading || isTaskLoading || isProjectUserRoleLoading || isTaskFileLoading || isAssigneeLoading) {
    return <Spinner />;
  }

  const handleFormSubmit: SubmitHandler<TaskUpdateForm> = async (formData) => {
    updateTaskInfoMutate(formData);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        {isStatusLoading || isTaskLoading ? (
          <Spinner />
        ) : (
          <>
            <FormProvider {...methods}>
              <form
                id={updateTaskFormId}
                className="flex w-4/5 grow flex-col justify-center"
                onSubmit={handleSubmit(handleFormSubmit)}
              >
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

                <MarkdownEditor id="content" label="내용" contentFieldName="content" />
              </form>
            </FormProvider>
            <ModalButton formId={updateTaskFormId} backgroundColor="bg-main">
              수정
            </ModalButton>
          </>
        )}
        <hr className="my-20" />
        {isProjectUserRoleLoading || isAssigneeLoading ? (
          <Spinner />
        ) : (
          <section>
            <SearchUserInput
              id="search"
              label="수행자"
              keyword={keyword}
              searchId={projectId}
              loading={loading}
              userList={userList}
              searchCallbackInfo={searchCallbackInfo}
              onKeywordChange={handleKeywordChange}
              onUserClick={handleUserClick}
            />
            <AssigneeList assigneeList={assigneeList} onAssigneeDeleteClick={handleAssigneeDeleteClick} />
          </section>
        )}
        <hr className="my-20" />
        {isTaskFileLoading ? (
          <Spinner />
        ) : (
          <FileDropZone
            id="files"
            label="첨부파일"
            files={taskFileList}
            accept={TASK_SETTINGS.FILE_ACCEPT}
            updateFiles={updateTaskFiles}
            onFileDeleteClick={handleFileDeleteClick}
          />
        )}
      </ModalLayout>
    </ModalPortal>
  );
}
