import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignOut } from 'react-auth-kit';
import { getCookie, removeCookie } from 'typescript-cookie';
import { logoutUser } from '@/api/auth';
import { CustomAxiosError } from '@/api/utils/createApi';
import { cookieConfiguration } from '@/utils/cookies';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';

export const useAdminLogout = () => {
  const [isLogoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { errorToast } = useNotifyToast();
  const api = useApi();
  const navigate = useNavigate();
  const signOut = useSignOut();

  const onLogoutAdmin = async () => {
    try {
      const accessToken = getCookie('_auth')!;
      setIsLoggingOut(true);
      const logoutResponse = await api.execute(logoutUser(accessToken));
      if (logoutResponse.status === 200 || logoutResponse.status === 400 || logoutResponse.status === 422) {
        signOut();
        removeCookie('_auth_user', cookieConfiguration);
        navigate('/admin/login');
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      console.error(errorData.message || errorData.detail[0].msg);
      errorToast({
        title: 'Retry logging out',
        description: 'An error occured. Please try logging out again'
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { isLogoutOpen, isLoggingOut, setLogoutOpen, onLogoutAdmin };
};
