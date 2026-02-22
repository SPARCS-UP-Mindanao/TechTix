import { FC } from 'react';
import tontonSad from '@/assets/pycon/tonton-sad.png';
import tonton from '@/assets/pycon/tonton.png';
import { Event } from '@/model/events';

interface SuccessProps {
  event: Event;
  isRegisterSuccessful: boolean;
}

const SuccessStep: FC<SuccessProps> = ({ event, isRegisterSuccessful }) => {
  if (!isRegisterSuccessful) {
    return (
      <div className="text-center space-y-4 pt-12 md:pt-20">
        <img src={tontonSad} className="size-40 mx-auto" alt="" />
        <h1 className="font-pipanganan!">Oops! something went wrong</h1>

        <p>Your submission cannot be completed at this time.</p>
        <p>Try resubmitting by clicking the button below.</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4 pt-12 md:pt-20">
      <img src={tonton} className="size-40 mx-auto" alt="" />
      <h1 className="font-pipanganan!">Your response has been recorded</h1>
      <p>Thank you for signing up for {event.name}. See you there!</p>
      <p>Please check your email for more details regarding the event. If you don't see it in your inbox, be sure to check your spam folder.</p>
    </div>
  );
};

export default SuccessStep;
