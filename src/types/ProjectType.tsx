export type Project = {
  projectId: number;
  teamId: number;
  projectName: string;
  content: string;
  startDate: Date | null;
  endDate: Date | null;
};
