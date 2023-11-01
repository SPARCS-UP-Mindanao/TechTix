import moment from 'moment';
import Icon from '@/components/Icon';
import Separator from '@/components/Separator';
import { Event } from '@/model/events';

interface Props {
  event: Event;
}

const EventDetails = ({ event }: Props) => {
  const isSameDayEvent = moment(event.startDate).isSame(event.endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(event.startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(event.endDate).format('LT')}`;
    }
    return `${moment(event.startDate).format('MMMM Do YYYY')} - ${moment(event.endDate).format('MMMM Do YYYY')}`;
  };
  return (
    <>
      <div className="h-full">
        <header className="text-left space-y-4">
          <h1 className="text-lg ">{event.name}</h1>
          <div className="space-y-1">
            <div className="flex">
              <Icon name="Clock" className="mr-1" />
              <p className="">{getDate()}</p>
            </div>

            <div className="flex">
              <Icon name="MapPin" size={20} className="mr-1" />
              <p className="flex text-sm">{event.venue}</p>
            </div>
          </div>
        </header>
      </div>

      <Separator className="my-4" />

      <div className="text-left space-y-2">
        <h3 className="text-base">About this Event</h3>
        <p className="text-sm">{event.description}</p>
      </div>
    </>
  );
};

export default EventDetails;
