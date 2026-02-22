import { createApi } from '@/api/utils/createApi';
import { Discount, CreateDiscount } from '@/model/discount';

export interface OneTimeUseDiscount {
  entryId: string;
  organizationId: string;
  eventId: string;
  createDate: string;
  updateDate: string;
  claimed: boolean;
  discountPercentage: number;
  maxDiscountUses: number;
  currentDiscountUses: number;
  remainingUses: number;
}

interface ReusableDiscount {
  entryId: string;
  eventId: string;
  createDate: string;
  updateDate: string;
  discountPercentage: number;
  organizationId: string;
  claimed?: boolean;
  maxDiscountUses: number;
  currentDiscountUses: number;
  remainingUses: number;
  registration: {
    transactionId: string;
    registrationId: string;
    eventId: string;
    discountCode: string;
    email: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    organization: string;
  };
}

export interface DiscountResponse {
  entryId: string;
  eventId: string;
  createDate: string;
  updateDate: string;
  discountPercentage: number;
  organizationId: string;
  claimed?: boolean;
  maxDiscountUses?: number;
  currentDiscountUses?: number;
  remainingUses?: number;
  registration?: {
    transactionId: string;
    registrationId: string;
    eventId: string;
    discountCode: string;
    email: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    organization: string;
  };
}

export interface DiscountDto {
  organizationId: string;
  discounts: ReusableDiscount[];
}

export type OptionalDiscount = Partial<Discount>;

export const getAllDiscounts = (eventId: string) =>
  createApi<DiscountDto[]>({
    method: 'get',
    authorize: true,
    url: '/discounts',
    queryParams: {
      eventId: eventId
    }
  });

export const createDiscount = (createDiscount: CreateDiscount, eventId: string) =>
  createApi<DiscountDto[], Discount[]>({
    method: 'post',
    authorize: true,
    url: '/discounts',
    body: { ...createDiscount, eventId }
  });

export const getDiscount = (discountCode: string, eventId: string) =>
  createApi<DiscountResponse>({
    method: 'get',
    url: `/discounts/${discountCode}`,
    queryParams: {
      eventId
    }
  });
