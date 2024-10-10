import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAssignee,
  createTask,
  deleteAssignee,
  deleteTask,
  deleteTaskFile,
  findAssignees,
  findTaskFiles,
  findTaskList,
  updateTaskInfo,
  updateTaskOrder,
  uploadTaskFile,
} from '@services/taskService';
import useToast from '@hooks/useToast';
import {
  generateTaskAssigneesQueryKey,
  generateTaskFilesQueryKey,
  generateTasksQueryKey,
} from '@utils/queryKeyGenerator';

import type { User } from '@/types/UserType';
import type { Project } from '@/types/ProjectType';
import type {
  Task,
  TaskCreationForm,
  TaskListWithStatus,
  TaskOrder,
  TaskUpdateForm,
  TaskUploadForm,
} from '@/types/TaskType';
import { TaskFile } from '@/types/FileType';

function getTaskNameList(taskList: TaskListWithStatus[], excludedTaskName?: Task['taskName']) {
  const taskNameList = taskList
    .map((statusTask) => statusTask.tasks)
    .flat()
    .map((task) => task.taskName);

  return excludedTaskName ? taskNameList.filter((taskName) => taskName !== excludedTaskName) : taskNameList;
}

// 일정 생성
export function useCreateStatusTask(projectId: Project['projectId']) {
  const { toastError, toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const tasksQueryKey = generateTasksQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: (formData: TaskCreationForm) => createTask(projectId, formData),
    onError: () => {
      toastError('프로젝트 일정 등록 중 오류가 발생했습니다. 잠시 후 다시 등록해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('프로젝트 일정을 등록했습니다.');
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });

  return mutation;
}

// 일정 단일 파일 업로드
export function useUploadTaskFile(projectId: Project['projectId']) {
  const { toastError } = useToast();
  const mutation = useMutation({
    mutationFn: ({ taskId, file }: TaskUploadForm) =>
      uploadTaskFile(projectId, taskId, file, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onError: (error, { file }) => toastError(`${file.name} 파일 업로드에 실패했습니다.`),
  });

  return mutation;
}

// 상태별 일정 목록 조회
export function useReadStatusTasks(projectId: Project['projectId'], taskId?: Task['taskId']) {
  const {
    data: statusTaskList = [],
    isLoading: isTaskLoading,
    isError: isTaskError,
    error: taskError,
  } = useQuery({
    queryKey: generateTasksQueryKey(projectId),
    queryFn: async () => {
      const { data } = await findTaskList(projectId);
      return data;
    },
  });

  const task = useMemo(
    () =>
      statusTaskList
        .map((statusTask) => statusTask.tasks)
        .flat()
        .find((task) => task.taskId === taskId),
    [statusTaskList, taskId],
  );
  const taskNameList = useMemo(() => getTaskNameList(statusTaskList, task?.taskName), [statusTaskList, task?.taskName]);

  return { task, statusTaskList, taskNameList, isTaskLoading, isTaskError, taskError };
}

// 일정 목록 순서 변경
export function useUpdateTasksOrder(projectId: Project['projectId']) {
  const { toastError } = useToast();
  const queryClient = useQueryClient();
  const tasksQueryKey = generateTasksQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: (newStatusTaskList: TaskListWithStatus[]) => {
      const taskOrders: TaskOrder[] = newStatusTaskList
        .map((statusTask) => {
          const { statusId, tasks } = statusTask;
          return tasks.map(({ taskId, sortOrder }) => ({ statusId, taskId, sortOrder }));
        })
        .flat();
      return updateTaskOrder(projectId, { tasks: taskOrders });
    },
    onMutate: async (newStatusTaskList: TaskListWithStatus[]) => {
      await queryClient.cancelQueries({ queryKey: tasksQueryKey });

      const previousStatusTaskList = queryClient.getQueryData(tasksQueryKey);
      queryClient.setQueryData(tasksQueryKey, newStatusTaskList);

      return { previousStatusTaskList };
    },
    onError: (err, newStatusTaskList, context) => {
      toastError('일정 순서 변경에실패 했습니다. 잠시 후 다시 시도해 주세요.');
      queryClient.setQueryData(tasksQueryKey, context?.previousStatusTaskList);
    },
  });

  return mutation;
}

