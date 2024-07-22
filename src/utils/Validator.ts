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

  // ToDo: 프로젝트 기간 설정시 endDate를 23:59:59로 처리할지, 다음날 00:00:00으로 할지 대화해볼것
  public static isWithinDateRange(start: Date, end: Date, target: Date) {
    const startDate = DateTime.fromJSDate(start);
    const endDate = DateTime.fromJSDate(end);
    const targetDate = DateTime.fromJSDate(target);
    return targetDate >= startDate && targetDate <= endDate;
  }
}
