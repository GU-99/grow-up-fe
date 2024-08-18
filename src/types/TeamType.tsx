// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type Team = {
  teamId: number;
  name: string;
  content: string;
};

export interface TeamInvitation {
  teamId: number;
  teamName: string;
  teamContent: string;
}
