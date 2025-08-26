import { useFormContext, useWatch } from 'react-hook-form';
import Separator from '@/components/Separator';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';
import { RegisterFormValues } from '../../hooks/useRegisterForm';

interface SummaryProps {
  event: Event;
}
const SummaryStep = ({ event }: SummaryProps) => {
  const { control } = useFormContext<RegisterFormValues>();
  const [
    email,
    firstName,
    lastName,
    pronouns,
    contactNumber,
    organization,
    jobTitle,
    facebookLink,
    linkedInLink,
    ticketTypeId,
    sprintDay,
    discountCode,
    discountPercentage,
    transactionFee,
    discountedPrice,
    total,
    availTShirt,
    shirtType,
    shirtSize,
    communityInvolvement,
    futureVolunteer,
    dietaryRestrictions,
    accessibilityNeeds
  ] = useWatch({
    control,
    name: [
      'email',
      'firstName',
      'lastName',
      'pronouns',
      'contactNumber',
      'organization',
      'jobTitle',
      'facebookLink',
      'linkedInLink',
      'ticketType',
      'sprintDay',
      'discountCode',
      'discountPercentage',
      'transactionFee',
      'discountedPrice',
      'total',
      'availTShirt',
      'shirtType',
      'shirtSize',
      'communityInvolvement',
      'futureVolunteer',
      'dietaryRestrictions',
      'accessibilityNeeds'
    ]
  });

  const ticketType = event.ticketTypes?.find((ticket) => ticket.id === ticketTypeId);
  const { hasMultipleTicketTypes } = event;

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

          <span className="font-bold">Pronouns: </span>
          <span>{pronouns || 'Prefer not to say'}</span>

          <span className="font-bold">Email: </span>
          <span>{email}</span>

          <span className="font-bold">Phone number: </span>
          <span>{contactNumber}</span>

          <span className="font-bold">Dietary Restrictions: </span>
          <span>{dietaryRestrictions || 'None'}</span>

          <span className="font-bold">Facebook Link: </span>
          <span>{facebookLink}</span>

          <span className="font-bold">Linkedin Link: </span>
          <span>{linkedInLink || 'None'}</span>

          <span className="font-bold">Organization: </span>
          <span>{organization}</span>

          <span className="font-bold">Title: </span>
          <span>{jobTitle}</span>

          {hasMultipleTicketTypes && (
            <>
              <span className="font-bold">Ticket Type: </span>
              <span>{ticketType?.name}</span>
            </>
          )}

          <span className="font-bold">Will join sprint day?: </span>
          <span>{sprintDay ? 'Yes' : 'No'}</span>

          <span className="font-bold">Will avail tshirt?: </span>
          <span>{availTShirt ? 'Yes' : 'No'}</span>

          {availTShirt && (
            <>
              <span className="font-bold">Tshirt Type: </span>
              <span>{shirtType}</span>

              <span className="font-bold">Tshirt Size: </span>
              <span>{shirtSize}</span>
            </>
          )}
        </div>

        {event.paidEvent && event.status !== 'preregistration' && <hr />}
        {event.paidEvent && event.status !== 'preregistration' && (
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
