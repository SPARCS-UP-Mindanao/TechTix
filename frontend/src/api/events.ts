import { createApi } from '@/api/utils/createApi';
import { Event, EventStatusValue } from '@/model/events';

export interface EventDto {
  name: string;
  description: string;
  email: string;
  startDate: string;
  endDate: string;
  venue: string;
  bannerLink: string;
  logoLink: string;
  autoConfirm: true;
  payedEvent: true;
  price: number;
  certificateTemplate: string;
  status: EventStatusValue;
  entryId: string;
  createDate: string;
  updateDate: string;
  createdBy: string;
  updatedBy: string;
}

export type OptionalEvent = Partial<Event>;

const mapEventDtoToEvent = (event: EventDto): Event => ({
  ...event
});

const mapEventsDtoToEvent = (events: EventDto[]): Event[] => events.map((event) => mapEventDtoToEvent(event));

export const getAllEvents = () =>
  createApi<EventDto[], Event[]>({
    method: 'get',
    authorize: true,
    url: '/events',
    output: mapEventsDtoToEvent
  });

export const createEvent = (event: Event) =>
  createApi({
    method: 'post',
    authorize: true,
    url: '/events',
    body: { ...event }
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
  createApi({
    method: 'put',
    authorize: true,
    url: `/events/${entryId}/upload/${uploadType}`,
    body: { fileName: fileName }
  });
