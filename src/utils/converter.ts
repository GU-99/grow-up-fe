import { fileSizeUnits } from '@constants/units';

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

export const generateDummyToken = (userId: number) => {
  const header = { alg: 'none', typ: 'JWT' };
  const payload = { userId };
  const signature = 'mocked-signature';

  const base64UrlEncode = (obj: object) => {
    const jsonString = JSON.stringify(obj);
    // 일반 Base64 인코딩
    const base64 = btoa(decodeURIComponent(encodeURIComponent(jsonString)));
    // URL-safe 변환: `+` -> `-`, `/` -> `_`, `=` 제거
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const base64UrlHeader = base64UrlEncode(header);
  const base64UrlPayload = base64UrlEncode(payload);

  return `${base64UrlHeader}.${base64UrlPayload}.${signature}`;
};

export const convertTokenToUserId = (accessToken: string) => {
  const tokenParts = accessToken.split('.');
  if (tokenParts.length !== 3) return 0;

  const payload = tokenParts[1];

  // base64url 디코딩을 위한 처리
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const base64WithPadding = base64 + padding;

  try {
    // base64 페이로드 디코딩
    const decodedPayload = JSON.parse(atob(base64WithPadding));
    const { userId } = decodedPayload;

    return userId;
  } catch (error) {
    console.error('토큰 페이로드 디코딩 오류:', error);
    return 0;
  }
};
