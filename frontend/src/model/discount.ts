import { DiscountDto } from '@/api/discounts';
import { EventStatus } from './events';

export type Discount = DiscountDto['discounts'][number];
export type OrganizationDiscount = DiscountDto;

export interface CreateDiscount {
  discountPercentage: number;
  quantity?: number;
  organizationName: string;
  isReusable?: boolean;
  maxDiscountUses?: number;
  discountName?: string;
  remainingUses?: number;
}

export interface Pricing {
  price: number;
  discount: number;
  transactionFees: number;
  total: number;
  discountedPrice: number;
}

export const enabledDiscountStatus: EventStatus[] = ['draft', 'preregistration', 'open'];
