// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type ProjectStatus = {
  statusId: number;
  projectId: number;
  name: string;
  colorCode: string;
  order: number;
};

export type ProjectStatusForm = Pick<ProjectStatus, 'colorCode' | 'name'>;

export type UsableColor = Pick<ProjectStatus, 'colorCode'> & { isUsable: boolean };
