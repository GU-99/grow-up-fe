export type CustomFile = {
  fileId: string;
  fileName: string;
  file: File;
};

export type TaskFile = {
  fileId: number;
  fileName: string;
  uploadName: string;
};

export type FileInfo = TaskFile | CustomFile;

export type FileUploadSuccessResult = {
  status: 'fulfilled';
  file: File;
};
export type FileUploadFailureResult = {
  status: 'rejected';
  file: File;
  error: unknown;
};
