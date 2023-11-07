export interface Event {
  name: string;
  description: string;
  email: string;
  startDate: string;
  endDate: string;
  venue: string;
  bannerLink: string;
  logoLink: string;
  autoConfirm: boolean;
  payedEvent: boolean;
  price: number;
  certificateTemplate?: string;
  status: string;
  entryId: string;
  createDate?: string;
  updateDate?: string;
  createdBy?: string;
  updatedBy?: string;
}
