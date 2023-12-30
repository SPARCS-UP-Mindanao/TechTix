import { FC, useState } from 'react';
import moment from 'moment';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import { CardContainer, CardFooter } from '@/components/Card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropdownMenu';
import Icon from '@/components/Icon';
import Skeleton from '@/components/Skeleton';
import { Event } from '@/model/events';
import { cn } from '@/utils/classes';
import { useDeleteEvent } from '@/hooks/useDeleteEvent';
import { useFileUrl } from '@/hooks/useFileUrl';
import Badge from './Badge';

interface CardHeaderProps {
  event: Event;
  isDeleteEnabled: boolean;
  isDeletingEvent?: boolean;
  setIsModalOpen: (open: boolean) => void;
  refetch?: () => void;
  onDeleteEvent?: () => Promise<void>;
}

const EventCardHeader: React.FC<CardHeaderProps> = ({ event, isDeleteEnabled, isDeletingEvent, setIsModalOpen }) => {
  const { fileUrl: imageUrl, isLoading } = useFileUrl(event.bannerLink!);

  const ActionsDropdown = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 self-end bg-card border group-hover:opacity-100">
            <span className="sr-only">Open menu</span>
            <Icon name="DotsThreeVertical" weight="bold" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-xs font-semibold text-negative"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            Delete event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="h-1/2 group-hover:opacity-70 transition" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover' }}>
      {isLoading && <Skeleton className="w-full h-full" />}
      {isDeleteEnabled && (
        <div className="w-full flex p-2 justify-end">
          {!isDeletingEvent && !isLoading && <ActionsDropdown />}
          {isDeletingEvent && (
            <Badge variant="negative" loading={isDeletingEvent} className="h-6 self-end">
              Deleting
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

interface CardFooterProps {
  event: Event;
}

const EventCardFooter: FC<CardFooterProps> = ({ event }) => {
  const isSameDayEvent = moment(event.startDate).isSame(event.endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(event.startDate).format('ll, h:mm A')} - ${moment(event.endDate).format('LT')}`;
    }
    return `${moment(event.startDate).format('ll')} - ${moment(event.endDate).format('ll')}`;
  };
  return (
    <CardFooter className="w-full h-1/2 flex flex-col justify-evenly space-y-1 items-start p-4 pt-2 overflow-hidden group-hover:bg-accent transition-colors">
      <p className="max-w-full max-h-full line-clamp-2 text-sm font-subjectivity font-semibold tracking-tight">{event.name}</p>
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
  event: Event;
  className?: string;
  isDeleteEnabled?: boolean;
  refetch?: () => void;
  onClick?: () => void;
}

const EventCard: FC<EventCardProps> = ({ event, className = '', isDeleteEnabled = true, refetch, onClick }) => {
  const { onDeleteEvent, isDeletingEvent } = useDeleteEvent(event.eventId!);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);

  const deleteEventTrigger = async () => {
    if (event.eventId && onDeleteEvent && refetch) {
      try {
        await onDeleteEvent();
        closeModal();
        refetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <AlertModal
        alertModalTitle="Delete Event"
        alertModalDescription="Are you sure you want to delete this event?"
        visible={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCancelAction={closeModal}
        onCompleteAction={deleteEventTrigger}
      />
      <CardContainer
        key={event.eventId}
        className={cn(
          'group overflow-hidden w-[250px] min-h-[200px] flex flex-col flex-shrink-0 border-primary-950 hover:cursor-pointer',
          isDeletingEvent && 'pointer-events-none',
          className
        )}
        onClick={onClick}
      >
        <EventCardHeader event={event} isDeletingEvent={isDeletingEvent} isDeleteEnabled={isDeleteEnabled} setIsModalOpen={setIsModalOpen} />
        <EventCardFooter event={event} />
      </CardContainer>
    </>
  );
};

export default EventCard;
