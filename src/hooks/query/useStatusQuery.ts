import { PROJECT_STATUS_COLORS } from '@constants/projectStatus';
import { useQuery } from '@tanstack/react-query';
import { getStatusList } from '@services/statusService';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, UsableColor } from '@/types/ProjectStatusType';

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
export default function useStatusQuery(projectId: Project['projectId'], statusId?: ProjectStatus['statusId']) {
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

  const status = statusList.find((status) => status.statusId === statusId);
  const initialValue = { name: status?.statusName || '', colorCode: status?.colorCode || '' };
  const nameList = getStatusNameList(statusList, status?.statusName);
  const colorList = getStatusColorList(statusList, status?.colorCode);
  const usableColorList = getUsableStatusColorList(statusList, status?.colorCode);

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
