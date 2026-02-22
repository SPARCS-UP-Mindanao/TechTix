import { CardContainer } from '../Card';
import Skeleton from '../Skeleton';

const EventCardSkeleton = () => {
  return (
    <CardContainer className="w-[245px] h-[220px] shrink-0 shadow-lg">
      <Skeleton className="h-1/2 rounded-b-none" />
      <div className="flex flex-col justify-evenly h-1/2 space-y-1 p-2">
        <Skeleton className="w-1/2 h-3" />
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-3" />
          <Skeleton className="w-1/2 h-3" />
        </div>
      </div>
    </CardContainer>
  );
};

export default EventCardSkeleton;
