import { Registration } from '@/model/registrations';
import { EventStatus } from './events';

export interface Discount {
  entryId: string;
  eventId: string;
  claimed: boolean;
  discountPercentage: number;
  registration?: Registration;
  organizationId: string;
}

export interface OrganizationDiscount {
  organizationId: string;
  discounts: Discount[];
}

export interface CreateDiscount {
  discountPercentage: number;
  quantity: number;
  organizationName: string;
}

export interface Pricing {
  price: number;
  discount: number;
  transactionFees: number;
  total: number;
  discountedPrice: number;
}

export const enabledDiscountStatus: EventStatus[] = ['draft', 'preregistration', 'open'];
