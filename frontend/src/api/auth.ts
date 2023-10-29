import { createApi } from "./utils/createApi";
import { signInFunctionParams } from "react-auth-kit/dist/types";

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  idToken: string;
  session: string;
  sub: string;
}

const auth: { authorize: boolean; apiService: "auth" | "events" } = {
  authorize: false,
  apiService: "auth",
};

const mapLoginResponseToSignInParameters = (
  response: LoginResponse
): signInFunctionParams => {
  return {
    token: response.accessToken,
    expiresIn: response.expiresIn,
    tokenType: response.tokenType,
    refreshToken: response.refreshToken,
    refreshTokenExpireIn: 60 * 24 * 30,
    authState: {
      userId: response.sub,
    },
  };
};

export const registerUser = (email: string, password: string) =>
  createApi<number>({
    method: "post",
    ...auth,
    url: "/auth/signup",
    params: { email, password },
  });

export const loginUser = (email: string, password: string) =>
  createApi<LoginResponse, signInFunctionParams>({
    method: "post",
    ...auth,
    url: "/auth/login",
    params: { email, password },
    output: mapLoginResponseToSignInParameters,
  });

export const logoutUser = (accessToken: string) =>
  createApi({
    method: "post",
    ...auth,
    url: "/auth/logout",
    params: { accessToken },
  });

export const refreshUserToken = (sub: string, refreshToken: string) =>
  createApi({
    method: "post",
    ...auth,
    url: "/auth/refresh",
    params: { sub, refreshToken },
    output: mapLoginResponseToSignInParameters,
  });
