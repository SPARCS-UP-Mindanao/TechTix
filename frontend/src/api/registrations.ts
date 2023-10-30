import { RegisterUserInfo } from "@/model/registrations";
import { createApi } from "@/api/utils/createApi";

export const registerUserInEvent = (userInfo: RegisterUserInfo) =>
  createApi<RegisterUserInfo>({
    method: "post",
    url: "/registrations",
    params: { userInfo },
  });