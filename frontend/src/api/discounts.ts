import { createApi } from '@/api/utils/createApi';
import { Discount, CreateDiscounts, OrganizationDiscount } from '@/model/discount';
import { Registration } from '@/model/registrations';

export interface DiscountDto {
  entryId: string;
  eventId: string;
  claimed: boolean;
  discountPercentage: number;
  registration?: Registration;
  organizationId: string;
  createDate: string;
  updateDate: string;
}

export type OptionalDiscount = Partial<Discount>;

const mapDiscountDtoToDiscount = (discount: DiscountDto): Discount => ({
  ...discount
});

export const getAllDiscounts = (eventId: string) =>
  createApi<OrganizationDiscount[]>({
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
    body: { ...createDiscount, eventId }
  });

export const getDiscount = (entryId: string, eventId: string) =>
  createApi<DiscountDto, Discount>({
    method: 'get',
    url: `/discounts/${entryId}`,
    queryParams: {
      eventId
    },
    output: mapDiscountDtoToDiscount
  });
