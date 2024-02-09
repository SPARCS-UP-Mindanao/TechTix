import { Registration } from '@/model/registrations';

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

export interface CreateDiscounts {
  discountPercentage: number;
  quantity: number;
  organizationName: string;
}

export interface Pricing {
  price: number;
  discount: number;
  transactionFees: number;
  total: number;
}
