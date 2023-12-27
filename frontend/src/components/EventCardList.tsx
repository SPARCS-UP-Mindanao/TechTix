import { getAllEvents } from '@/api/events';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import EventCard from './EventCard';
import Skeleton from './Skeleton';

function EventCardList() {
  const skeletonCount = 6;
  const { data: response, isFetching } = useApiQuery(getAllEvents());
  if (isFetching) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 py-10 gap-5 items-center justify-center justify-items-center">
        {[...Array(skeletonCount)].map((index) => (
          <div className="flex flex-col gap-2 rounded-xl shadow-lg w-[245px] h-[220px]" key={index}>
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

  const eventInfos: Event[] = response.data;
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 py-10 gap-5 items-center justify-center justify-items-center">
      {eventInfos.map((eventInfo) => (
        <EventCard key={eventInfo.eventId} event={eventInfo} isDeleteEnabled={false} className="w-[245px] h-[220px] shadow-lg light border-none" />
      ))}
    </div>
  );
}

export default EventCardList;
