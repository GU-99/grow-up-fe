import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useToast from '@hooks/useToast';
import { createStatus, deleteStatus, getStatusList, updateStatus, updateStatusesOrder } from '@services/statusService';
import { generateProjectQueryKey, generateStatusesQueryKey, generateTasksQueryKey } from '@utils/queryKeyGenerator';
import type { Project } from '@/types/ProjectType';
import type { TaskListWithStatus } from '@/types/TaskType';
import type { ProjectStatus, ProjectStatusForm, StatusOrder } from '@/types/ProjectStatusType';

// 프로젝트 상태 목록 조회
// ToDo: React Query 로직과 initialValue, nameList 등을 구하는 로직이 사실 관련이 없는 것 같음. 분리 고려하기.
export function useReadStatuses(projectId: Project['projectId']) {
  const {
    data: statusList = [],
    isLoading: isStatusesLoading,
    isError: isStatusesError,
    error: statusesError,
  } = useQuery({
    queryKey: generateStatusesQueryKey(projectId),
    queryFn: async () => {
      const { data } = await getStatusList(projectId);
      return data;
    },
  });

  return {
    statusList,
    isStatusesLoading,
    isStatusesError,
    statusesError,
  };
}

// 단일 상태 상세 조회
export function useReadStatus(projectId: Project['projectId'], statusId: ProjectStatus['statusId']) {
  const { statusList, isStatusesLoading, isStatusesError, statusesError } = useReadStatuses(projectId);

  const status = useMemo(() => statusList.find((status) => status.statusId === statusId), [statusList, statusId]);

  return { status, isStatusesLoading, isStatusesError, statusesError };
}

// 프로젝트 상태 생성
export function useCreateStatus(projectId: Project['projectId']) {
  const { toastSuccess, toastError } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: ProjectStatusForm) => createStatus(projectId, formData),
    onError: () => toastError('프로젝트 상태 등록을 실패했습니다.  잠시 후 다시 등록해 주세요.'),
    onSuccess: () => {
      toastSuccess('프로젝트 상태를 등록하였습니다.');
      queryClient.invalidateQueries({
        queryKey: generateProjectQueryKey(projectId),
      });
    },
  });

  return mutation;
}

// 프로젝트 상태 수정
export function useUpdateStatus(projectId: Project['projectId'], statusId: ProjectStatus['statusId']) {
  const { toastSuccess, toastError } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: ProjectStatusForm) => updateStatus(projectId, statusId, formData),
    onError: () => toastError('프로젝트 상태 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('프로젝트 상태를 수정했습니다.');
      queryClient.invalidateQueries({
        queryKey: generateProjectQueryKey(projectId),
      });
    },
  });

  return mutation;
}

// 프로젝트 상태 삭제
export function useDeleteStatus(projectId: Project['projectId']) {
  const { toastError, toastSuccess } = useToast();
  const queryClient = useQueryClient();
  const tasksQueryKeys = generateTasksQueryKey(projectId);
  const statusesQueryKey = generateStatusesQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: (statusId: ProjectStatus['statusId']) => deleteStatus(projectId, statusId),
    onError: () => toastError('프로젝트 상태 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
    onSuccess: () => {
      toastSuccess('프로젝트 상태를 삭제했습니다.');
      queryClient.invalidateQueries({ queryKey: tasksQueryKeys, exact: true });
      queryClient.invalidateQueries({ queryKey: statusesQueryKey, exact: true });
    },
  });

  return mutation;
}

// 상태 목록 순서 정렬
export function useUpdateStatusesOrder(projectId: Project['projectId']) {
  const { toastError } = useToast();
  const queryClient = useQueryClient();
  const TasksQueryKey = generateTasksQueryKey(projectId);
  const statusesQueryKey = generateStatusesQueryKey(projectId);

  const mutation = useMutation({
    mutationFn: (newStatusTaskList: TaskListWithStatus[]) => {
      const statusOrders: StatusOrder[] = newStatusTaskList.map(({ statusId, sortOrder }) => ({ statusId, sortOrder }));
      return updateStatusesOrder(projectId, { statuses: statusOrders });
    },
    onMutate: async (newStatusTaskList: TaskListWithStatus[]) => {
      await queryClient.cancelQueries({ queryKey: TasksQueryKey });

      const previousStatusTaskList = queryClient.getQueryData(TasksQueryKey);
      queryClient.setQueryData(TasksQueryKey, newStatusTaskList);

      return { previousStatusTaskList };
    },
    onError: (error, newStatusTaskList, context) => {
      toastError('프로젝트 상태 순서 변경에 실패했습니다. 잠시 후 다시 진행해 주세요.');
      queryClient.setQueryData(TasksQueryKey, context?.previousStatusTaskList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: statusesQueryKey, type: 'all' });
    },
  });

  return mutation;
}
