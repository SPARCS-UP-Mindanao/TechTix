export interface Event {
  name: string;
  description: string;
  email?: string;
  startDate: string | Date;
  endDate: string | Date;
  venue: string;
  bannerLink?: string;
  logoLink?: string;
  autoConfirm?: boolean;
  payedEvent?: boolean;
  price: number;
  certificateTemplate?: string;
  status?: string;
  entryId?: string;
  createDate?: Date;
  updateDate?: Date;
  createdBy?: string;
  updatedBy?: string;
}
