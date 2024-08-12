export const KB = 1024;
export const MB = 1024 * KB;
export const GB = 1024 * MB;

export const fileSizeUnits = Object.freeze([
  { unit: 'GB', value: GB },
  { unit: 'MB', value: MB },
  { unit: 'KB', value: KB },
  { unit: 'B', value: 1 },
]);
