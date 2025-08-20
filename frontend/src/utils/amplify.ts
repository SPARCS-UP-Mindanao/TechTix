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
