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

  public static isWithinDateRange(start: Date, end: Date, target: Date) {
    const startDate = DateTime.fromJSDate(start);
    const endDate = DateTime.fromJSDate(end);
    const targetDate = DateTime.fromJSDate(target);
    return targetDate >= startDate && targetDate < endDate;
  }
}
