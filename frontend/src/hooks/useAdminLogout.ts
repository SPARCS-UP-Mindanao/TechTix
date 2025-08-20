import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthError, signOut } from 'aws-amplify/auth';
import { useNotifyToast } from './useNotifyToast';

export const useAdminLogout = () => {
  const [isLogoutOpen, setLogoutOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { errorToast } = useNotifyToast();
  // const api = useApi();
  const navigate = useNavigate();

  const onLogoutAdmin = async () => {
    try {
      // const accessToken = getCookie('_auth')!;
      setIsLoggingOut(true);
      await signOut();
      navigate('/admin/login');

      // const logoutResponse = await api.execute(logoutAdminUser(accessToken));
      // if (logoutResponse.status === 200 || logoutResponse.status === 400 || logoutResponse.status === 422) {
      //   signOut();
      //   removeCookie('_auth_user', cookieConfiguration);
      //   navigate('/admin/login');
      // }
    } catch (e) {
      if (e instanceof AuthError) {
        errorToast({
          id: 'sign-in-error',
          title: 'There was a problem signing in.',
          description: e.message
        });
        throw Error(e.message);
      } else {
        console.error(e);
        throw Error();
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { isLogoutOpen, isLoggingOut, setLogoutOpen, onLogoutAdmin };
};
