import { useFormContext } from 'react-hook-form';
import Separator from '@/components/Separator';
import { Pricing } from '@/model/discount';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';

interface SummaryProps {
  event: Event;
  pricing: Pricing;
}
const Summary = ({ event, pricing }: SummaryProps) => {
  const { watch } = useFormContext();
  const summary = watch();
  return (
    <div className="space-y-2 mb-4">
      <p className="w-full text-center">Please review the information below before submitting.</p>
      <Separator />
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-5">
          <span className="font-bold">First name: </span>
          <span>{summary.firstName}</span>

          <span className="font-bold">Last name: </span>
          <span>{summary.lastName}</span>

          <span className="font-bold">Email: </span>
          <span>{summary.email}</span>

          <span className="font-bold">Phone number: </span>
          <span>{summary.contactNumber}</span>

          <span className="font-bold">Professional Status: </span>
          <span>{summary.careerStatus}</span>

          <span className="font-bold">Years of Experience: </span>
          <span>{summary.yearsOfExperience}</span>

          <span className="font-bold">Organization: </span>
          <span>{summary.organization}</span>

          <span className="font-bold">Title: </span>
          <span>{summary.title}</span>
        </div>

        <hr />

        <div className="grid grid-cols-2 gap-5">
          <span className="font-bold">Price:</span>
          <p>{formatMoney(pricing.price, 'PHP')}</p>

          {event.payedEvent && summary.discountCode && (
            <>
              <span className="font-bold">Discount Code: </span>
              <span>{summary.discountCode}</span>

              <span className="font-bold">Discount</span>
              <span>{pricing.discount == 0 ? 'None' : <span>-{formatPercentage(pricing.discount)}</span>}</span>

              <span className="font-bold">Discounted Price</span>
              <span>{formatMoney(pricing.discountedPrice, 'PHP')}</span>
            </>
          )}

          <span className="font-bold">Transaction Fee</span>
          <span>{formatMoney(pricing.transactionFees, 'PHP')}</span>

          <span className="font-bold">Total</span>
          <span>{formatMoney(pricing.total, 'PHP')}</span>
        </div>
      </div>
    </div>
  );
};

export default Summary;
