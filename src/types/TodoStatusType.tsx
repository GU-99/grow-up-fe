// ToDo: API 설계 완료시 데이터 타입 변경할 것
export type TodoStatus = {
  statusId: number;
  name: string;
  color: string;
  order: number;
};

export type TodoStatusForm = {
  name: string;
  color: string;
};

export type ColorInfo = {
  color: string;
  isDefault: boolean;
  isUsable: boolean;
};
