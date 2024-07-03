export default function deepClone<T>(data: T): T {
  if (data === undefined || data === null) return data;

  if (typeof data !== 'object') return data;

  if (data instanceof Date) return new Date(data.getTime()) as T;

  if (Array.isArray(data)) {
    const arrCopy = [] as unknown[];
    data.forEach((item) => arrCopy.push(deepClone(item)));
    return arrCopy as T;
  }

  const objCopy = {} as { [key: string]: unknown };
  Object.keys(data).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      objCopy[key] = deepClone((data as { [key: string]: unknown })[key]);
    }
  });

  return objCopy as T;
}
