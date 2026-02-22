import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthError, signOut } from 'aws-amplify/auth';
import { useNavigateTo } from '@/hooks/useNavigateTo';
import { useCurrentAdminUser } from './useCurrentUser';
import { useNotifyToast } from './useNotifyToast';

export const useAdminLogout = () => {
  const auth = useCurrentAdminUser();
  const [isLogoutOpen, setLogoutOpen] = useState(false);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { errorToast } = useNotifyToast();
  const { navigate } = useNavigateTo();

  const onLogoutAdmin = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      await auth.refetchUser?.();
      navigate('/admin/login', { replace: true });
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
