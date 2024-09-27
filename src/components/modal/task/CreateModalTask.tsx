import { useQueryClient } from '@tanstack/react-query';
import ModalLayout from '@layouts/ModalLayout';
import ModalPortal from '@components/modal/ModalPortal';
import ModalTaskForm from '@components/modal/task/ModalTaskForm';
import ModalFormButton from '@components/modal/ModalFormButton';
import useToast from '@hooks/useToast';
import { useCreateStatusTask, useReadStatusTasks, useUploadTaskFile } from '@hooks/query/useTaskQuery';

import type { SubmitHandler } from 'react-hook-form';
import type { Task, TaskForm } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus } from '@/types/ProjectStatusType';

type CreateModalTaskProps = {
  project: Project;
  onClose: () => void;
};

export default function CreateModalTask({ project, onClose: handleClose }: CreateModalTaskProps) {
  const { toastSuccess, toastError } = useToast();
  const { mutateAsync: createTaskInfoMutateAsync } = useCreateStatusTask(project.projectId);
  const { mutateAsync: createTaskFileMutateAsync } = useUploadTaskFile(project.projectId);
  const { statusTaskList } = useReadStatusTasks(project.projectId);
  const queryClient = useQueryClient();

  const getLastSortOrder = (statusId: ProjectStatus['statusId']) => {
    const statusTask = statusTaskList.find((statusTask) => statusTask.statusId === Number(statusId));
    if (!statusTask) {
      toastError('선택하신 프로젝트 상태는 존재하지 않습니다. ');
      throw Error('프로젝트 상태가 존재하지 않습니다.');
    }
    return statusTask.tasks.length + 1;
  };

  const taskFilesUpload = async (taskId: Task['taskId'], files: File[]) => {
    const createFilePromises = files.map((file) =>
      createTaskFileMutateAsync({ taskId, file }).then(
        () => ({ status: 'fulfilled', file }),
        (error) => ({ status: 'rejected', file, error }),
      ),
    );

    const results = await Promise.allSettled(createFilePromises);
    const queryKey = ['projects', project.projectId, 'tasks'];
    queryClient.invalidateQueries({ queryKey });

    const fulfilledFileList = results.filter((result) => result.status === 'fulfilled');
    const fulfilledFilesName = fulfilledFileList.map((result) => result.value.file.name).join(', ');
    toastSuccess(`${fulfilledFilesName} 파일 업로드에 성공했습니다.`);

    const rejectedFileList = results.filter((result) => result.status === 'rejected');
    if (rejectedFileList.length > 0) {
      const rejectedFilesName = rejectedFileList.map((result) => result.reason.file.name).join(', ');
      toastError(`${rejectedFilesName} 파일 업로드에 실패했습니다.`);
    }
  };

  const handleSubmit: SubmitHandler<TaskForm> = async (taskFormData) => {
    const { files, ...taskInfoForm } = taskFormData;
    const sortOrder = getLastSortOrder(taskFormData.statusId);

    // 일정 정보 등록
    const { data: taskInfo } = await createTaskInfoMutateAsync({ ...taskInfoForm, sortOrder });

    // 일정 파일 업로드
    if (files.length > 0) await taskFilesUpload(taskInfo.taskId, files);
    handleClose();
  };
  return (
    <ModalPortal>
      <ModalLayout onClose={handleClose}>
        <ModalTaskForm formId="createTaskForm" project={project} onSubmit={handleSubmit} />
        <ModalFormButton formId="createTaskForm" isCreate onClose={handleClose} />
      </ModalLayout>
    </ModalPortal>
  );
}
