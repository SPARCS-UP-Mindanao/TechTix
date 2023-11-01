import { createRefresh } from 'react-auth-kit';
import { getCookie } from 'typescript-cookie';
import { refreshUserToken } from '@/api/auth';

const refreshApi = createRefresh({
  interval: 10,
  refreshApiCallback: async () => {
    try {
      const userId = getCookie('_auth_user')!;
      const refreshToken = getCookie('_auth_refresh')!;
      const { queryFn: refresh } = refreshUserToken(userId, refreshToken);
      const response = await refresh();
      if (response.status === 200) {
        return {
          isSuccess: true,
          newAuthToken: response.data.token,
          newRefreshToken: response.data.refreshToken,
          newAuthTokenExpireIn: response.data.expiresIn
        };
      } else {
        return {
          isSuccess: false,
          newAuthToken: ''
        };
      }
    } catch (error) {
      console.error(error);
      return {
        isSuccess: false,
        newAuthToken: ''
      };
    }
  }
});

export default refreshApi;
