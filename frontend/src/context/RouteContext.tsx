import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit';
import refreshApi from '@/utils/refreshToken';
import { routes } from '@/routes/routes';

export const RouteProvider = () => {
  return (
    <AuthProvider
      authType="cookie"
      authName="_auth"
      cookieDomain={window.localStorage.hostname}
      cookieSecure={window.location.protocol === 'https:'}
      refresh={refreshApi}
    >
      <RouterProvider router={routes} />
    </AuthProvider>
  );
};
