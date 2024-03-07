import { FC } from 'react';
import ImageViewer from '@/components/ImageViewer';
import { Event } from '@/model/events';

interface Props {
  event: Event;
  showBanner?: boolean;
}

export const EventHeader: FC<Props> = ({ event, showBanner = true }) => {
  return (
    <>
      <ImageViewer objectKey={event.logoLink} className="w-12 h-12 rounded-full overflow-hidden" />
      {showBanner && (
        <div className="flex w-full max-h-[448px] justify-center relative overflow-hidden">
          <ImageViewer objectKey={event.bannerLink} className="w-full max-w-md object-contain z-10" />
          <div className="blur-2xl absolute w-full h-full inset-0 bg-center" style={{ backgroundImage: `url(${event.bannerUrl})` }}></div>
        </div>
      )}
    </>
  );
};

export default EventHeader;
