import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard/EventCard';
import Skeleton from '@/components/Skeleton';
import { getEvent } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';
import { useLogin } from './useLogin';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const toParams = decodeURIComponent(searchParams.get('to')!);
  const [_, eventId] = toParams.split('/');

  const { data: response, isFetching: isFetchingEventInfo } = useApiQuery(getEvent(eventId), { active: !!eventId });
  const event = response?.data;
  const isValidId = !!event;

  const setMetaData = useMetaData();

  const { onLogin } = useLogin(isValidId ? eventId : undefined, event?.status);

  useEffect(() => {
    if (event) {
      setMetaData({
        title: event.name,
        iconUrl: event.bannerUrl
      });
    }
  }, [event]);

  if (isFetchingEventInfo) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <main className="h-full flex flex-col max-w-[1080px] mx-auto my-0 p-0 md:p-4 lg:px-8 py-8 gap-y-8 md:gap-y-16">
      <header className="flex flex-col items-center p-4 text-center">
        <h1>Welcome to TechTix!</h1>
        <p>You will need to login inorder to access the registration or evaluation form.</p>
      </header>

      {event && (
        <div className="flex justify-center">
          <EventCard event={event} isDeleteEnabled={false} />
        </div>
      )}

      <section className="flex justify-center">
        <Button variant="primaryGradient" className="cursor-pointer" onClick={onLogin}>
          Login with Google
        </Button>
      </section>
    </main>
  );
};

export const Component = LoginPage;

export default LoginPage;
