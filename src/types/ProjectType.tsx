// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type Project = {
  projectId: number;
  teamId: number;
  projectName: string;
  content: string;
  startDate: Date | null;
  endDate: Date | null;
};
