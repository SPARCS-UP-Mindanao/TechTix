export interface Event {
  name: string;
  description: string;
  email: string;
<<<<<<< HEAD
  startDate: string | Date;
  endDate: string | Date;
=======
  startDate: string;
  endDate: string;
>>>>>>> 1d502157206dc02f3078d33262755e21c0b36101
  venue: string;
  bannerLink?: string;
  logoLink?: string;
  autoConfirm?: boolean;
  payedEvent?: boolean;
  price: number;
  certificateTemplate?: string;
  status: string;
<<<<<<< HEAD
  entryId?: string;
  createDate?: Date;
  updateDate?: Date;
=======
  entryId: string;
  createDate?: string;
  updateDate?: string;
  createdBy?: string;
  updatedBy?: string;
>>>>>>> 1d502157206dc02f3078d33262755e21c0b36101
}

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
