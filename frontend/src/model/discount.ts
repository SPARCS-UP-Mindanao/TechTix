export interface Discount {
    entryId: string;
    eventId: string;
    claimed: boolean;
    discountPercentage: number;
    registrationId?: string;
}

export interface CreateDiscounts {
    eventId: string;
    discountPercentage: number;
    quantity: number;
}

export interface Pricing {
    price: number;
    discount: number;
    total: number;
  }
