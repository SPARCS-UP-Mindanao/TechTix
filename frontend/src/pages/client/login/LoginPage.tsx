import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import googleLogo from '@/assets/logos/google.png';
import Alert from '@/components/Alert';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import { getEvent } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';
import { usePyconStyles } from '../pycon/hooks/usePyconStyles';
import EventDetails from '../pycon/register/EventDetails';
import { useLogin } from './useLogin';

const LoginPage = () => {
  usePyconStyles();

  const [searchParams] = useSearchParams();
  const toParams = decodeURIComponent(searchParams.get('to')!);
  const [_, eventId] = toParams.split('/');

  const { data: response, isPending: isPendingEventInfo } = useApiQuery(getEvent(eventId), { active: !!eventId });
  const event = response?.data;
  const isValidId = !!event;

  const setMetaData = useMetaData();

  const { onLogin } = useLogin(isValidId ? eventId : undefined, event?.status);

  useEffect(() => {
    if (event) {
      setMetaData({
        title: event.name,
        iconUrl: event.logoUrl
      });
    }
  }, [event]);

  if (isPendingEventInfo) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <>
      <Alert
        className="bg-accent/50 rounded-none grid-cols-3 top-0 sticky"
        title="Welcome to Techtix! Please signin to continue"
        description="We require our users to signin their accounts to easily track their registrations"
      >
        <Button
          className="cursor-pointer gap-x-2 bg-pycon-custard-light text-pycon-violet! hover:bg-pycon-custard col-start-2 md:col-start-3 md:row-span-2 md:row-start-1 md:h-full mt-4 md:mt-0 md:w-fit md:ms-auto"
          onClick={onLogin}
        >
          <img className="size-6" src={googleLogo} alt="" />
          Sign in with Google
        </Button>
      </Alert>
      <main data-page="pycon" className="grow pycon-page flex flex-col mx-auto my-0 p-0 pt-8! md:p-4 lg:px-8 py-8 gap-y-8 md:gap-y-16">
        {event && (
          <EventDetails
            event={event}
            registerButton={
              <Button className="cursor-pointer gap-x-2 bg-pycon-custard-light text-pycon-violet! hover:bg-pycon-custard" onClick={onLogin}>
                <img className="size-6" src={googleLogo} alt="" />
                Sign in with Google
              </Button>
            }
          />
        )}
      </main>
    </>
  );
};

export const Component = LoginPage;

export default LoginPage;
