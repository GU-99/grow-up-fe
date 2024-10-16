export type TeamUser = {
  teamId: number;
  userId: number;
  roleId: number;
  isPendingApproval: boolean;
};

export type ProjectUser = {
  projectId: number;
  userId: number;
  roleId: number;
};

export type TaskUser = {
  taskId: number;
  userId: number;
};

export type UploadTaskFile = {
  fileId: number;
  taskId: number;
  fileName: string;
  uploadName: string;
};

export type TaskFileForMemory = {
  fileId: number;
  taskId: number;
  file: Blob;
  uploadName: string;
};
