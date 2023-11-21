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

      <Separator />

      <div className="text-left space-y-2">
        <h3 className="text-base">About this Event</h3>
        {/* <p className="text-sm">{event.description}</p> */}
        <p className="text-sm">
          Career Talks is an exclusive virtual event designed to demystify various opportunities within the tech scene. It brings together experts from the
          industry🧑🏻‍💻👩🏻‍💻 who will share their experiences and offer insider insights into the different career paths in the ever-evolving field of technology. 🌐
        </p>
        <p className="text-sm">🎧 Expect deep talks from speakers who've cracked the code in varying domains such as AI, Data Science, Cloud, and UI/UX!</p>
        <p className="text-sm">
          Whether you're a student figuring things out or a pro thinking of a change, Career Talks is where you can learn 🖥️, get ideas💡, and connect 🤝with
          fellow tech enthusiasts who share your interests and passions.
        </p>
      </div>
    </>
  );
};

export default EventDetails;
