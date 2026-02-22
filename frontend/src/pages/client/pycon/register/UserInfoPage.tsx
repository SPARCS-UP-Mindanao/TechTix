import { FC, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import moment from 'moment';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import ImageViewer from '@/components/ImageViewer';
import Modal from '@/components/Modal';
import Separator from '@/components/Separator';
import Skeleton from '@/components/Skeleton';
import { getEvent } from '@/api/events';
import { getEventRegistrationWithEmail } from '@/api/pycon/registrations';
import { formatMoney } from '@/utils/functions';
import { useApiQuery } from '@/hooks/useApi';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const UserInfoPage = () => {
  const { eventId } = useParams();
  const auth = useCurrentUser();

  const [showModal, setShowModal] = useState(false);

  const { data: event, isPending: eventPending } = useApiQuery(getEvent(eventId!));
  const { data: registration, isPending: registrationPending } = useApiQuery(getEventRegistrationWithEmail(eventId!, auth?.user?.email!));

  if (eventPending || registrationPending) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!registration?.data || !event?.data) {
    return <Navigate to={`/${eventId}/register`} />;
  }

  const { name, startDate, endDate, venue } = event.data;

  const {
    email,
    firstName,
    lastName,
    pronouns,
    contactNumber,
    organization,
    jobTitle,
    facebookLink,
    linkedInLink,
    ticketType,
    sprintDay,
    discountCode,
    amountPaid,
    // availTShirt,
    communityInvolvement,
    futureVolunteer,
    dietaryRestrictions,
    accessibilityNeeds,
    validIdObjectKey
  } = registration.data;

  const isSameDayEvent = moment(startDate).isSame(endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(endDate).format('LT')}`;
    }
    return `${moment(startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(endDate).format('MMMM Do YYYY')}`;
  };

  return (
    <section className="flex flex-col space-y-4 mb-4 text-pycon-custard max-w-6xl mx-auto pt-0 md:pt-10 px-4">
      <h1>See you at {name}!</h1>

      <p className="text-pycon-custard-light">Please follow DurianPy's social media accounts and check your email for updates!</p>

      <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-pycon-custard-light">
        <Icon name="Clock" className="col-span-1 shrink-0" />
        <p className="text-sm col-span-1 font-nunito">{getDate()}</p>

        <Icon name="MapPin" className="col-span-1 shrink-0" />
        <p className="text-sm col-span-1 font-nunito">{venue}</p>
      </div>

      <p className="text-pycon-custard-light text-sm mt-4">Here are the details of your registration:</p>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4 max-w-3xl">
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

        <span className="font-bold">Ticket Type</span>
        <span className="break-words" title={ticketType}>
          {ticketType}
        </span>

        {discountCode && (
          <>
            <span className="font-bold">Discount code used:</span>
            <span className="break-words" title={discountCode}>
              {discountCode}
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
        </span> */}

        <span className="font-bold">Are you a member of any local tech community?</span>
        <span className="break-words" title={communityInvolvement ? 'Yes' : 'No'}>
          {communityInvolvement ? 'Yes' : 'No'}
        </span>

        <span className="font-bold">Would you like to volunteer in the future?</span>
        <span className="break-words" title={futureVolunteer ? 'Yes' : 'No'}>
          {futureVolunteer ? 'Yes' : 'No'}
        </span>

        <span className="font-bold">Amount Paid</span>
        <span className="break-words" title={formatMoney(amountPaid, 'PHP')}>
          {formatMoney(amountPaid, 'PHP')}
        </span>
      </div>

      <Button
        className="mx-auto cursor-pointer bg-pycon-custard-light text-pycon-violet! hover:bg-pycon-custard rounded-full w-full max-w-sm py-4"
        onClick={() => setShowModal(true)}
      >
        View submitted ID
      </Button>

      <UserIdModal eventId={eventId!} validIdObjectKey={validIdObjectKey} showModal={showModal} setShowModal={setShowModal} />
    </section>
  );
};

interface UserIdModalProps {
  eventId: string;
  validIdObjectKey: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

const UserIdModal: FC<UserIdModalProps> = ({ eventId, showModal, validIdObjectKey, setShowModal }) => {
  return (
    <Modal modalTitle="Submitted ID" visible={showModal} onOpenChange={setShowModal} className="md:max-w-[80%] bg-pycon-violet">
      <div className="flex flex-col w-full items-center">
        <ImageViewer eventId={eventId} objectKey={validIdObjectKey} className="h-50 w-min" />
      </div>
    </Modal>
  );
};

export const Component = UserInfoPage;

export default UserInfoPage;
