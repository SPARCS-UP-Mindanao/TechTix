import { Outlet as AdminEventRoute, useParams } from 'react-router-dom';
import { TECHTIX_72 } from '@/assets/techtix';
import { getEvent } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';

const AdminEventPageContent = () => {
  const { eventId } = useParams();

  const { data: response, isFetching, refetch: refetchEvent } = useApiQuery(getEvent(eventId!));

  if (isFetching) {
    return (
      // TODO: Add skeleton page
      <div className="flex justify-center pt-40">
        <img className="animate animate-pulse" src={TECHTIX_72} />
      </div>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      // TODO: Add event not found page
      <div className="pt-20 flex flex-col w-full items-center">
        <h1>404</h1>
        <h1>Event not found</h1>
      </div>
    );
  }

  const event = { ...response.data, refetchEvent };

  return (
    <div>
      <h4 className="mb-8">{event.name}</h4>
      <AdminEventRoute context={event} />
    </div>
  );
};

const AdminEventPage = () => {
  return <AdminEventPageContent />;
};

export const Component = AdminEventPage;

export default AdminEventPage;
