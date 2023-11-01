import { createApi } from '@/api/utils/createApi';
import { RegisterUserInfo } from '@/model/registrations';

export const registerUserInEvent = (userInfo: RegisterUserInfo) =>
  createApi<RegisterUserInfo>({
    method: 'post',
    url: '/registrations',
    params: { ...userInfo }
  });
