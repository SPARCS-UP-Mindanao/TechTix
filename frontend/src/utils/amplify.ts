export const extractCustomState = (state: string) => state.split('-')[1] ?? '';

// https://github.com/aws-amplify/amplify-js/blob/main/packages/core/src/utils/urlSafeEncode.ts
export function urlSafeEncode(str: string) {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
}

// https://github.com/aws-amplify/amplify-js/blob/main/packages/core/src/utils/urlSafeDecode.ts
export function urlSafeDecode(hex: string) {
  if (!hex.trim()) {
    return '';
  }

  const matchArr = hex.match(/.{2}/g) || [];

  return matchArr.map((char) => String.fromCharCode(parseInt(char, 16))).join('');
}
