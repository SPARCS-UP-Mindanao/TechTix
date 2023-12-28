import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents } from '@/api/events';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import EventCard from './EventCard';
import Skeleton from './Skeleton';

interface EventCardListProps {
  isLoadAll: boolean;
  count?: number;
}

const EventCardList: FC<EventCardListProps> = ({ isLoadAll, count = 8 }) => {
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const { data: response, isFetching } = useApiQuery(getAllEvents());

  useEffect(() => {
    if (response?.status === 200 && response.data) {
      const eventInfos: Event[] = response.data;
      setAllEvents(eventInfos);
    }
  }, [response]);

  useEffect(() => {
    if (isLoadAll) {
      setEvents(allEvents);
    } else {
      setEvents(allEvents.slice(0, count));
    }
  }, [allEvents, count]);

  const viewEvent = (eventId?: string, status?: string) => () => {
    if (status === 'open') {
      navigate(`../${eventId}/register`, { relative: 'path' });
    } else {
      navigate(`../${eventId}/evaluate`, { relative: 'path' });
    }
  };

  if (isFetching) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 py-10 gap-5 items-center justify-center justify-items-center w-full md:w-auto">
        {[...Array(count)].map((index) => (
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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 py-10 gap-5 items-center justify-center justify-items-center">
      {events.map((eventInfo) => (
        <EventCard
          key={eventInfo.eventId}
          event={eventInfo}
          isDeleteEnabled={false}
          onClick={viewEvent(eventInfo.eventId, eventInfo.status)}
          className="w-full md:w-[245px] h-[220px] shadow-lg light border-none"
        />
      ))}
    </div>
  );
};

export default EventCardList;
