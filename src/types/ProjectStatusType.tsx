// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type ProjectStatus = {
  statusId: number;
  projectId: number;
  name: string;
  color: string;
  order: number;
};

export type ProjectStatusForm = Pick<ProjectStatus, 'color' | 'name'>;

export type UsableColor = Pick<ProjectStatus, 'color'> & { isUsable: boolean };
