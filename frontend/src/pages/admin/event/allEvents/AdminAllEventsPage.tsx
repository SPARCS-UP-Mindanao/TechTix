import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { getAllEvents } from '@/api/events';
import { fromToDateFormatter } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';

const ViewEventButton = ({ eventId }: { eventId: string }) => {
  const navigate = useNavigate();

  return (
    <Button className="w-full" onClick={() => navigate(`/admin/events/${eventId}`)}>
      View Event
    </Button>
  );
};

const AdminAllEvents = () => {
  const { data: response, isFetching } = useApi(getAllEvents());

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
        <h1>Events not found</h1>
      </div>
    );
  }

  const eventInfos = response.data;

  return (
    <div className="grid grid-cols-2 p-10 gap-5">
      {eventInfos.map((eventInfo) => (
        <Card
          key={eventInfo.entryId}
          cardBanner={eventInfo.bannerLink}
          cardTitle={eventInfo.name}
          cardDescription={eventInfo.description}
          cardFooter={<ViewEventButton eventId={eventInfo.entryId!} />}
          className="flex flex-col items-center justify-center"
        >
          <p>{fromToDateFormatter(eventInfo.startDate, eventInfo.endDate)}</p>
          <div>Ticket Price: ₱{eventInfo.price}</div>
        </Card>
      ))}
    </div>
  );
};

const AdminAllEventsPage = () => {
  return <AdminAllEvents />;
};

export default AdminAllEventsPage;
