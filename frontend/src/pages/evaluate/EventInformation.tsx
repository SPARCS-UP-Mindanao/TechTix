import { useState } from 'react';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/components/Button';
import { FormDescription, FormItem, FormLabel, FormError } from '@/components/Form';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import { claimCertificate } from '@/api/evaluations';
import { useApi } from '@/hooks/useApi';
import { ClaimCertificateFormSchema } from '@/hooks/useCheckEmailForm';
import { Event } from '@/model/events';
import { zodResolver } from '@hookform/resolvers/zod';

// const ClaimCertificateSchema = z.object({
//   email: z.string().email({
//     message: 'Please enter a valid email address'
//   })
// });

// TO REMOVE
// const logo_placeholder = [
//   "1UNEuxhoCBbFXkEnmWfpwaBykjLTkOMDE",
//   "1NXwPcnLz_FiLeilirIOly-o5Pa_lFqh1",
//   "15ouLpbrCkm-PNbr2JJiz-QNruKj2zURc",
//   "1J1H5NsTH37NjSM768dLZCVjLBMSIfNcv",
// ];

const EventInformation = ({
  event,
  nextStep,
  eventId,
  claimCertificateForm,
  submit
}: {
  event: Event;
  nextStep: () => void;
  eventId: string | undefined;
  claimCertificateForm: any;
  submit: () => void;
}) => {
  // const form = useForm<z.infer<typeof ClaimCertificateSchema>>({
  //   mode: 'onChange',
  //   resolver: zodResolver(ClaimCertificateSchema),
  //   defaultValues: {
  //     email: ''
  //   }
  // });

  // const [loading, setLoading] = useState(false);

  // const submit = form.handleSubmit(async ({ email }) => {
  //   const { queryFn: checkEmail } = claimCertificate(email, eventId);
  //   const response = await checkEmail();

  //   if (response.data) {
  //   }
  // });

  const isSameDayEvent = moment(event.startDate).isSame(event.endDate, 'day');
  const getDate = () => {
    if (isSameDayEvent) {
      return `${moment(event.startDate).format('MMMM Do YYYY, h:mm A')} - ${moment(event.endDate).format('LT')}`;
    }
    return `${moment(event.startDate).format('MMMM Do YYYY')} - ${moment(event.endDate).format('MMMM Do YYYY')}`;
  };

  return (
    <>
      <div className="mt-6 w-full">
        <p className="text-xl font-subjectivity font-bold text-left leading-6">{event.name}</p>
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
        <hr className="bg-neutral-200 my-9" />
        <div className="flex flex-col items-center">
          <p className="text-left font-raleway font-semibold text-lg leading-5 tracking-tight mb-6">Claim your certificate by evaluating the event</p>
          <FormProvider {...claimCertificateForm}>
            <FormItem name="email">
              {({ field }) => (
                <div className="flex flex-col items-start space-y-2">
                  <FormLabel className="font-raleway text-neutral-50 font-medium leading-5 tracking-tight">Enter your e-mail</FormLabel>
                  <Input
                    type="email"
                    {...field}
                    className="text-neutral-300 rounded-2xl py-3 px-6 my-3 bg-neutral-900 tracking-tighter leading-5"
                    placeholder="Email"
                  />
                  <FormDescription className="text-left font-raleway font-medium text-sm leading-4 tracking-tighter text-neutral-300">
                    *Please enter the email address you used when registering for the event
                  </FormDescription>
                  <FormError />
                </div>
              )}
            </FormItem>
            <Button
              onClick={submit}
              className="py-3 px-12 rounded-2xl font-bold font-raleway leading text-white bg-gradient-to-r from-[#4F65E3] to-[#F43F79] my-12"
              variant="default"
            >
              Evaluate
            </Button>
          </FormProvider>
        </div>
      </div>
    </>
  );
};

export default EventInformation;
