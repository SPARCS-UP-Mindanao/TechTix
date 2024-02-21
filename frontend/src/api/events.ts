import { createApi } from '@/api/utils/createApi';
import { Event, EventStatus } from '@/model/events';

export interface EventDto {
  name: string;
  description: string;
  email: string;
  startDate: string;
  endDate: string;
  venue: string;
  bannerLink: string;
  bannerUrl: string;
  logoUrl: string;
  logoLink: string;
  autoConfirm: boolean;
  paidEvent: boolean;
  price: number;
  certificateTemplate: string;
  status: EventStatus;
  eventId: string;
  isLimitedSlot: boolean;
  registrationCount: number;
  maximumSlots: number | null;
  createDate: string;
  updateDate: string;
  createdBy: string;
  updatedBy: string;
}

export type OptionalEvent = Partial<Event>;

export interface PresignedUrl {
  uploadLink: string;
  objectKey: string;
}

interface EventRegCountStatus {
  registrationCount: number;
  maximumSlots: number | null;
}

const mapEventDtoToEvent = (event: EventDto): Event => ({
  ...event,
  paidEvent: event.paidEvent ?? false
});

const mapEventsDtoToEvent = (events: EventDto[]): Event[] => events.map((event) => mapEventDtoToEvent(event));

const mapEventsDtoToEventRegCountStatus = (event: EventDto): EventRegCountStatus => ({
  registrationCount: event.registrationCount,
  maximumSlots: event.maximumSlots
});

export const getAllEvents = () => {
  return createApi<EventDto[], Event[]>({
    method: 'get',
    url: '/events',
    output: mapEventsDtoToEvent
  });
};

export const getAdminEvents = (adminId: string) =>
  createApi({
    method: 'get',
    authorize: true,
    url: `/events/admin`,
    queryParams: { adminId },
    output: mapEventsDtoToEvent
  });

export const createEvent = (event: Event) =>
  createApi<EventDto, Event>({
    method: 'post',
    authorize: true,
    url: '/events',
    body: { ...event },
    output: mapEventDtoToEvent
  });

export const getEvent = (entryId: string) =>
  createApi<EventDto, Event>({
    method: 'get',
    url: `/events/${entryId}`,
    output: mapEventDtoToEvent
  });

export const updateEvent = (entryId: string, event: OptionalEvent) =>
  createApi<EventDto, Event>({
    method: 'put',
    authorize: true,
    url: `/events/${entryId}`,
    body: { ...event },
    output: mapEventDtoToEvent
  });

export const deleteEvent = (entryId: string) =>
  createApi<EventDto, Event>({
    method: 'delete',
    authorize: true,
    url: `/events/${entryId}`,
    output: mapEventDtoToEvent
  });

export const getPresignedUrl = (entryId: string, fileName: string, uploadType: string) =>
  createApi<PresignedUrl>({
    method: 'put',
    authorize: true,
    url: `/events/${entryId}/upload/${uploadType}`,
    body: { fileName }
  });

export const getEventRegCountStatus = (entryId: string) =>
  createApi<EventDto, EventRegCountStatus>({
    method: 'get',
    authorize: true,
    url: `/events/${entryId}`,
    output: mapEventsDtoToEventRegCountStatus
  });
