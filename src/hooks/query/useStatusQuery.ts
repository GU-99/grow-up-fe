import { PROJECT_STATUS_COLORS } from '@constants/projectStatus';
import { STATUS_DUMMY } from '@mocks/mockData';
import type { Project } from '@/types/ProjectType';
import type { ProjectStatus, UsableColor } from '@/types/ProjectStatusType';

function getStatusNameList(statusList: ProjectStatus[], excludedName?: ProjectStatus['name']) {
  const statusNameList = statusList.map((projectStatus) => projectStatus.name);

  const statusNameSet = new Set(statusNameList);
  if (excludedName && statusNameSet.has(excludedName)) {
    statusNameSet.delete(excludedName);
  }

  return [...statusNameSet.values()];
}

function getStatusColorList(statusList: ProjectStatus[], excludedColor?: ProjectStatus['color']) {
  const statusColorList = statusList.map((projectStatus) => projectStatus.color);

  const statusColorSet = new Set(statusColorList);
  if (excludedColor && statusColorSet.has(excludedColor)) {
    statusColorSet.delete(excludedColor);
  }

  return [...statusColorSet.values()];
}

function getUsableStatusColorList(statusList: ProjectStatus[], excludedColor?: ProjectStatus['color']): UsableColor[] {
  const statusColorMap = new Map();
  Object.values(PROJECT_STATUS_COLORS).forEach((color) => {
    statusColorMap.set(color, { color, isUsable: true });
  });

  statusList.forEach(({ color }) => {
    if (!statusColorMap.has(color)) throw Error('[Error] 등록되지 않은 색상입니다.');

    if (excludedColor === color) return;
    statusColorMap.set(color, { ...statusColorMap.get(color), isUsable: false });
  });

  return [...statusColorMap.values()];
}

// ToDo: ProjectStatus 관련 Query 로직 작성하기
// Query Key: project, projectId, status
export default function useStatusQuery(projectId: Project['projectId'], statusId?: ProjectStatus['statusId']) {
  const statusList = STATUS_DUMMY;

  const status = statusList.find((status) => status.statusId === statusId);
  const initialValue = { name: status?.name || '', color: status?.color || '' };
  const nameList = getStatusNameList(statusList, status?.name);
  const colorList = getStatusColorList(statusList, status?.color);
  const usableColorList = getUsableStatusColorList(statusList, status?.color);

  return { statusList, initialValue, nameList, colorList, usableColorList };
}
