import { FC } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getCookie } from 'typescript-cookie';
import { getAdminEvents } from '@/api/events';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { useDashboardEvents } from '@/hooks/useDashboardEvents';
import EventCard from '../../../../components/EventCard';
import CreateEventSheet from './CreateEventSheet';

interface AdminAllEventsContext {
  isCreateEventOpen: boolean;
  setCreateEventOpen: (value: boolean) => void;
}

const AdminAllEvents = () => {
  const adminId = getCookie('_auth_user');
  const { isCreateEventOpen, setCreateEventOpen } = useOutletContext<AdminAllEventsContext>();
  const { data: response, isFetching, refetch } = useApiQuery(getAdminEvents(adminId!));

  const Dashboard = () => {
    if (isFetching) {
      return (
        // TODO: Add skeleton page
        <div>
          <h1>Loading...</h1>
        </div>
      );
    }

    if (!response || (response && response.status !== 200 && response.status !== 404)) {
      return (
        // TODO: Add event not found page
        <div className="py-10">
          <h1>Events not found</h1>
        </div>
      );
    }

    if (response.status === 404) {
      return (
        // TODO: Add empty event list
        <div className="py-10">
          <h1>There are currently no events</h1>
        </div>
      );
    }

    const events: Event[] = response.data;
    return <DashboardContent events={events} refetch={refetch} />;
  };

  return (
    <>
      <CreateEventSheet refetch={refetch} isCreateEventOpen={isCreateEventOpen} setCreateEventOpen={setCreateEventOpen} />
      <Dashboard />
    </>
  );
};

interface DashboardProps {
  events: Event[];
  refetch: () => void;
}

const DashboardContent: FC<DashboardProps> = ({ events, refetch }) => {
  const navigate = useNavigate();
  const viewEvent = (eventId?: string) => () => navigate(`${eventId}/`);

  const { onGoingEvents, upcomingEvents, pastEvents } = useDashboardEvents(events);

  return (
    <div className="flex flex-col w-full h-full p-8 space-y-6 overflow-auto">
      <h3 className="text-primary-900">Dashboard</h3>

      <div>
        <span className="font-bold text-primary-700 text-base rounded-md border border-primary p-2">
          <span className="text-primary-400">{events.length}</span> Events
        </span>
      </div>

      {!!onGoingEvents.length && (
        <div>
          <h4>Ongoing events</h4>
          <div className="flex space-x-2">
            {onGoingEvents.map((event) => (
              <EventCard key={event.eventId} event={event} refetch={refetch} onClick={viewEvent(event.eventId)} />
            ))}
          </div>
        </div>
      )}

      {!!upcomingEvents.length && (
        <div>
          <h4>Upcoming events</h4>
          <div className="flex space-x-2">
            {upcomingEvents.map((event) => (
              <EventCard key={event.eventId} event={event} refetch={refetch} onClick={viewEvent(event.eventId)} />
            ))}
          </div>
        </div>
      )}

      {!!pastEvents.length && (
        <div>
          <h4>Past events</h4>
          <div className="flex space-x-2">
            {pastEvents.map((event) => (
              <EventCard key={event.eventId} event={event} refetch={refetch} onClick={viewEvent(event.eventId)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminAllEventsPage = () => {
  return <AdminAllEvents />;
};

export default AdminAllEventsPage;
