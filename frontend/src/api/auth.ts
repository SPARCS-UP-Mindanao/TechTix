import { CurrentUser } from '@/model/auth';
import { createApi } from './utils/createApi';

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  idToken: string;
  session: string;
  sub: string;
}

export const sendCodeForForgotPassword = (email: string) =>
  createApi({
    method: 'post',
    apiService: 'auth',
    url: '/auth/forgot-password',
    body: { email }
  });

export const resetPassword = (email: string, confirmationCode: string, password: string) =>
  createApi({
    method: 'post',
    apiService: 'auth',
    url: '/auth/reset-password',
    body: { email, code: confirmationCode, password }
  });

export const updatePassword = (email: string, prevPassword: string, newPassword: string) =>
  createApi({
    method: 'post',
    apiService: 'auth',
    url: '/admin/auth/update-password',
    body: { email, prevPassword, newPassword }
  });

export const getCurrentUser = () => createApi<CurrentUser>({ apiService: 'auth', authorize: true, url: '/admin/auth/current-user' });
