export type ProjectStatus = {
  statusId: number;
  projectId: number;
  statusName: string;
  colorCode: string;
  sortOrder: number;
};

export type StatusOrder = Pick<ProjectStatus, 'statusId' | 'sortOrder'>;
export type StatusOrderForm = { statuses: StatusOrder[] };

export type ProjectStatusForm = Pick<ProjectStatus, 'statusName' | 'colorCode' | 'sortOrder'>;

export type UsableColor = Pick<ProjectStatus, 'colorCode'> & { isUsable: boolean };
