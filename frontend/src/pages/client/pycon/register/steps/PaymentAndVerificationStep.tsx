import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Button from '@/components/Button';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError, FormDescription } from '@/components/Form';
import Input from '@/components/Input';
import { EVENT_UPLOAD_TYPE } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';
import PaymentGateways from '@/pages/client/register/steps/PaymentGateways';
import { RegisterFormValues } from '../../hooks/useRegisterForm';
import { calculateTotalPrice } from '../pricing';
import { useDiscount } from '../useDiscount';
import { useTransactionFee } from '../useTransactionFee';

interface Props {
  eventId: string;
  eventPrice: number;
  platformFee: number | null;
  isFeesLoading: boolean;
  setIsFeesLoading: (isLoading: boolean) => void;
}

const PaymentAndVerificationStep = ({ eventId, eventPrice, platformFee, isFeesLoading, setIsFeesLoading }: Props) => {
  const { control } = useFormContext<RegisterFormValues>();
  const { getTransactionFee } = useTransactionFee(eventPrice, platformFee, setIsFeesLoading);
  const { discountPercentage, isValidatingDiscountCode, validateDiscountCode } = useDiscount(eventPrice);
  const [transactionFee, sprintDay] = useWatch({ name: ['transactionFee', 'sprintDay'], control });
  const discountedPrice = eventPrice * (1 - (discountPercentage ?? 0));
  const total = calculateTotalPrice(eventPrice, transactionFee ?? null, discountPercentage ?? null, platformFee ?? null) + (sprintDay ? 200 : 0);

  useEffect(() => {
    getTransactionFee();
  }, [getTransactionFee]);

  const getTransactionFeeContent = () => {
    if (isFeesLoading) {
      return 'Loading...';
    }

    if (!transactionFee) {
      return 'Select a payment method';
    }

    return formatMoney(transactionFee, 'PHP');
  };

  return (
    <>
      <FormItem name="validIdObjectKey">
        {({ field: { name, value, onChange } }) => (
          <div>
            <FormLabel>Valid ID</FormLabel>
            <FormDescription>Valid ID is required upon entry to venue</FormDescription>
            <FileUpload name={name} eventId={eventId} uploadType={EVENT_UPLOAD_TYPE.VALID_ID} value={value} onChange={onChange} />
            <FormError />
          </div>
        )}
      </FormItem>

      <hr />

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

      <PaymentGateways getTransactionFee={getTransactionFee} />

      <hr />
      <div className="flex flex-col items-start gap-5">
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-2 gap-5">
            <h4>Price:</h4>
            <p>{formatMoney(eventPrice, 'PHP')}</p>
            {sprintDay && (
              <>
                <h4>Sprint Day:</h4>
                <p>{formatMoney(200, 'PHP')}</p>
              </>
            )}
            <h4>Discount:</h4>
            <p>{discountPercentage ? <span>{formatPercentage(discountPercentage)}</span> : 'None'}</p>
            <h4>Discounted Price:</h4>
            <p>{discountPercentage ? formatMoney(discountedPrice, 'PHP') : 'None'}</p>
            <h4>Transaction Fee:</h4>
            <p>{getTransactionFeeContent()}</p>
            {platformFee && (
              <>
                <h4>Platform Fee:</h4>
                <p>{formatMoney(eventPrice * platformFee, 'PHP')}</p>
              </>
            )}
            <h4>Total:</h4>
            <p>{formatMoney(total, 'PHP')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentAndVerificationStep;
