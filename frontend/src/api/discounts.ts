import { createApi } from '@/api/utils/createApi';
import { Discount, CreateDiscounts } from '@/model/discount';

export interface DiscountDto {
    entryId: string;
    eventId: string;
    createDate: string;
    updateDate: string;
    discountId: string;
    claimed: boolean;
    discountPercentage: number;
    registrationId?: string;
}

export type OptionalDiscount = Partial<Discount>;

const mapDiscountDtoToDiscount = (discount: DiscountDto): Discount => ({
  ...discount
});

const mapDiscountsDtoToDiscount = (discounts: DiscountDto[]): Discount[] => discounts.map((discount) => mapDiscountDtoToDiscount(discount));

export const getAllDiscounts = (eventId: string) =>
  createApi<DiscountDto[], Discount[]>({
    method: 'get',
    authorize: true,
    url: '/discounts',
    queryParams: {
        eventId: eventId
    },
    output: mapDiscountsDtoToDiscount
  });

export const createDiscount = (createDiscount: CreateDiscounts) =>
  createApi({
    method: 'post',
    authorize: true,
    url: '/discounts',
    body: { ...createDiscount }
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
