import { FC } from 'react';
import { Event } from '@/model/events';

interface Props {
  event: Event;
  showBanner?: boolean;
}

export const EventHeader: FC<Props> = ({ event, showBanner = true }) => {
  return (
    <>
      <img src={event.logoUrl} className="w-12 h-12 rounded-full overflow-hidden" alt="" />
      {showBanner && (
        <div className="flex w-full max-h-[448px] justify-center relative overflow-hidden">
          <img src={event.bannerUrl} className="h-full w-full max-w-md object-contain z-10" alt="" />
          <div className="blur-2xl absolute w-full h-full inset-0 bg-center" style={{ backgroundImage: `url(${event.bannerUrl})` }}></div>
        </div>
      )}
    </>
  );
};

export default EventHeader;
