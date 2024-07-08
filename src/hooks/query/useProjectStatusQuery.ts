import { PROJECT_STATUS_COLORS } from '@constants/projectStatus';
import { STATUS_DUMMY } from '@mocks/mockData';
import { ProjectStatus, UsableColor } from '@/types/ProjectStatusType';

function getStatusNameList(projectStatusList: ProjectStatus[], excludedName?: ProjectStatus['name']) {
  const statusNameList = projectStatusList.map((projectStatus) => projectStatus.name);

  const statusNameSet = new Set(statusNameList);
  if (excludedName && statusNameSet.has(excludedName)) {
    statusNameSet.delete(excludedName);
  }

  return [...statusNameSet.values()];
}

function getStatusColorList(projectStatusList: ProjectStatus[], excludedColor?: ProjectStatus['color']) {
  const statusColorList = projectStatusList.map((projectStatus) => projectStatus.color);

  const statusColorSet = new Set(statusColorList);
  if (excludedColor && statusColorSet.has(excludedColor)) {
    statusColorSet.delete(excludedColor);
  }

  return [...statusColorSet.values()];
}

function getUsableStatusColorList(
  projectStatusList: ProjectStatus[],
  excludedColor?: ProjectStatus['color'],
): UsableColor[] {
  const statusColorMap = new Map();
  Object.values(PROJECT_STATUS_COLORS).forEach((color) => {
    statusColorMap.set(color, { color, isUsable: true });
  });

  projectStatusList.forEach(({ color }) => {
    if (!statusColorMap.has(color)) throw Error('[Error] 등록되지 않은 색상입니다.');

    if (excludedColor === color) return;
    statusColorMap.set(color, { ...statusColorMap.get(color), isUsable: false });
  });

  return [...statusColorMap.values()];
}

export default function useProjectStatusQuery(statusId?: ProjectStatus['statusId']) {
  // ToDo: ProjectStatus 관련 Query 로직 작성하기
  const projectStatusList = STATUS_DUMMY;
  const projectStatus = projectStatusList.find((status) => status.statusId === statusId);

  const initialValue = { name: projectStatus?.name || '', color: projectStatus?.color || '' };
  const nameList = getStatusNameList(projectStatusList, projectStatus?.name);
  const colorList = getStatusColorList(projectStatusList, projectStatus?.color);
  const usableColorList = getUsableStatusColorList(projectStatusList, projectStatus?.color);

  return { projectStatusList, initialValue, nameList, colorList, usableColorList };
}
