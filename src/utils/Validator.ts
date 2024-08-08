import { DateTime } from 'luxon';

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
    const startDate = DateTime.fromJSDate(new Date(start));
    const endDate = DateTime.fromJSDate(new Date(end));
    const targetDate = DateTime.fromJSDate(new Date(target));
    return targetDate >= startDate && targetDate < endDate;
  }

  public static isEarlierStartDate(start: Date | string, end: Date | string) {
    const startDate = DateTime.fromJSDate(new Date(start));
    const endDate = DateTime.fromJSDate(new Date(end));
    return startDate <= endDate;
  }
}
