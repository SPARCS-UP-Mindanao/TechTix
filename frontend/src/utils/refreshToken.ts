import axios, { AxiosInstance } from 'axios';
import { createRefresh } from 'react-auth-kit';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

const refreshApi = createRefresh({
  interval: 10,
  refreshApiCallback: async () => {
    const userId = getCookie('_auth_user')!;
    if (!userId) {
      return {
        isSuccess: false,
        newAuthToken: ''
      };
    }

    try {
      const refreshToken = getCookie('_auth_refresh')!;
      const response = await refreshAccessToken(refreshToken, userId);
      if (response.status === 200) {
        setCookie('_auth', response.data.accessToken);
        return {
          isSuccess: true,
          newAuthToken: response.data.token,
          newRefreshToken: response.data.refreshToken,
          newAuthTokenExpireIn: response.data.expiresIn
        };
      }

      return {
        isSuccess: false,
        newAuthToken: ''
      };
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

export const refreshAccessToken = async (refreshToken: string, userId: string) => {
  return await axios.post(`${import.meta.env.VITE_API_AUTH_BASE_URL}/auth/refresh`, {
    refreshToken: refreshToken,
    sub: userId
  });
};

export const refreshOnIntercept = (api: AxiosInstance) => {
  return api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is due to an expired access token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // mark the request to avoid infinite retry loops

        const refreshToken = getCookie('_auth_refresh');
        const userId = getCookie('_auth_user');

        // Check if refresh token is available
        if (refreshToken && userId) {
          try {
            // Encapsulate token refresh logic in a function
            const response = await refreshAccessToken(refreshToken, userId);
            if (response.status !== 200) {
              removeCookie('_auth');
              removeCookie('_auth_user');
              removeCookie('_auth_refresh');
              removeCookie('_auth_storage');
              removeCookie('_auth_type');
              removeCookie('_auth_refresh_time');
              alert('test');
              // window.location.reload();
            }

            // Store the new token
            const newAccessToken = response.data.accessToken;
            setCookie('_auth', newAccessToken);
            setCookie('_auth_user', userId);

            // Update the header for the original request
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            // Retry the original request with the new token
            return api(originalRequest);
          } catch (refreshError) {
            removeCookie('_auth');
            removeCookie('_auth_user');
            removeCookie('_auth_refresh');
            removeCookie('_auth_storage');
            removeCookie('_auth_type');
            removeCookie('_auth_refresh_time');
            // window.location.reload();
          }
        } else {
          removeCookie('_auth');
          removeCookie('_auth_user');
          removeCookie('_auth_refresh');
          removeCookie('_auth_storage');
          removeCookie('_auth_type');
          removeCookie('_auth_refresh_time');
          // window.location.reload();
        }
      }

      // For errors not related to token expiration, just return the error
      return Promise.reject(error);
    }
  );
};
