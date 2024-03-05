import { FC } from 'react';
import { Event } from '@/model/events';

interface SuccessProps {
  event: Event;
}

const SuccessStep: FC<SuccessProps> = ({ event }) => {
  return (
    <div className="text-center pt-8 space-y-4">
      <p>Thank you for signing up for {event.name}. See you there!</p>
      <p>Please check your email for more details regarding the event.</p>
    </div>
  );
};

export default SuccessStep;
