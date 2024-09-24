export type CustomFile = {
  fileId: string;
  fileName: string;
  file: File;
};

export type TaskFile = {
  fileId: number;
  fileName: string;
  fileUrl: string;
};

export type FileInfo = TaskFile | CustomFile;
