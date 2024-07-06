export function generatePrefixId(id: number | string, prefix: string, delimiter: string = '-') {
  return `${prefix}${delimiter}${id}`;
}

export function parsePrefixId(prefixId: string, delimiter: string = '-') {
  const result = prefixId.split(delimiter);
  return result[result.length - 1];
}
