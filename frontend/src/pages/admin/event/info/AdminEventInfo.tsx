import { FC } from 'react';
import Button from '@/components/Button';
import useAdminEvent from '@/hooks/useAdminEvent';
import AdminEventForm from '../AdminEventForm';

const AdminEventInfo: FC = () => {
  const event = useAdminEvent();
  const { eventId } = event;

  const redirectToPreRegistration = () => {
    window.open(`/${eventId}/preregister`, '_blank');
  };

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
          {event.isApprovalFlow && (
            <Button icon="ExternalLink" iconPlacement="right" disabled={event.status !== 'preregistration'} onClick={redirectToPreRegistration}>
              Event Pre-Registration
            </Button>
          )}
          <Button icon="ExternalLink" iconPlacement="right" disabled={event.status !== 'open'} onClick={redirectToRegistration}>
            Event Registration
          </Button>
          <Button icon="ExternalLink" iconPlacement="right" disabled={event.status !== 'completed'} onClick={redirectToEvaluation}>
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

export const Component = AdminEventInfoPage;

export default AdminEventInfoPage;
