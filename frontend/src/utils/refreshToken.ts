import { refreshUserToken } from "@/api/auth";
import { createRefresh } from "react-auth-kit";
import { getCookie } from "typescript-cookie";

const refreshApi = createRefresh({
  interval: 10,
  refreshApiCallback: async () => {
    try {
      const userId = getCookie("_auth_user")!;
      const refreshToken = getCookie("_auth_refresh")!;
      const { queryFn: refresh } = refreshUserToken(userId, refreshToken);
      const response = await refresh();
      return {
        isSuccess: true,
        newAuthToken: response.token,
        newRefreshToken: response.refreshToken,
        newAuthTokenExpireIn: response.expiresIn,
      };
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
        newAuthToken: "",
      };
    }
  },
});

export default refreshApi;
