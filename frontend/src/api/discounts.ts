import { createApi } from '@/api/utils/createApi';
import { Discount, CreateDiscounts, DiscountOrganization } from '@/model/discount';
import { RegisterUserInfo } from '@/model/registrations';

export interface DiscountDto {
  entryId: string;
  eventId: string;
  createDate: string;
  updateDate: string;
  claimed: boolean;
  discountPercentage: number;
  registration?: RegisterUserInfo;
  organizationId: string;
}

export type OptionalDiscount = Partial<Discount>;

const mapDiscountDtoToDiscount = (discount: DiscountDto): Discount => ({
  ...discount
});

export const getAllDiscounts = (eventId: string) =>
  createApi<DiscountOrganization[]>({
    method: 'get',
    authorize: true,
    url: '/discounts',
    queryParams: {
      eventId: eventId
    }
  });

export const createDiscount = (createDiscount: CreateDiscounts, eventId: string) =>
  createApi<DiscountDto[], Discount[]>({
    method: 'post',
    authorize: true,
    url: '/discounts',
    body: { ...createDiscount, eventId: eventId }
  });

export const getDiscount = (entryId: string, eventId: string) =>
  createApi<DiscountDto, Discount>({
    method: 'get',
    url: `/discounts/${entryId}`,
    queryParams: {
      eventId: eventId
    },
    output: mapDiscountDtoToDiscount
  });
