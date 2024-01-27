import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard/EventCard';
import Skeleton from '@/components/Skeleton';
import { Event, EventStatus } from '@/model/events';

const HIDE_STATUS: EventStatus[] = ['draft'];

interface EventCardListProps {
  allEvents?: Event[];
  isFetching?: boolean;
  isLoadAll?: boolean;
  initialCount?: number;
}

const EventCardList: FC<EventCardListProps> = ({ allEvents, isFetching = false, isLoadAll = true, initialCount = 8 }) => {
  const navigate = useNavigate();
  const [eventCount, setEventCount] = useState(initialCount);

  if (isFetching) {
    return (
      <div className="w-full flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-5 items-center justify-center justify-items-center md:w-auto">
          {[...Array(initialCount)].map((index) => (
            <div className="flex flex-col gap-2 rounded-xl shadow-lg w-full md:w-[245px] h-[220px]" key={index}>
              <Skeleton className="w-full h-1/2" />
              <div className="p-4 flex flex-col gap-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!allEvents) {
    return (
      <div className="py-10">
        <h1>Events not found</h1>
      </div>
    );
  }

  if (allEvents.length === 0) {
    return (
      <div>
        <h1>There are currently no events</h1>
      </div>
    );
  }

  const events = allEvents.filter((event) => !HIDE_STATUS.includes(event.status));
  const visibleEvents = isLoadAll ? events : events.slice(0, eventCount);
  const sameAsInitial = visibleEvents.length === initialCount;
  const allEventsShown = allEvents.length === eventCount;

  const onShow = () => {
    if (!allEventsShown) {
      setEventCount(allEvents.length);
    } else {
      setEventCount(initialCount);
    }
  };
  const viewEvent = (eventId: string, status: string) => () => {
    if (status === 'open') {
      navigate(`/${eventId}/register`, { relative: 'path' });
    } else {
      navigate(`/${eventId}/evaluate`, { relative: 'path' });
    }
  };

  return (
    <>
      <div className="w-full flex items-center justify-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-5 items-center justify-center justify-items-center">
          {visibleEvents.map((event) => (
            <EventCard
              key={event.eventId}
              event={event}
              isDeleteEnabled={false}
              onClick={viewEvent(event.eventId!, event.status)}
              className="w-full md:w-[245px] h-[220px] shadow-lg light border-none"
            />
          ))}
        </div>
      </div>
      <ShowButton isLoadAll={isLoadAll} allEventsShown={allEventsShown} onShow={onShow} sameAsInitial={sameAsInitial} />
    </>
  );
};

interface ShowButtonProps {
  isLoadAll: boolean;
  sameAsInitial: boolean;
  allEventsShown: boolean;
  onShow: () => void;
}

const ShowButton = ({ isLoadAll, allEventsShown, sameAsInitial, onShow }: ShowButtonProps) => {
  if (isLoadAll || sameAsInitial) {
    return;
  }

  return (
    <Button className="p-5 rounded-full w-56" variant="outline" onClick={onShow}>
      {allEventsShown ? 'Show less' : 'Show more'}
    </Button>
  );
};

export default EventCardList;
