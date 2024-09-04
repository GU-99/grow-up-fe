import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useToast from '@hooks/useToast';
import { PROJECT_STATUS_COLORS } from '@constants/projectStatus';
import { createStatus, getStatusList } from '@services/statusService';

import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, ProjectStatusForm, UsableColor } from '@/types/ProjectStatusType';

function getStatusNameList(statusList: ProjectStatus[], excludedName?: ProjectStatus['statusName']) {
  const statusNameList = statusList.map((projectStatus) => projectStatus.statusName);

  const statusNameSet = new Set(statusNameList);
  if (excludedName && statusNameSet.has(excludedName)) {
    statusNameSet.delete(excludedName);
  }

  return [...statusNameSet.values()];
}

function getStatusColorList(statusList: ProjectStatus[], excludedColor?: ProjectStatus['colorCode']) {
  const statusColorList = statusList.map((projectStatus) => projectStatus.colorCode);

  const statusColorSet = new Set(statusColorList);
  if (excludedColor && statusColorSet.has(excludedColor)) {
    statusColorSet.delete(excludedColor);
  }

  return [...statusColorSet.values()];
}

function getUsableStatusColorList(
  statusList: ProjectStatus[],
  excludedColor?: ProjectStatus['colorCode'],
): UsableColor[] {
  const statusColorMap = new Map();
  Object.values(PROJECT_STATUS_COLORS).forEach((colorCode) => {
    statusColorMap.set(colorCode, { colorCode, isUsable: true });
  });

  statusList.forEach(({ colorCode }) => {
    if (!statusColorMap.has(colorCode)) throw Error('[Error] 등록되지 않은 색상입니다.');

    if (excludedColor === colorCode) return;
    statusColorMap.set(colorCode, { ...statusColorMap.get(colorCode), isUsable: false });
  });

  return [...statusColorMap.values()];
}

// ToDo: ProjectStatus 관련 Query 로직 작성하기
// ToDo: React Query 로직과 initialValue, nameList 등을 구하는 로직이 사실 관련이 없는 것 같음. 분리 고려하기.
export function useReadStatuses(projectId: Project['projectId'], statusId?: ProjectStatus['statusId']) {
  const {
    data: statusList = [],
    isLoading: isStatusLoading,
    isError: isStatusError,
    error: statusError,
  } = useQuery({
    queryKey: ['projects', projectId, 'statuses'],
    queryFn: async () => {
      const { data } = await getStatusList(projectId);
      return data;
    },
  });

  const status = useMemo(() => statusList.find((status) => status.statusId === statusId), [statusList, statusId]);
  const initialValue = useMemo(
    () => ({
      statusName: status?.statusName || '',
      colorCode: status?.colorCode || '',
      sortOrder: status?.sortOrder || statusList.length,
    }),
    [status],
  );
  const nameList = useMemo(() => getStatusNameList(statusList, status?.statusName), [statusList, status?.statusName]);
  const colorList = useMemo(() => getStatusColorList(statusList, status?.colorCode), [statusList, status?.colorCode]);
  const usableColorList = useMemo(
    () => getUsableStatusColorList(statusList, status?.colorCode),
    [statusList, status?.colorCode],
  );

  return {
    statusList,
    isStatusLoading,
    isStatusError,
    statusError,
    initialValue,
    nameList,
    colorList,
    usableColorList,
  };
}

export function useCreateStatus(projectId: Project['projectId']) {
  const { toastSuccess } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: ProjectStatusForm) => createStatus(projectId, formData),
    onSuccess: () => {
      toastSuccess('프로젝트 상태를 추가하였습니다.');
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId, 'statuses'],
      });
    },
  });

  return mutation;
}
