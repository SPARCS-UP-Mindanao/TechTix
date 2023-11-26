import { RegisterUserInfo } from '@/model/registrations';

export interface Discount {
  entryId: string;
  eventId: string;
  claimed: boolean;
  discountPercentage: number;
  registration?: RegisterUserInfo;
  organizationId: string;
}

export interface DiscountOrganization {
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
  total: number;
}
