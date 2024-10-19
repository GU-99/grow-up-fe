import { DateTime } from 'luxon';
import { FILE_NAME_REGEX } from '@constants/regex';

export default class Validator {
  public static isEmptyString(value: string) {
    return value.trim().length === 0;
  }

  public static isDuplicatedName(nameList: string[], name: string, ignoreCase: boolean = true) {
    if (ignoreCase) {
      const lowerCaseNameList = nameList.map((n) => n.toLowerCase().trim());
      const lowerCaseName = name.toLowerCase().trim();
      return lowerCaseNameList.includes(lowerCaseName);
    }
    return nameList.includes(name);
  }

  public static isWithinDateRange(start: Date | string, end: Date | string, target: Date | string) {
    const startDate = DateTime.fromJSDate(new Date(start)).startOf('day');
    const endDate = DateTime.fromJSDate(new Date(end)).startOf('day');
    const targetDate = DateTime.fromJSDate(new Date(target)).startOf('day');
    return targetDate >= startDate && targetDate < endDate;
  }

  public static isEarlierStartDate(start: Date | string, end: Date | string) {
    const startDate = DateTime.fromJSDate(new Date(start)).startOf('day');
    const endDate = DateTime.fromJSDate(new Date(end)).startOf('day');
    return startDate <= endDate;
  }

  public static isPositiveNumberWithZero(num: number) {
    return typeof num === 'number' && num >= 0;
  }

  public static isValidFileCount(maxCount: number, currentCount: number) {
    if (!Validator.isPositiveNumberWithZero(maxCount) || !Validator.isPositiveNumberWithZero(currentCount)) {
      throw Error('파일 개수는 음수가 될 수 없습니다.');
    }
    return maxCount >= currentCount;
  }

  public static isValidFileSize(maxSize: number, fileSize: number) {
    if (!Validator.isPositiveNumberWithZero(maxSize) || !Validator.isPositiveNumberWithZero(fileSize)) {
      throw Error('파일 크기는 음수가 될 수 없습니다.');
    }
    return maxSize >= fileSize;
  }

  public static isValidFileExtension(acceptFileTypes: string[], fileType: string) {
    return acceptFileTypes.some((acceptFileType) => acceptFileType.toLowerCase() === fileType.toLowerCase());
  }

  public static isValidFileName(fileName: string) {
    const fileNameRegex = new RegExp(FILE_NAME_REGEX);
    return fileNameRegex.test(fileName);
  }
}
