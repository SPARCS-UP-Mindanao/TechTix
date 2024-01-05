import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import EventCard from '@/components/EventCard';
import Skeleton from '@/components/Skeleton';
import { getAllEvents } from '@/api/events';
import { Event, EventStatus } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';

const HIDE_STATUS: EventStatus[] = ['draft'];

interface EventCardListProps {
  isLoadAll: boolean;
  initialCount?: number;
}

const EventCardList: FC<EventCardListProps> = ({ isLoadAll, initialCount = 8 }) => {
  const navigate = useNavigate();
  const [eventCount, setEventCount] = useState(initialCount);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const { data: response, isFetching } = useApiQuery(getAllEvents());

  useEffect(() => {
    if (setShowMoreButton && response && response.data) {
      setShowMoreButton(response.data.length > initialCount);
    }
  }, [response?.data]);

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

  if (!response || (response && !response.data)) {
    return (
      <div className="py-10">
        <h1>Events not found</h1>
      </div>
    );
  }

  if (response.status === 200 && !response.data.length) {
    return (
      <div>
        <h1>There are currently no events</h1>
      </div>
    );
  }

  const allEvents: Event[] = response.data;
  const events = allEvents.filter((event) => !HIDE_STATUS.includes(event.status));
  const visibleEvents = isLoadAll ? events : events.slice(0, eventCount);
  const showAllEvents = allEvents.length === eventCount;

  const loadButton = () => {
    if (!showAllEvents) {
      setEventCount(allEvents.length);
    } else {
      setEventCount(initialCount);
    }
  };
  const viewEvent = (eventId?: string, status?: string) => () => {
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
              onClick={viewEvent(event.eventId, event.status)}
              className="w-full md:w-[245px] h-[220px] shadow-lg light border-none"
            />
          ))}
        </div>
      </div>
      {!isLoadAll && showMoreButton && (
        <Button className="p-5 rounded-full w-56" variant={'outline'} onClick={loadButton}>
          {showAllEvents ? 'Show less' : 'Show more'}
        </Button>
      )}
    </>
  );
};

export default EventCardList;
