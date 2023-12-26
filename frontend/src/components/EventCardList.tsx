import moment from 'moment';
import Card from '@/components/Card';
import { getAllEvents } from '@/api/events';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import Skeleton from './Skeleton';

function EventCardList() {
  const skeletonCount = 6;
  const { data: response, isFetching } = useApiQuery(getAllEvents());
  if (isFetching) {
    return (
      <div className="grid grid-cols-2 py-10 gap-5">
        {[...Array(skeletonCount)].map((index) => (
          <div className="flex flex-col gap-2 rounded-xl p-5 shadow-lg" key={index}>
            <div className="flex items-center space-x-4 ">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
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
    <div className="grid grid-cols-2 py-10 gap-5">
      {eventInfos.map((eventInfo) => (
        <Card
          key={eventInfo.eventId}
          cardDescription={<span className="inline-block w-full text-center ">{eventInfo.description}</span>}
          className="flex flex-col items-center justify-between"
        >
          <p>
            {moment(eventInfo.startDate).format('MMMM D YYYY hh:mm A')} - {moment(eventInfo.endDate).format('MMM D YYYY hh:mm A')}
          </p>
          <div>Ticket Price: ₱{eventInfo.price}</div>
        </Card>
      ))}
    </div>
  );
}

export default EventCardList;
