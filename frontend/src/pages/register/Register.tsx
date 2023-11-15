import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider, set } from 'react-hook-form';
import Button from '@/components/Button';
import ErrorPage from '@/components/ErrorPage';
import Icon from '@/components/Icon';
import { getDiscount } from '@/api/discounts';
import { getEvent } from '@/api/events';
import { getEventRegistrationWithEmail } from '@/api/registrations';
import { isEmpty } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useFetchQuery } from '@/hooks/useApi';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterFormValues, useRegisterForm } from '@/hooks/useRegisterForm';
import EventDetails from './EventDetails';
import RegisterForm1 from './RegisterForm1';
import RegisterForm2 from './RegisterForm2';
import RegisterForm3 from './RegisterForm3';
import RegisterFormLoading from './RegisterFormLoading';
import Stepper from './Stepper';
import Success from './Success';
import Summary from './Summary';
import { Pricing } from '@/model/discount';
import { showEvent } from '@/model/events';
import { Event } from '@/model/events';

// TODO: Add success page
const REGISTER_STEPS = ['EventDetails', 'UserBio', 'PersonalInfo', 'GCash', 'Summary', 'Success'] as const;
type RegisterSteps = (typeof REGISTER_STEPS)[number];
const REGISTER_STEPS_DISPLAY = ['UserBio', 'PersonalInfo', 'GCash', 'Summary'];
const map_steps_to_title = new Map<string, string>();
map_steps_to_title.set('EventDetails', 'Register');
map_steps_to_title.set('UserBio', 'Personal Information');
map_steps_to_title.set('PersonalInfo', 'Professional Information');
map_steps_to_title.set('GCash', 'GCash Payment');
map_steps_to_title.set('Summary', 'Summary');
map_steps_to_title.set('Success', 'Registration Successful!');

type RegisterField = keyof RegisterFormValues;

const REGISTER_STEPS_FIELD: { [key: string]: RegisterField[] } = {
  UserBio: ['firstName', 'lastName', 'email', 'contactNumber'],
  PersonalInfo: ['careerStatus', 'organization', 'title', 'yearsOfExperience'],
  GCash: ['gcashPayment', 'referenceNumber']
};

