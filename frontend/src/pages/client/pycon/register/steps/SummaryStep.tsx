import { useFormContext, useWatch } from 'react-hook-form';
import Checkbox from '@/components/Checkbox';
import { FormItem, FormError } from '@/components/Form';
import Label from '@/components/Label';
import Separator from '@/components/Separator';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';
import { RegisterFormValues } from '../../hooks/useRegisterForm';

const PYCON_CODE_OF_CONDUCT = import.meta.env.VITE_PYCON_CODE_OF_CONDUCT || 'https://pycon-davao.durianpy.org/code-of-conduct';

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
    // availTShirt,
    // shirtType,
    // shirtSize,
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
      // 'availTShirt',
      // 'shirtType',
      // 'shirtSize',
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
      <Separator className="bg-pycon-custard-light" />
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-5">
          <span className="font-bold">First name</span>
          <span className="break-words" title={firstName}>
            {firstName}
          </span>

          <span className="font-bold">Last name</span>
          <span className="break-words" title={lastName}>
            {lastName}
          </span>

          <span className="font-bold">Pronouns</span>
          <span className="break-words" title={pronouns || 'Prefer not to say'}>
            {pronouns || 'Prefer not to say'}
          </span>

          <span className="font-bold">Email</span>
          <span className="break-words" title={email}>
            {email}
          </span>

          <span className="font-bold">Phone number</span>
          <span className="break-words" title={contactNumber}>
            {contactNumber}
          </span>

          <span className="font-bold">Dietary Restrictions</span>
          <span className="break-words" title={dietaryRestrictions || 'None'}>
            {dietaryRestrictions || 'None'}
          </span>

          <span className="font-bold">Accessibility Needs</span>
          <span className="break-words" title={accessibilityNeeds || 'None'}>
            {accessibilityNeeds || 'None'}
          </span>

          <span className="font-bold">Facebook Link</span>
          <span className="break-words" title={facebookLink}>
            {facebookLink}
          </span>

          <span className="font-bold">Linkedin Link</span>
          <span className="break-words" title={linkedInLink || 'None'}>
            {linkedInLink || 'None'}
          </span>

          <span className="font-bold">Organization</span>
          <span className="break-words" title={organization}>
            {organization}
          </span>

          <span className="font-bold">Title</span>
          <span className="break-words" title={jobTitle}>
            {jobTitle}
          </span>

          <Separator className="bg-pycon-custard-light col-span-2" />

          {hasMultipleTicketTypes && (
            <>
              <span className="font-bold">Ticket Type</span>
              <span className="break-words" title={ticketType?.name}>
                {ticketType?.name}
              </span>
            </>
          )}

          <span className="font-bold">Will join sprint day?</span>
          <span className="break-words" title={sprintDay ? 'Yes' : 'No'}>
            {sprintDay ? 'Yes' : 'No'}
          </span>

          {/* <span className="font-bold">Will avail tshirt?</span>
          <span className="break-words" title={availTShirt ? 'Yes' : 'No'}>
            {availTShirt ? 'Yes' : 'No'}
          </span>

          {availTShirt && (
            <>
              <span className="font-bold">Tshirt Type</span>
              <span className="break-words" title={shirtType}>
                {shirtType}
              </span>

              <span className="font-bold">Tshirt Size</span>
              <span className="break-words" title={shirtSize}>
                {shirtSize}
              </span>
            </>
          )} */}

          <span className="font-bold">Are you a member of any local tech community?</span>
          <span className="break-words" title={communityInvolvement ? 'Yes' : 'No'}>
            {communityInvolvement ? 'Yes' : 'No'}
          </span>

          <span className="font-bold">Would you like to volunteer in the future?</span>
          <span className="break-words" title={futureVolunteer ? 'Yes' : 'No'}>
            {futureVolunteer ? 'Yes' : 'No'}
          </span>
          {event.paidEvent && event.status !== 'preregistration' && <hr className="border-pycon-custard-light col-span-2" />}
          {event.paidEvent && event.status !== 'preregistration' && (
            <>
              <span className="font-bold">Price:</span>
              <p>{formatMoney(event.price, 'PHP')}</p>

              {discountPercentage && discountCode && discountedPrice ? (
                <>
                  <span className="font-bold">Discount Code: </span>
                  <span className="break-words" title={discountCode}>
                    {discountCode}
                  </span>

                  <span className="font-bold">Discount</span>
                  <span className="break-words" title={discountPercentage ? `${formatPercentage(discountPercentage)}` : 'None'}>
                    {discountPercentage ? <span>{formatPercentage(discountPercentage)}</span> : 'None'}
                  </span>

                  <span className="font-bold">Discounted Price</span>
                  <span className="break-words" title={formatMoney(discountedPrice ?? event.price, 'PHP')}>
                    {formatMoney(discountedPrice ?? event.price, 'PHP')}
                  </span>
                </>
              ) : (
                <></>
              )}

              {sprintDay && event.sprintDayPrice && (
                <>
                  <span className="font-bold">Sprint Day Fee:</span>
                  <p>{formatMoney(event.sprintDayPrice, 'PHP')}</p>
                </>
              )}

              <span className="font-bold">Transaction Fee</span>
              <span className="break-words">{transactionFee ? <span className="break-words">{formatMoney(transactionFee, 'PHP')}</span> : 'None'}</span>

              <span className="font-bold">Total</span>
              <span className="break-words">{formatMoney(total ?? event.price, 'PHP')}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col mt-8">
        <FormItem name="agreeToDataUse">
          {({ field }) => (
            <div className="">
              <div className="flex items-center space-x-2">
                <Checkbox pyconStyles id="agreeToDataUse" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="agreeToDataUse" className="text-base font-medium">
                  I consent for photography, data use, and communication *
                </Label>
              </div>
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="agreeToCodeOfConduct">
          {({ field }) => (
            <div className="">
              <div className="flex items-center space-x-2">
                <Checkbox pyconStyles id="agreeToCodeOfConduct" checked={field.value} onCheckedChange={field.onChange} />
                <Label htmlFor="agreeToCodeOfConduct" className="text-base font-medium">
                  I agree to follow the{' '}
                  <a href={PYCON_CODE_OF_CONDUCT} target="_blank" className="text-pycon-orange underline">
                    Code of Conduct
                  </a>
                  . *
                </Label>
              </div>
              <FormError />
            </div>
          )}
        </FormItem>
      </div>
    </div>
  );
};

export default SummaryStep;
