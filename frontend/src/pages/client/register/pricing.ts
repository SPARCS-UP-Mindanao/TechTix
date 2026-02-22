export const calculateTotalPrice = (
  eventPrice: number,
  transactionFee: number | null = 0,
  discountPercentage: number | null = 0,
  platformFee: number | null = 0
): number => {
  // Apply discount if provided
  const discountedPrice = eventPrice * (1 - (discountPercentage || 0));
  const platformFeePrice = eventPrice * (platformFee || 0);

  // Calculate total with transaction fee and platform fee
  const total = discountedPrice + (transactionFee || 0) + platformFeePrice;

  return total;
};
