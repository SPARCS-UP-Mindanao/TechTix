import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { getAllEvents, deleteEvent } from '@/api/events';
import { fromToDateFormatter } from '@/utils/functions';
import { useApi, useFetchQuery } from '@/hooks/useApi';
import { Event } from '@/model/events';

const ViewEventButton = ({ eventId }: { eventId: string }) => {
  const navigate = useNavigate();

  return (
    <Button className="w-full" onClick={() => navigate(`/admin/events/${eventId}`)}>
      View Event
    </Button>
  );
};

type CardHeaderProps = {
  eventInfo: Event;
  refetch: () => void;
};
const CardHeader: React.FC<CardHeaderProps> = ({ eventInfo, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const { fetchQuery } = useFetchQuery<any>();
  const deleteEventTrigger = async () => {
    if (eventInfo.entryId === undefined) {
      return;
    }
    await fetchQuery(deleteEvent(eventInfo.entryId));
    await refetch();
    closeModal();
  };
  return (
    <div className="flex flex-col gap-5 items-center">
      <AlertModal
        alertModalTitle="Delete Event"
        alertModalDescription="Are you sure you want to delete this event?"
        trigger={<Button className="self-end bg-red-500 hover:bg-red-700">Delete Event</Button>}
        visible={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCancelAction={() => closeModal()}
        onCompleteAction={deleteEventTrigger}
      />
      <img src={eventInfo.bannerLink} /> <span>{eventInfo.name}</span>
    </div>
  );
};

const AdminAllEvents = () => {
  const { data: response, isFetching, refetch } = useApi(getAllEvents());

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
          cardTitle={<CardHeader eventInfo={eventInfo} refetch={refetch} />}
          cardDescription={<span className="inline-block w-full text-center ">{eventInfo.description}</span>}
          cardFooter={<ViewEventButton eventId={eventInfo.entryId!} />}
          className="flex flex-col items-center justify-between"
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
