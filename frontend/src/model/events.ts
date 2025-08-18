import { FAQUpdateValues } from '@/api/events';
import { EventFormValues } from '@/hooks/useAdminEventForm';
import { FAQsFormValues } from '@/hooks/useFAQsForm';

export interface TicketType {
  name: string;
  description?: string;
  tier: string;
  originalPrice?: number;
  price: number;
  maximumQuantity: number;
  konfhubId: string;
  currentSales?: number | null;
}

export interface Event {
  name: string;
  description: string;
  email: string;
  startDate: string;
  endDate: string;
  venue: string;
  paidEvent: boolean;
  price: number;
  bannerLink: string | null;
  logoLink: string | null;
  certificateTemplate: string | null;
  status: EventStatus;
  eventId: string;
  isLimitedSlot: boolean;
  isApprovalFlow: boolean;
  registrationCount: number;
  maximumSlots: number | null;
  createDate?: string;
  updateDate?: string;
  createdBy?: string;
  updatedBy?: string;
  bannerUrl?: string;
  logoUrl?: string;
  certificateTemplateUrl?: string;
  hasMultipleTicketTypes: boolean;
  ticketTypes: TicketType[] | null;
  konfhubId: string | null;
  konfhubApiKey: string | null;
  platformFee: number | null;
}

export type EventStatus = 'draft' | 'preregistration' | 'open' | 'cancelled' | 'closed' | 'completed';
type EventStatusItem = {
  value: EventStatus;
  label: string;
};

export const EVENT_STATUSES: EventStatusItem[] = [
  {
    value: 'draft',
    label: 'Draft'
  },
  {
    value: 'preregistration',
    label: 'Pre-registration'
  },
  {
    value: 'open',
    label: 'Open'
  },
  {
    value: 'cancelled',
    label: 'Cancelled'
  },
  {
    value: 'closed',
    label: 'Closed'
  },
  {
    value: 'completed',
    label: 'Completed'
  }
];

export type UploadType = 'banner' | 'logo' | 'certificateTemplate' | 'proofOfPayment' | 'gcashQRCode';

export const EVENT_UPLOAD_TYPE: Record<string, UploadType> = {
  BANNER: 'banner',
  LOGO: 'logo',
  CERTIFICATE_TEMPLATE: 'certificateTemplate',
  PROOF_OF_PAYMENT: 'proofOfPayment',
  GCASH_QR: 'gcashQRCode'
};
export type EventFAQs = {
  isActive: boolean;
  faqs: FAQ[];
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export interface EventWithRefetchEvent extends Event {
  refetchEvent: () => void;
}

export const mapEventToFormValues = (event: Event): EventFormValues => ({
  name: event.name,
  description: event.description,
  email: event.email,
  startDate: event.startDate,
  endDate: event.endDate,
  venue: event.venue,
  paidEvent: event.paidEvent,
  price: event.price,
  status: event.status,
  bannerLink: event.bannerLink || undefined,
  logoLink: event.logoLink || undefined,
  certificateTemplate: event.certificateTemplate || undefined,
  isLimitedSlot: event.isLimitedSlot,
  isApprovalFlow: event.isApprovalFlow || false,
  maximumSlots: event.maximumSlots || undefined,
  hasMultipleTicketTypes: event.hasMultipleTicketTypes || false,
  ticketTypes: event.ticketTypes || undefined,
  konfhubId: event.konfhubId || undefined,
  konfhubApiKey: event.konfhubApiKey || undefined,
  platformFee: event.platformFee ? event.platformFee * 100 : undefined,
  isUsingPlatformFee: !!event.platformFee
});

export interface CreateEvent {
  name: string;
  description: string;
  email: string;
  startDate: string;
  endDate: string;
  venue: string;
  paidEvent: boolean;
  price: number;
  bannerLink: string | null;
  logoLink: string | null;
  certificateTemplate: string | null;
  isLimitedSlot: boolean;
  isApprovalFlow: boolean;
  maximumSlots: number | null;
  status: EventStatus;
  hasMultipleTicketTypes: boolean;
  ticketTypes: TicketType[] | null;
  konfhubId: string | null;
  konfhubApiKey: string | null;
  platformFee: number | null;
}

export type UpdateEvent = CreateEvent;

export const mapCreateEventValues = (values: EventFormValues): CreateEvent => ({
  name: values.name,
  description: values.description,
  email: values.email,
  startDate: values.startDate,
  endDate: values.endDate,
  venue: values.venue,
  paidEvent: values.paidEvent,
  price: values.paidEvent ? values.price : 0,
  status: values.status,
  maximumSlots: values.maximumSlots || null,
  isLimitedSlot: values.isLimitedSlot,
  isApprovalFlow: values.isApprovalFlow,
  bannerLink: values.bannerLink || null,
  logoLink: values.logoLink || null,
  certificateTemplate: values.certificateTemplate || null,
  hasMultipleTicketTypes: values.hasMultipleTicketTypes,
  ticketTypes: values.ticketTypes
    ? values.ticketTypes.map((ticket) => ({
        name: ticket.name,
        price: ticket.price,
        tier: ticket.tier,
        maximumQuantity: ticket.maximumQuantity,
        konfhubId: ticket.konfhubId,
        description: ticket.description
      }))
    : null,
  konfhubId: values.konfhubId || null,
  konfhubApiKey: values.konfhubApiKey || null,
  platformFee: transformPlatformFee(values.isUsingPlatformFee, values.platformFee)
});

const transformPlatformFee = (isUsingPlatformFee: boolean, platformFee?: number) => (isUsingPlatformFee && platformFee ? platformFee / 100 : null);

export const mapUpdateEventValues = mapCreateEventValues;

export const removeFAQIds = (value: FAQsFormValues): FAQUpdateValues => {
  const faqsWithNoId =
    value.faqs?.map((faq) => ({
      question: faq.question,
      answer: faq.answer
    })) ?? [];
  return { ...value, faqs: faqsWithNoId };
};
