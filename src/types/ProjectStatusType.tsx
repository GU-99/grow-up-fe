export type ProjectStatus = {
  statusId: number;
  projectId: number;
  name: string;
  colorCode: string;
  sortOrder: number;
};

export type ProjectStatusForm = Pick<ProjectStatus, 'name' | 'colorCode'>;

export type UsableColor = Pick<ProjectStatus, 'colorCode'> & { isUsable: boolean };
