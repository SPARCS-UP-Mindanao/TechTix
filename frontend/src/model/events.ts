export interface Event {
  name: string;
  description: string;
  email: string;
  startDate: string;
  endDate: string;
  venue: string;
  bannerLink?: string | null;
  logoLink?: string | null;
  autoConfirm?: boolean;
  payedEvent?: boolean;
  price: number;
  certificateTemplate?: string | null;
  status: EventStatusValue;
  entryId?: string;
  createDate?: string;
  updateDate?: string;
  createdBy?: string;
  updatedBy?: string;
  bannerUrl?: string;
  logoUrl?: string;
  certificateTemplateUrl?: string;
}

export type EventStatusValue = 'draft' | 'open' | 'cancelled' | 'closed' | 'completed';

export const EVENT_STATUSES = [
  {
    value: 'draft',
    label: 'Draft'
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

export const SHOW_EVENT_REGISTRATION_ON_STATUS = ['open', 'cancelled', 'closed', 'completed'];
export const showEvent = (eventStatus: EventStatusValue) => SHOW_EVENT_REGISTRATION_ON_STATUS.includes(eventStatus);

export const enum EVENT_UPLOAD_TYPE {
  BANNER = 'banner',
  LOGO = 'logo',
  CERTIFICATE_TEMPLATE = 'certificateTemplate'
}

export const enum EVENT_OBJECT_KEY_MAP {
  BANNER = 'bannerLink',
  LOGO = 'logoLink',
  CERTIFICATE_TEMPLATE = 'certificateTemplate'
}
