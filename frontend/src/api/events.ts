import { ulid } from 'ulid';
import { createApi } from '@/api/utils/createApi';
import { CreateEvent, Event, EventFAQs, EventStatus, FAQ, UpdateEvent, UploadType } from '@/model/events';

export interface TicketTypeDto {
  name: string;
  description: string | null;
  tier: string;
  originalPrice: number | null;
  price: number;
  maximumQuantity: number;
  eventId: string;
  currentSales: number;
}

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
  hasMultipleTicketTypes: boolean;
  ticketTypes: TicketTypeDto[] | null;
  konfhubId: string | null;
  konfhubApiKey: string | null;
  platformFee: number | null;
}

export type OptionalEvent = Partial<Event>;

export interface PresignedUrl {
  uploadLink: string;
  objectKey: string;
}

export interface DownloadUrl {
  downloadLink: string;
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

const mapDtoToTicketTypes = (ticketTypes: TicketTypeDto[]) =>
  ticketTypes.map((x) => ({
    ...x,
    id: x.name.trim().toLowerCase()
  }));

const mapEventDtoToEvent = (event: EventDto): Event => ({
  ...event,
  ticketTypes: event.ticketTypes ? mapDtoToTicketTypes(event.ticketTypes) : null
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

export const createEvent = (event: CreateEvent) =>
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

export const getAdminEvent = (entryId: string) =>
  createApi<EventDto, Event>({
    method: 'get',
    authorize: true,
    url: `/events/admin/${entryId}`,
    output: mapEventDtoToEvent
  });

export const updateEvent = (entryId: string, event: UpdateEvent) =>
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

export const getPresignedUrl = (entryId: string, fileName: string, uploadType: UploadType, headers?: object) =>
  createApi<PresignedUrl>({
    method: 'put',
    url: `/events/${entryId}/upload/${uploadType}`,
    headers,
    body: { fileName }
  });

export const getDownloadUrl = (entryId: string, objectKey: string) =>
  createApi<DownloadUrl>({
    method: 'get',
    url: `/events/${entryId}/download`,
    queryParams: { objectKey }
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
