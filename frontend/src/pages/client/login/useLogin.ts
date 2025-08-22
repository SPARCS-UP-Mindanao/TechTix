import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthError, signInWithRedirect } from 'aws-amplify/auth';
import { EventStatus } from '@/model/events';
import { useNotifyToast } from '@/hooks/useNotifyToast';

export const useLogin = (eventId?: string, eventStatus?: EventStatus) => {
  const [searchParams] = useSearchParams();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { errorToast } = useNotifyToast();
  const to = searchParams.get('to') ?? '';

  const getLoginRedirect = () => {
    if ((eventId && eventStatus === 'open') || eventStatus === 'preregistration') {
      const status = eventStatus === 'preregistration' ? 'preregister' : 'register';
      return `${eventId}/${status}`;
    }

    if (eventId && eventStatus === 'completed') {
      return `${eventId}/evaluate`;
    }

    return to;
  };

  const loginRedirect = getLoginRedirect();

  const onLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithRedirect({ provider: 'Google', customState: loginRedirect });
    } catch (error) {
      if (error instanceof AuthError) {
        errorToast({
          id: 'sign-in-error',
          title: 'There was a problem signing in.',
          description: error.message
        });
        throw Error(error.message);
      } else {
        console.error(error);
        throw Error();
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    isLoggingIn,
    onLogin
  };
};
