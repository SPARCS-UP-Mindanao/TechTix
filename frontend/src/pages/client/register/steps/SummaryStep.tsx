import { useFormContext } from 'react-hook-form';
import Separator from '@/components/Separator';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';
import { RegisterFormValues } from '@/hooks/useRegisterForm';

interface SummaryProps {
  event: Event;
}
const SummaryStep = ({ event }: SummaryProps) => {
  const { watch } = useFormContext<RegisterFormValues>();
  const {
    email,
    firstName,
    lastName,
    contactNumber,
    careerStatus,
    yearsOfExperience,
    organization,
    title,
    discountCode,
    discountPercentage,
    transactionFee,
    discountedPrice,
    total
  } = watch();
  return (
    <div className="space-y-2 mb-4">
      <p className="w-full text-center">Please review the information below before submitting.</p>
      <Separator />
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-5">
          <span className="font-bold">First name: </span>
          <span>{firstName}</span>

          <span className="font-bold">Last name: </span>
          <span>{lastName}</span>

          <span className="font-bold">Email: </span>
          <span>{email}</span>

          <span className="font-bold">Phone number: </span>
          <span>{contactNumber}</span>

          <span className="font-bold">Professional Status: </span>
          <span>{careerStatus}</span>

          <span className="font-bold">Years of Experience: </span>
          <span>{yearsOfExperience}</span>

          <span className="font-bold">Organization: </span>
          <span>{organization}</span>

          <span className="font-bold">Title: </span>
          <span>{title}</span>
        </div>

        {event.paidEvent && <hr />}
        {event.paidEvent && (
          <div className="grid grid-cols-2 gap-5">
            <span className="font-bold">Price:</span>
            <p>{formatMoney(event.price, 'PHP')}</p>

            {discountCode && (
              <>
                <span className="font-bold">Discount Code: </span>
                <span>{discountCode}</span>

                <span className="font-bold">Discount</span>
                <span>{discountPercentage ? <span>-{formatPercentage(discountPercentage)}</span> : 'None'}</span>

                <span className="font-bold">Discounted Price</span>
                <span>{formatMoney(discountedPrice ?? event.price, 'PHP')}</span>
              </>
            )}

            <span className="font-bold">Transaction Fee</span>
            <span>{transactionFee ? <span>{formatMoney(transactionFee, 'PHP')}</span> : 'None'}</span>

            <span className="font-bold">Total</span>
            <span>{formatMoney(total ?? event.price, 'PHP')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SummaryStep;
