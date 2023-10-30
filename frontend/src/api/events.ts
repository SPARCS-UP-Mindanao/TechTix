import { createApi } from "@/api/utils/createApi";
import { Event } from "@/model/events";

export interface EventDto {
  name: string;
  description: string;
  email: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  bannerLink: string;
  logoLink: string;
  autoConfirm: true;
  payedEvent: true;
  price: number;
  certificateTemplate: string;
  status: string;
  entryId: string;
  createDate: Date;
  updateDate: Date;
  createdBy: string;
  updatedBy: string;
}

type OptionalEvent = Partial<Event>;

const mapEventDtoToEvent = (event: EventDto): Event => ({
  name: event.name,
  description: event.description,
  email: event.email,
  startDate: event.startDate,
  endDate: event.endDate,
  venue: event.venue,
  bannerLink: event.bannerLink,
  logoLink: event.logoLink,
  autoConfirm: event.autoConfirm,
  payedEvent: event.payedEvent,
  price: event.price,
  certificateTemplate: event.certificateTemplate,
  status: event.status,
  entryId: event.entryId,
  createDate: event.createDate,
  updateDate: event.updateDate,
  createdBy: event.createdBy,
  updatedBy: event.updatedBy,
});

const mapEventsDtoToEvent = (events: EventDto[]): Event[] =>
  events.map((event) => mapEventDtoToEvent(event));

export const getAllEvents = () =>
  createApi<EventDto[], Event[]>({
    method: "get",
    url: "/events",
    output: mapEventsDtoToEvent,
  });

export const createEvent = (event: Event) =>
  createApi({
    method: "post",
    url: "/events",
    params: { event },
  });

export const getEvent = (entryId: string) =>
  createApi<EventDto, Event>({
    method: "get",
    url: `/events/${entryId}`,
    output: mapEventDtoToEvent,
  });
export const updateEvent = (entryId: string, event: OptionalEvent) =>
  createApi<EventDto, Event>({
    method: "put",
    url: `/events/${entryId}`,
    params: { event },
    output: mapEventDtoToEvent,
  });

export const deleteEvent = (entryId: string, event: OptionalEvent) =>
  createApi<EventDto, Event>({
    method: "delete",
    url: `/events/${entryId}`,
    params: { event },
    output: mapEventDtoToEvent,
  });