// 일정 수행자 목록 조회
export function useReadAssignees(projectId: Project['projectId'], taskId: Task['taskId']) {
  const {
    data: assigneeList = [],
    isLoading: isAssigneeLoading,
    error: assigneeError,
    isError: isAssigneeError,
  } = useQuery({
    queryKey: generateTaskAssigneesQueryKey(projectId, taskId),
    queryFn: async () => {
      const { data } = await findAssignees(projectId, taskId);
      return data;
    },
  });

  return { assigneeList, isAssigneeLoading, assigneeError, isAssigneeError };
}

// 일정 파일 목록 조회
export function useReadTaskFiles(projectId: Project['projectId'], taskId: Task['taskId']) {
  const {
    data: taskFileList = [],
    isLoading: isTaskFileLoading,
    error: taskFileError,
    isError: isTaskFileError,
  } = useQuery({
    queryKey: generateTaskFilesQueryKey(projectId, taskId),
    queryFn: async () => {
      const { data } = await findTaskFiles(projectId, taskId);
      return data;
    },
  });
  return { taskFileList, isTaskFileLoading, taskFileError, isTaskFileError };
}

// 일정 정보 수정
export function useUpdateTaskInfo(projectId: Project['projectId'], taskId: Task['taskId']) {
  const { toastError, toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const tasksQueryKey = generateTasksQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: (formData: TaskUpdateForm) => updateTaskInfo(projectId, taskId, formData),
    onError: () => toastError('일정 정보 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('일정 정보를 수정했습니다.');
      queryClient.invalidateQueries({ queryKey: tasksQueryKey });
    },
  });

  return mutation;
}

// 일정 삭제
export function useDeleteTask(projectId: Project['projectId']) {
  const { toastError, toastSuccess } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (taskId: Task['taskId']) => deleteTask(projectId, taskId),
    onError: () => toastError('일정 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    onSuccess: (res, taskId) => {
      const tasksQueryKey = generateTasksQueryKey(projectId);
      const filesQueryKey = generateTaskFilesQueryKey(projectId, taskId);
      const assigneesQueryKey = generateTaskAssigneesQueryKey(projectId, taskId);

      toastSuccess('일정을 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: tasksQueryKey, exact: true });
      queryClient.removeQueries({ queryKey: filesQueryKey, exact: true });
      queryClient.removeQueries({ queryKey: assigneesQueryKey, exact: true });
    },
  });

  return mutation;
}

// 일정 수행자 추가
export function useAddAssignee(projectId: Project['projectId'], taskId: Task['taskId']) {
  const { toastError, toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const taskAssigneesQueryKey = generateTaskAssigneesQueryKey(projectId, taskId);

  const mutation = useMutation({
    mutationFn: (userId: User['userId']) => addAssignee(projectId, taskId, userId),
    onError: () => {
      toastError('수행자 추가에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('수행자를 추가했습니다.');
      queryClient.invalidateQueries({ queryKey: taskAssigneesQueryKey });
    },
  });

  return mutation;
}

// 일정 수행자 삭제
export function useDeleteAssignee(projectId: Project['projectId'], taskId: Task['taskId']) {
  const { toastError, toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const taskAssigneesQueryKey = generateTaskAssigneesQueryKey(projectId, taskId);

  const mutation = useMutation({
    mutationFn: (userId: User['userId']) => deleteAssignee(projectId, taskId, userId),
    onError: () => {
      toastError('수행자 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    },
    onSuccess: () => {
      toastSuccess('수행자를 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: taskAssigneesQueryKey });
    },
  });

  return mutation;
}

// 일정 파일 삭제
export function useDeleteTaskFile(projectId: Project['projectId'], taskId: Task['taskId']) {
  const { toastSuccess, toastError } = useToast();
  const queryClient = useQueryClient();
  const taskFilesQueryKey = generateTaskFilesQueryKey(projectId, taskId);

  const mutation = useMutation({
    mutationFn: (fileId: TaskFile['fileId']) => deleteTaskFile(projectId, taskId, fileId),
    onError: () => toastError('일정 파일 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('일정 파일을 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: taskFilesQueryKey });
    },
  });

  return mutation;
}
