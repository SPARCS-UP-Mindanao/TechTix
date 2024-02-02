import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '@/components/Button';
import { Event } from '@/model/events';
import AdminEventForm from '../../AdminEventForm';

const AdminEventInfo: FC = () => {
  const event = useOutletContext<Event>();
  const { eventId } = event;

  const redirectToRegistration = () => {
    window.open(`/${eventId}/register`, '_blank');
  };
  const redirectToEvaluation = () => {
    window.open(`/${eventId}/evaluate`, '_blank');
  };

  return (
    <section>
      <div className="flex flex-col gap-3 items-center justify-center w-full">
        <h2>Event Info</h2>
        <p className="text-muted-foreground">Manage the information that will be displayed on the event.</p>

        <div className="flex md:flex-row flex-col gap-2">
          <Button onClick={redirectToRegistration} isExternal>
            Event Registration
          </Button>
          <Button onClick={redirectToEvaluation} isExternal>
            Event Evaluation
          </Button>
        </div>
        <AdminEventForm event={event} />
      </div>
    </section>
  );
};

const AdminEventInfoPage = () => {
  return <AdminEventInfo />;
};

export default AdminEventInfoPage;
