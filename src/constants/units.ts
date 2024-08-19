// ToDo: MEMORY_UNITS 으로 묶는거 고려해보기
export const KB = 1024;
export const MB = 1024 * KB;
export const GB = 1024 * MB;

// ToDo: DeepFreeze로 변경할 것, 상수 정의 컨벤션 적용할 것
export const fileSizeUnits = Object.freeze([
  { unit: 'GB', value: GB },
  { unit: 'MB', value: MB },
  { unit: 'KB', value: KB },
  { unit: 'B', value: 1 },
]);

// ToDo: TIME_UNITS 으로 묶는거 고려해보기
export const MILLISECOND = 1;
export const SECOND = 1000 * MILLISECOND;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
