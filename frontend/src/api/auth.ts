import { createApi } from "./utils/createApi";

export const registerUser = (email: string, password: string) =>
  createApi<number>({
    method: "post",
    url: "/auth/signup",
    params: { email, password },
  });
