import { createApi } from './utils/createApi';

export const getTest = (name: string) =>
  createApi({
    url: '/pokemon',
    params: { name }
  });
