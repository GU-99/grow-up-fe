export default class Validator {
  public static isEmptyString(value: string) {
    return value.trim().length === 0;
  }

  // ToDo: 정말로 공용 Validation 기능인가 생각해보기
  public static isDuplicatedName(nameList: string[], name: string, ignoreCase: boolean = true) {
    if (ignoreCase) {
      const lowerCaseNameList = nameList.map((n) => n.toLowerCase().trim());
      const lowerCaseName = name.toLowerCase().trim();
      return lowerCaseNameList.includes(lowerCaseName);
    }
    return nameList.includes(name);
  }
}
