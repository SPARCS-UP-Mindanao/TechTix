import { useState } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/components/Button';
import { FormDescription, FormItem, FormLabel, FormError } from '@/components/Form';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import Separator from '@/components/Separator';
import { claimCertificate } from '@/api/evaluations';
import { useApi } from '@/hooks/useApi';
import { ClaimCertificateFormSchema } from '@/hooks/useCheckEmailForm';
import { Event } from '@/model/events';
import { zodResolver } from '@hookform/resolvers/zod';

const EventInformation = ({
  event,
  // nextStep,
  // eventId,
  claimCertificateForm,
  submit
}: {
  event: Event;
  nextStep: () => void;
  eventId: string | undefined;
  claimCertificateForm: any;
  submit: () => void;
}) => {
  const isSameDayEvent = moment(event.startDate).isSame(event.endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(event.startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(event.endDate).format('LT')}`;
    }
    return `${moment(event.startDate).format('MMMM Do YYYY')} - ${moment(event.endDate).format('MMMM Do YYYY')}`;
  };

  return (
    <>
      <div className="w-full">
        <h1 className="text-lg">{event.name}</h1>
        <div className="w-full mt-3.5 space-y-1.5 items-start">
          <div className="flex">
            <Icon name="Clock" weight="light" className="w-6 h-6" />
            <span className="text-sm font-raleway font-medium text-left leading-5 ml-1">{getDate()}</span>
          </div>
          <div className="flex">
            <Icon name="MapPin" weight="light" className="w-6 h-6" />
            <p className="text-sm font-raleway font-medium text-left leading-5 ml-1">{event.venue}</p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col items-center w-full">
          <p className="text-left font-raleway font-semibold text-lg leading-5 tracking-tight mb-6">Claim your certificate by evaluating the event</p>
          <FormProvider {...claimCertificateForm}>
            <FormItem name="email">
              {({ field }) => (
                <div className="flex flex-col items-start space-y-2 w-full">
                  <FormLabel className="font-raleway text-neutral-50 font-medium leading-5 tracking-tight">Enter your e-mail</FormLabel>
                  <Input type="email" placeholder="Email" {...field} />
                  <FormDescription>Please enter the email address you used when registering for the event</FormDescription>
                  <FormError />
                </div>
              )}
            </FormItem>
            <Button onClick={submit} variant="gradient" className="py-6 px-20 my-10">
              Evaluate
            </Button>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default EventInformation;
