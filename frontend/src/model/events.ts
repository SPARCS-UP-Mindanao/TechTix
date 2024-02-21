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
  paidEvent: boolean;
  price: number;
  certificateTemplate?: string | null;
  gcashQRCode?: string | null;
  gcashName?: string | null;
  gcashNumber?: string | null;
  status: EventStatus;
  eventId?: string;
  isLimitedSlot: boolean;
  registrationCount: number;
  maximumSlots: number | null;
  createDate?: string;
  updateDate?: string;
  createdBy?: string;
  updatedBy?: string;
  bannerUrl?: string;
  logoUrl?: string;
  certificateTemplateUrl?: string;
}

export type EventStatus = 'draft' | 'open' | 'cancelled' | 'closed' | 'completed';

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

export const EVENT_UPLOAD_TYPES = {
  BANNER: 'banner',
  LOGO: 'logo',
  CERTIFICATE_TEMPLATE: 'certificateTemplate',
  PROOF_OF_PAYMENT: 'proofOfPayment',
  GCASH_QR: 'gcashQRCode'
};

export const EVENT_OBJECT_KEY_MAPS = {
  BANNER: 'bannerLink',
  LOGO: 'logoLink',
  CERTIFICATE_TEMPLATE: 'certificateTemplate',
  PROOF_OF_PAYMENT: 'proofOfPayment',
  GCASH_QR: 'gcashQRCode'
};

export type UploadType = keyof typeof EVENT_UPLOAD_TYPE;

export const enum EVENT_UPLOAD_TYPE {
  BANNER = 'banner',
  LOGO = 'logo',
  CERTIFICATE_TEMPLATE = 'certificateTemplate',
  PROOF_OF_PAYMENT = 'proofOfPayment',
  GCASH_QR = 'gcashQRCode'
}

export const enum EVENT_OBJECT_KEY_MAP {
  BANNER = 'bannerLink',
  LOGO = 'logoLink',
  CERTIFICATE_TEMPLATE = 'certificateTemplate',
  GCASH_PAYMENT = 'gcashPayment',
  GCASH_QR = 'gcashQRCode'
}
