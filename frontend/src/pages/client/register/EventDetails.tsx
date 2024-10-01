import moment from 'moment';
import Icon from '@/components/Icon';
import RichTextContent from '@/components/RichContent/RichTextContent';
import Separator from '@/components/Separator';
import { Event } from '@/model/events';
import { formatMoney } from '@/utils/functions';

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
      <header className="text-left space-y-4">
        <h1 className="text-lg ">{event.name}</h1>
        <div className="space-y-1">
          <div className="grid grid-cols-12 items-center space-x-2">
            <Icon name="Clock" className="col-span-1" />
            <p className="text-sm col-span-11">{getDate()}</p>
          </div>

          <div className="grid grid-cols-12 items-center space-x-2">
            <Icon name="MapPin" className="col-span-1" />
            <p className="text-sm col-span-11">{event.venue}</p>
          </div>

          {event.paidEvent && !event.hasMultipleTicketTypes && event.status !== 'completed' && (
            <div className="grid grid-cols-12 items-center space-x-2">
              <Icon name="Banknote" className="col-span-1" />
              <p className="text-sm col-span-11">{formatMoney(event.price, 'PHP')}</p>
            </div>
          )}
        </div>
      </header>

      {event.description && (
        <>
          <Separator />
          <div className="text-left space-y-2">
            <h3 className="text-base">About this Event</h3>
            <div className="text-sm">
              <RichTextContent content={event.description} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default EventDetails;
