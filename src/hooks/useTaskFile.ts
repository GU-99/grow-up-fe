import { useQueryClient } from '@tanstack/react-query';
import useToast from '@hooks/useToast';
import { useUploadTaskFile } from '@hooks/query/useTaskQuery';
import { TASK_SETTINGS } from '@constants/settings';
import Validator from '@utils/Validator';
import { convertBytesToString } from '@utils/converter';
import { generateTasksQueryKey } from '@utils/queryKeyGenergator';

import type { Task } from '@/types/TaskType';
import type { Project } from '@/types/ProjectType';
import type { FileUploadFailureResult, FileUploadSuccessResult } from '@/types/FileType';

export default function useTaskFile(projectId: Project['projectId']) {
  const { toastSuccess, toastWarn } = useToast();
  const queryClient = useQueryClient();
  const { mutateAsync: createTaskFileMutateAsync } = useUploadTaskFile(projectId);

  const isValidTaskFile = (file: File) => {
    if (!Validator.isValidFileName(file.name)) {
      toastWarn(
        `${file.name} 파일은 업로드 할 수 없습니다. 파일명은 한글, 영어, 숫자, 특수기호(.-_), 공백문자만 가능합니다.`,
      );
      return false;
    }

    if (!Validator.isValidFileExtension(TASK_SETTINGS.FILE_TYPES, file.type)) {
      toastWarn(`${file.name} 파일은 업로드 할 수 없습니다. 지원하지 않는 파일 타입입니다.`);
      return false;
    }

    if (!Validator.isValidFileSize(TASK_SETTINGS.MAX_FILE_SIZE, file.size)) {
      toastWarn(
        `${file.name} 파일은 업로드 할 수 없습니다. ${convertBytesToString(TASK_SETTINGS.MAX_FILE_SIZE)} 이하의 파일만 업로드 가능합니다.`,
      );
      return false;
    }

    return true;
  };

  const taskFilesUpload = async (taskId: Task['taskId'], files: File[]) => {
    const createFilePromises = files.map((file) =>
      createTaskFileMutateAsync({ taskId, file }).then(
        (): FileUploadSuccessResult => ({ status: 'fulfilled', file }),
        (error): FileUploadFailureResult => ({ status: 'rejected', file, error }),
      ),
    );

    const results = (await Promise.allSettled(createFilePromises)) as PromiseFulfilledResult<
      FileUploadSuccessResult | FileUploadFailureResult
    >[];
    queryClient.invalidateQueries({ queryKey: generateTasksQueryKey(projectId) });

    const fulfilledFileList: FileUploadSuccessResult[] = [];
    const rejectedFileList: FileUploadFailureResult[] = [];
    results
      .map((result) => result.value)
      .forEach((result) => {
        if (result.status === 'fulfilled') fulfilledFileList.push(result);
        else rejectedFileList.push(result);
      });

    if (fulfilledFileList.length > 0) toastSuccess(`${fulfilledFileList.length}개의 파일 업로드에 성공했습니다.`);
  };

  return { isValidTaskFile, taskFilesUpload };
}
