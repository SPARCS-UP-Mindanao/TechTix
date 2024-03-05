import { ulid } from 'ulid';
import { createApi } from '@/api/utils/createApi';
import { Event, EventFAQs, EventStatus, FAQ } from '@/model/events';

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
  isApprovalFlow: boolean;
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

export type EventFAQsDto = Omit<FAQ, 'id'>;

export interface FAQDto {
  faqs: EventFAQsDto[];
  isActive: boolean;
  entryId: string;
  createDate: Date;
  updateDate: Date;
}

export interface FAQUpdateValues {
  faqs: EventFAQsDto[];
  isActive: boolean;
}

const mapFAQsDtoToFAQ = (FAQDto: FAQDto): EventFAQs => {
  const FAQsWithId = FAQDto.faqs.map((faq) => {
    const generatedId = ulid();
    return { ...faq, id: generatedId };
  });
  return { isActive: FAQDto.isActive, faqs: FAQsWithId };
};

const mapEventDtoToEvent = (event: EventDto): Event => ({
  ...event
});

const mapEventsDtoToEvent = (events: EventDto[]): Event[] => events.map((event) => mapEventDtoToEvent(event));

const mapEventsDtoToEventRegCountStatus = (event: EventDto): EventRegCountStatus => ({
  registrationCount: event.registrationCount,
  maximumSlots: event.maximumSlots
});

export const getAllEvents = () =>
  createApi<EventDto[], Event[]>({
    method: 'get',
    url: '/events',
    output: mapEventsDtoToEvent
  });

export const getAdminEvents = (adminId: string) =>
  createApi({
    method: 'get',
    authorize: true,
    url: `/events/admin`,
    queryParams: { adminId },
    output: mapEventsDtoToEvent
  });

export const createEvent = (event: Omit<Event, 'eventId'>) =>
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

export const getFAQs = (entryId: string) =>
  createApi<FAQDto, EventFAQs>({
    method: 'get',
    authorize: true,
    url: `/faqs/${entryId}`,
    output: mapFAQsDtoToFAQ
  });

export const updateFAQs = (entryId: string, faqs: FAQUpdateValues) =>
  createApi<FAQDto>({
    method: 'patch',
    authorize: true,
    url: `/faqs/${entryId}`,
    body: { ...faqs }
  });
