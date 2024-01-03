import { signInFunctionParams } from 'react-auth-kit/dist/types';
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

const mapLoginResponseToSignInParameters = (response: LoginResponse): signInFunctionParams => {
  return {
    token: response.accessToken,
    expiresIn: response.expiresIn,
    tokenType: response.tokenType,
    refreshToken: response.refreshToken,
    refreshTokenExpireIn: 60 * 24 * 30,
    authState: {
      userId: response.sub
    }
  };
};

export const loginUser = (email: string, password: string) =>
  createApi<LoginResponse, signInFunctionParams>({
    method: 'post',
    apiService: 'auth',
    url: '/auth/login',
    body: { email, password },
    output: mapLoginResponseToSignInParameters
  });

export const logoutUser = (accessToken: string) =>
  createApi({
    method: 'post',
    apiService: 'auth',
    url: '/auth/logout',
    body: { accessToken }
  });

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

export type UserGroups = 'super_admin' | 'admin';
export interface CurrentUser {
  sub: string;
  'cognito:groups': UserGroups[];
  username: string;
}

export const getCurrentUser = () => createApi<CurrentUser>({ apiService: 'auth', authorize: true, url: '/admin/auth/current-user' });
