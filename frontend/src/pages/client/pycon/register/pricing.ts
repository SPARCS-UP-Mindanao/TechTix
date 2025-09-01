export const calculateTotalPrice = ({
  price,
  sprintDayPrice = 0,
  transactionFee = 0,
  discountPercentage = 0,
  platformFee = 0
}: {
  price: number;
  transactionFee: number;
  discountPercentage: number;
  platformFee: number;
  sprintDayPrice: number;
}): number => {
  // Apply discount if provided
  const discountedPrice = calculateDiscountedPrice({ price, discountPercentage });
  const platformFeePrice = price * platformFee;

  // Calculate total with transaction fee and platform fee
  const total = discountedPrice + transactionFee + platformFeePrice + sprintDayPrice;

  return total;
};

export const calculateDiscountedPrice = ({ price, discountPercentage }: { price: number; discountPercentage: number }) => {
  return price * (1 - discountPercentage);
};
