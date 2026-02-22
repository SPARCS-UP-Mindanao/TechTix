import { CookieAttributes } from 'node_modules/typescript-cookie/dist/types';

export const cookieConfiguration: CookieAttributes = {
  path: '/',
  domain: window.location.hostname,
  secure: true
};
