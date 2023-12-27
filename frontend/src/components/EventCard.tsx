import { FC, useState } from 'react';
import moment from 'moment';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import { CardContainer, CardFooter } from '@/components/Card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropdownMenu';
import Icon from '@/components/Icon';
import Skeleton from '@/components/Skeleton';
import { Event } from '@/model/events';
import { useDeleteEvent } from '@/hooks/useDeleteEvent';
import { useFileUrl } from '@/hooks/useFileUrl';

interface CardHeaderProps {
  eventInfo: Event;
  deleteEnabled?: boolean;
  refetch?: () => void;
}

const EventCardHeader: React.FC<CardHeaderProps> = ({ eventInfo, refetch, deleteEnabled = true }) => {
  const { fileUrl: imageUrl, isLoading } = useFileUrl(eventInfo.bannerLink!);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const deleteEventTrigger = async () => {
    if (eventInfo.eventId && deleteEnabled && refetch) {
      const { onDeleteEvent } = useDeleteEvent(eventInfo.eventId!);
      try {
        onDeleteEvent();
        closeModal();
        refetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const ActionsDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 self-end bg-card border">
            <span className="sr-only">Open menu</span>
            <Icon name="DotsThreeVertical" weight="bold" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-xs font-semibold text-negative" onClick={() => setIsModalOpen(true)}>
            Delete event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="h-1/2" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
      {isLoading && <Skeleton className="w-full h-full" />}
      <div className="w-full flex justify-end p-2">{deleteEnabled && <ActionsDropdown />}</div>
      <AlertModal
        alertModalTitle="Delete Event"
        alertModalDescription="Are you sure you want to delete this event?"
        visible={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCancelAction={closeModal}
        onCompleteAction={deleteEventTrigger}
      />
    </div>
  );
};

interface CardFooterProps {
  event: Event;
  onClick?: () => void;
}

const EventCardFooter: FC<CardFooterProps> = ({ event, onClick }) => {
  const isSameDayEvent = moment(event.startDate).isSame(event.endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(event.startDate).format('ll, h:mm A')} - ${moment(event.endDate).format('LT')}`;
    }
    return `${moment(event.startDate).format('ll')} - ${moment(event.endDate).format('ll')}`;
  };
  return (
    <CardFooter
      className="w-full h-1/2 flex flex-col justify-evenly space-y-1 items-start p-4 pt-2 hover:bg-accent overflow-hidden hover:cursor-pointer transition-colors"
      onClick={onClick}
    >
      <h4 className="max-w-full max-h-full text-sm line-clamp-2">{event.name}</h4>
      <div>
        <div className="flex items-center">
          <Icon name="Clock" weight="light" className="w-4 h-4" />
          <span className="text-xs font-raleway font-medium text-left ml-1">{getDate()}</span>
        </div>
        <div className="flex items-center">
          <Icon name="MapPin" weight="light" className="w-4 h-4" />
          <p className="text-xs font-raleway font-medium text-left ml-1">{event.venue}</p>
        </div>
      </div>
    </CardFooter>
  );
};

interface EventCardProps {
  eventInfo: Event;
  refetch?: () => void;
  onClick?: () => void;
}

const EventCard: FC<EventCardProps> = ({ eventInfo, refetch, onClick }) => {
  return (
    <CardContainer key={eventInfo.eventId} className="overflow-hidden w-[250px] min-h-[200px] flex flex-col flex-shrink-0 border-primary-950">
      <EventCardHeader eventInfo={eventInfo} refetch={refetch} />
      <EventCardFooter event={eventInfo} onClick={onClick} />
    </CardContainer>
  );
};

export default EventCard;
