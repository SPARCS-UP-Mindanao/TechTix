export async function getAmplifyConfig() {
  const isAmplifyCi = !!import.meta.env.VITE_IS_AMPLIFY_CI;
  const path = isAmplifyCi ? '../../amplify_outputs.json' : '../../dummy_amplify_outputs.json';

  try {
    const config = await import(path);
    return config.default;
  } catch {
    console.warn('amplify_outputs.json not found. Returning empty config.');
    return {};
  }
}

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