const Register = () => {
  const { successToast, errorToast } = useNotifyToast();
  const { eventId } = useParams();
  const [currentStep, setCurrentStep] = useState<RegisterSteps>(REGISTER_STEPS[0]);
  const navigateOnSuccess = () => setCurrentStep('Success');
  const { data: response, isFetching } = useApi(getEvent(eventId!));
  const { form, submit } = useRegisterForm(eventId!, navigateOnSuccess);
  const { setValue, getValues } = form;
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const { fetchQuery } = useFetchQuery<any>();
  const [pricing, setPricing] = useState<Pricing>({ price: 0, discount: 0, total: 0 });
  const [eventInfo, setEventInfo] = useState<Event | undefined>();
  const [sectionTitle, setSectionTitle] = useState<string>('Register');

  useEffect(() => {
    setSectionTitle(map_steps_to_title.get(currentStep) || 'Register');
  }, [currentStep]);

  useEffect(() => {
    if (isFetching || !response || (response && !response.data)) {
      return;
    }
    setEventInfo(response.data);
    const price = response.data.price;
    setPricing({
      price: price,
      discount: 0,
      total: price
    });
    setValue('amountPaid', price);
  }, [response]);

  if (isFetching) {
    return <RegisterFormLoading />;
  }

  if (!response || (response && !response.data && response.errorData) || !eventInfo) {
    return <ErrorPage error={response} />;
  }

  if (!showEvent(response.data.status)) {
    return <ErrorPage />;
  }

  document.title = eventInfo.name;
  const link = document.querySelector('link[rel="icon"]');

  if (link && eventInfo.logoUrl) {
    link.setAttribute('href', eventInfo.logoUrl);
  }

  const fieldsToCheck: RegisterField[] = REGISTER_STEPS_FIELD[currentStep as keyof typeof REGISTER_STEPS_FIELD];

  const checkDiscountCode = async () => {
    const currentDiscountCode = getValues('discountCode');
    if (!eventId || !currentDiscountCode) return;

    try {
      const response = await fetchQuery(getDiscount(currentDiscountCode, eventId));
      const discountCode = response.data;
      if (response.status === 200) {
        if (discountCode.claimed) {
          errorToast({
            title: 'Discount Code Already Claimed',
            description: 'The discount code you entered has already been claimed. Please enter a different discount code.'
          });
          return;
        }
        const price = eventInfo.price * (1 - discountCode.discountPercentage);
        setPricing({
          price: eventInfo.price,
          discount: discountCode.discountPercentage,
          total: price
        });
        setValue('amountPaid', price);
        successToast({
          title: 'Valid Discount Code',
          description: 'The discount code you entered is valid. Please proceed to the next step.'
        });
      } else if (response.status === 404) {
        errorToast({
          title: 'Invalid Discount Code',
          description: 'The discount code you entered is invalid. Please enter a different discount code.'
        });
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const nextStep = async () => {
    const moveToNextStep = () => {
      const currentIndex = REGISTER_STEPS.indexOf(currentStep);
      if (currentIndex < REGISTER_STEPS.length - 1) {
        setCurrentStep(REGISTER_STEPS[currentIndex + 1]);
      }
    };

    const currentEmail = getValues('email');
    const eventId = eventInfo.entryId;
    if (currentStep == 'UserBio' && eventId && currentEmail) {
      try {
        const response = await fetchQuery(getEventRegistrationWithEmail(eventId, currentEmail));
        if (response.status === 200) {
          errorToast({
            title: 'Email already registered',
            description: 'The email you entered has already been used. Please enter a different email.'
          });
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    const currentDiscountCode = getValues('discountCode');
    if (currentStep == 'GCash' && currentDiscountCode && eventId) {
      try {
        const response = await fetchQuery(getDiscount(currentDiscountCode, eventId));
        const discountCode = response.data;
        if (response.status === 200) {
          setPricing({
            price: eventInfo.price,
            discount: discountCode.discount,
            total: eventInfo.price * discountCode.discount
          });
          if (discountCode.claimed) {
            errorToast({
              title: 'Discount Code Already Claimed',
              description: 'The discount code you entered has already been claimed. Please enter a different discount code.'
            });
            return;
          }
        } else if (response.status === 404) {
          errorToast({
            title: 'Invalid Discount Code',
            description: 'The discount code you entered is invalid. Please enter a different discount code.'
          });
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (isEmpty(fieldsToCheck)) {
      moveToNextStep();
    } else {
      await form.trigger(fieldsToCheck).then((isValid) => {
        if (isValid) {
          moveToNextStep();
        }
      });
    }
  };

  const prevStep = () => {
    const currentIndex = REGISTER_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(REGISTER_STEPS[currentIndex - 1]);
    }
  };

  const showStepper = REGISTER_STEPS.indexOf(currentStep) !== 0 && REGISTER_STEPS.indexOf(currentStep) !== REGISTER_STEPS.length - 1;
  const showRegisterButton = REGISTER_STEPS.indexOf(currentStep) === 0;
  const showNextButton = REGISTER_STEPS.indexOf(currentStep) !== 0 && REGISTER_STEPS.indexOf(currentStep) < REGISTER_STEPS.length - 2;
  const showPrevButton = REGISTER_STEPS.indexOf(currentStep) !== 0 && REGISTER_STEPS.indexOf(currentStep) < REGISTER_STEPS.length - 2;
  const showSubmitButton = REGISTER_STEPS.indexOf(currentStep) === REGISTER_STEPS.length - 2;
  const showReloadButton = REGISTER_STEPS.indexOf(currentStep) === REGISTER_STEPS.length - 1;
  const reloadPage = () => window.location.reload();

  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <img className="w-fit h-12 rounded-full" src={eventInfo.logoUrl} />
        <div className="flex w-full justify-center my-8 relative overflow-hidden">
          <img src={eventInfo.bannerUrl} className="h-fit w-full max-w-md object-cover z-10" />
          <div className="blur-2xl absolute w-full h-full inset-0 bg-center" style={{ backgroundImage: `url(${eventInfo.bannerUrl})` }}></div>
        </div>

        <FormProvider {...form}>
          <main className="w-full">
            {currentStep !== 'EventDetails' && <h1 className="text-xl text-center">{sectionTitle}</h1>}
            {showStepper && <Stepper steps={REGISTER_STEPS_DISPLAY} currentStep={currentStep} />}
            {currentStep === 'EventDetails' && <EventDetails event={eventInfo} />}
            <div className="space-y-4">
              {currentStep === 'UserBio' && <RegisterForm1 />}
              {currentStep === 'PersonalInfo' && <RegisterForm2 />}
              {currentStep === 'GCash' && (
                <RegisterForm3
                  setValue={setValue}
                  receiptUrl={receiptUrl}
                  setReceiptUrl={setReceiptUrl}
                  pricing={pricing}
                  checkDiscountCode={checkDiscountCode}
                />
              )}
            </div>
            {currentStep === 'Summary' && <Summary receiptUrl={receiptUrl} />}
            {currentStep === 'Success' && <Success />}

            <div className="flex w-full justify-around my-10">
              {showRegisterButton && (
                <Button onClick={nextStep} variant={'gradient'} className="py-4 px-20">
                  Register
                </Button>
              )}
              {showPrevButton && (
                <Button onClick={prevStep} variant={'outline'} className="sm:py-4 sm:px-16">
                  <Icon name="CaretLeft" />
                  Back
                </Button>
              )}
              {showNextButton && (
                <Button onClick={nextStep} className="sm:py-4 sm:px-16">
                  Next
                  <Icon name="CaretRight" />
                </Button>
              )}
              {showSubmitButton && (
                <Button onClick={submit} type="submit" className="sm:py-4 sm:px-16">
                  Submit
                </Button>
              )}
              {showReloadButton && (
                <Button onClick={reloadPage} className="sm:py-4 sm:px-16">
                  Sign up another person
                </Button>
              )}
            </div>
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

export default Register;
