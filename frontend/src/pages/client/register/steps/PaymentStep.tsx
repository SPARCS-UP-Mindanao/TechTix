import { useFormContext } from 'react-hook-form';
import Button from '@/components/Button';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { formatMoney, formatPercentage } from '@/utils/functions';
import { RegisterFormValues } from '@/hooks/useRegisterForm';
import PaymentGateways from '@/pages/client/register/steps/PaymentGateways';
import { useDiscount } from '../useDiscount';
import { useTransactionFee } from '../useTransactionFee';

interface Props {
  eventPrice: number;
  setIsTransactionFeeLoading: (isLoading: boolean) => void;
}

export const calculateTotalPrice = (eventPrice: number, transactionFee?: number | null, discountPercentage?: number) => {
  if (discountPercentage && transactionFee) {
    return eventPrice * (1 - discountPercentage) + transactionFee;
  }

  if (!discountPercentage && transactionFee) {
    return eventPrice + transactionFee;
  }

  return eventPrice;
};

const PaymentStep = ({ eventPrice, setIsTransactionFeeLoading }: Props) => {
  const { watch } = useFormContext<RegisterFormValues>();
  const { isTransactionFeeLoading, getTransactionFee } = useTransactionFee(eventPrice);
  const { discountPercentage, isValidatingDiscountCode, validateDiscountCode } = useDiscount(eventPrice);
  const transactionFee = watch('transactionFee');
  const discountedPrice = eventPrice * (1 - (discountPercentage ?? 0));
  const total = calculateTotalPrice(eventPrice, transactionFee, discountPercentage);

  const getTransactionFeeContent = () => {
    if (isTransactionFeeLoading) {
      return 'Loading...';
    }

    if (!transactionFee) {
      return 'Select a payment method';
    }

    return formatMoney(transactionFee, 'PHP');
  };

  const handleGetTransactionFee = async () => {
    setIsTransactionFeeLoading(true);
    console.debug('getTransactionFee');
    await getTransactionFee();
    setIsTransactionFeeLoading(false);
  };

  return (
    <>
      <FormItem name="discountCode">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel optional>Discount Coupon</FormLabel>
            <div className="flex sm:flex-row flex-col gap-2 w-full items-center">
              <Input type="text" placeholder="Enter Discount Coupon Code" className="w-full sm:w-1/2" {...field} />
              <Button className="w-full sm:w-1/2" disabled={!field.value} onClick={validateDiscountCode} loading={isValidatingDiscountCode}>
                Check Code
              </Button>
            </div>
            <FormError />
          </div>
        )}
      </FormItem>

      <hr />

      <PaymentGateways getTransactionFee={handleGetTransactionFee} />

      <hr />
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-5">
            <h4>Price:</h4>
            <p>{formatMoney(eventPrice, 'PHP')}</p>
            <h4>Discount:</h4>
            <p>{discountPercentage ? <span>{formatPercentage(discountPercentage)}</span> : 'None'}</p>
            <h4>Discounted Price:</h4>
            <p>{discountPercentage ? formatMoney(discountedPrice, 'PHP') : 'None'}</p>
            <h4>Transaction Fee:</h4>
            <p>{getTransactionFeeContent()}</p>
            <h4>Total:</h4>
            <p>{formatMoney(total, 'PHP')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStep;
