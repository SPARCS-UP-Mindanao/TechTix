import { Outlet as AdminEventRoute, useOutletContext, useParams } from 'react-router-dom';
import { getEvent } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';
import { AdminRouteConfigProps } from '../getAdminRouteConfig';

interface AdminEventContext {
  adminConfig: AdminRouteConfigProps[];
}

const AdminEventPageContent = () => {
  const { eventId } = useParams();
  // const { adminConfig } = useOutletContext<AdminEventContext>(); to be used later

  const { data: response, isFetching } = useApiQuery(getEvent(eventId!));

  if (isFetching) {
    return (
      // TODO: Add skeleton page
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      // TODO: Add event not found page
      <div>
        <h1>Event not found</h1>
      </div>
    );
  }

  const event = response.data;

  return <AdminEventRoute context={event} />;
};

const AdminEventPage = () => {
  return <AdminEventPageContent />;
};

export default AdminEventPage;
