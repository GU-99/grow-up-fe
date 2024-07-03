export default function deepClone<T>(obj: T): T {
  if (obj === undefined || obj === null) return obj;

  if (typeof obj !== 'object') return obj;

  if (obj instanceof Date) return new Date(obj.getTime()) as T;

  if (Array.isArray(obj)) {
    const arrCopy = [] as unknown[];
    obj.forEach((item) => arrCopy.push(deepClone(item)));
    return arrCopy as T;
  }

  const objCopy = {} as { [key: string]: unknown };
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objCopy[key] = deepClone((obj as { [key: string]: unknown })[key]);
    }
  });

  return objCopy as T;
}
