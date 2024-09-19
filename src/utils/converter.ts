import { fileSizeUnits } from '@/constants/units';

export function generatePrefixId(id: number | string, prefix: string, delimiter: string = '-') {
  return `${prefix}${delimiter}${id}`;
}

export function parsePrefixId(prefixId: string, delimiter: string = '-') {
  const result = prefixId.split(delimiter);
  return result[result.length - 1];
}

export const convertBytesToString = (bytes: number) => {
  const formatSize = (size: number, unit: string) => `${size.toFixed(2)}${unit}`;

  const { unit, value } = fileSizeUnits.find(({ value: sizeInBytes }) => bytes >= sizeInBytes) || {
    unit: 'B',
    value: 1,
  };
  return formatSize(bytes / value, unit);
};

export const generateSecureUserId = (id: string) => {
  const secureLength = id.length >= 4 ? 2 : 1;
  return `${id.slice(0, -secureLength)}${'*'.repeat(secureLength)}`;
};
