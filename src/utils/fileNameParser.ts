export function fileNameParser(fullFileName: string) {
  const lastDotIndex = fullFileName.lastIndexOf('.');
  if (lastDotIndex === -1) return { fileName: fullFileName, extension: '' };

  const fileName = fullFileName.slice(0, lastDotIndex);
  const extension = fullFileName.slice(lastDotIndex + 1);
  return { fileName, extension };
}
