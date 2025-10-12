import { FC } from 'react';
import moment from 'moment';
import { FormProvider } from 'react-hook-form';
import { FormDescription, FormItem, FormLabel, FormError } from '@/components/Form';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import Separator from '@/components/Separator';
import { Event } from '@/model/events';

interface Props {
  event: Event;
  nextStep: () => void;
  eventId: string | undefined;
  claimCertificateForm: any;
}

const EventInformation: FC<Props> = ({
  event,
  // nextStep,
  // eventId,
  claimCertificateForm
}) => {
  const isSameDayEvent = moment(event.startDate).isSame(event.endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(event.startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(event.endDate).format('LT')}`;
    }
    return `${moment(event.startDate).format('MMMM Do YYYY')} - ${moment(event.endDate).format('MMMM Do YYYY')}`;
  };

  return (
    <div className="w-full">
      <h1 className="text-lg">{event.name}</h1>
      <div className="w-full mt-3.5 space-y-1.5 items-start">
        <div className="flex items-center space-x-2">
          <Icon name="Clock" />
          <p className="text-sm">{getDate()}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name="MapPin" />
          <p className="text-sm">{event.venue}</p>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col items-center w-full">
        <p className="font-raleway font-semibold text-lg leading-5 tracking-tight mb-6 text-center">Claim your certificate by evaluating the event</p>
        <FormProvider {...claimCertificateForm}>
          <FormItem name="email">
            {({ field }) => (
              <div className="flex flex-col items-start space-y-2 w-full">
                <FormLabel className="font-raleway text-neutral-50 font-medium leading-5 tracking-tight">Enter your Email</FormLabel>
                <Input type="email" placeholder="Email" className="bg-pycon-custard-light" {...field} />
                <FormDescription>Please enter the email address you used when registering for the event</FormDescription>
                <FormError />
              </div>
            )}
          </FormItem>
        </FormProvider>
      </div>
    </div>
  );
};

export default EventInformation;
