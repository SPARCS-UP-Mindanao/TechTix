import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import ErrorPage from '@/components/ErrorPage';
import FileViewerComponent from '@/components/FileViewerComponent';
import Icon from '@/components/Icon';
import Separator from '@/components/Separator';
import { getDiscount } from '@/api/discounts';
import { getEvent } from '@/api/events';
import { getEventRegistrationWithEmail } from '@/api/registrations';
import { Pricing } from '@/model/discount';
import { Event } from '@/model/events';
import { isEmpty } from '@/utils/functions';
import { useApiQuery, useApi } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterFormValues, useRegisterForm } from '@/hooks/useRegisterForm';
import EventDetails from './EventDetails';
import RegisterForm1 from './RegisterForm1';
import RegisterForm2 from './RegisterForm2';
import RegisterForm3 from './RegisterForm3';
import RegisterFormLoading from './RegisterFormSkeleton';
import Stepper from './Stepper';
import Success from './Success';
import Summary from './Summary';

// TODO: Add success page
let REGISTER_STEPS = ['EventDetails', 'UserBio', 'PersonalInfo', 'GCash', 'Summary', 'Success'];
type RegisterSteps = (typeof REGISTER_STEPS)[number];
let REGISTER_STEPS_DISPLAY = ['UserBio', 'PersonalInfo', 'GCash', 'Summary'];

const getStepTitle = (step: RegisterSteps) => {
  const map: Record<RegisterSteps, string> = {
    EventDetails: 'Register',
    UserBio: 'Personal Information',
    PersonalInfo: 'Professional Information',
    GCash: 'GCash Payment',
    Summary: 'Summary',
    Success: 'Registration Successful!'
  };

  return map[step];
};

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
  const { data: response, isFetching } = useApiQuery(getEvent(eventId!));
  const { form, submit } = useRegisterForm(eventId!, navigateOnSuccess);
  const { setValue, getValues } = form;
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const api = useApi();
  const [pricing, setPricing] = useState<Pricing>({ price: 0, discount: 0, total: 0 });
  const [eventInfo, setEventInfo] = useState<Event | undefined>();

  useEffect(() => {
    if (isFetching || !response || (response && !response.data)) {
      return;
    }
    const eventData = response.data;
    setEventInfo(eventData);
    const { price } = eventData;
    setPricing({
      price: price,
      discount: 0,
      total: price
    });

    if (!eventData.payedEvent) {
      REGISTER_STEPS = ['EventDetails', 'UserBio', 'PersonalInfo', 'Summary', 'Success'];
      REGISTER_STEPS_DISPLAY = ['UserBio', 'PersonalInfo', 'Summary'];
    }
  }, [response]);

  useEffect(() => {
    setValue('amountPaid', pricing.total);
  }, [eventInfo]);

  if (isFetching) {
    return <RegisterFormLoading />;
  }

  if (!response || (response && !response.data && response.errorData) || !eventInfo) {
    return <ErrorPage error={response} />;
  }

  if (eventInfo.status === 'draft') {
    return <ErrorPage />;
  }

  if (eventInfo.status === 'closed') {
    return <ErrorPage errorTitle="Sold Out" message={`Thank you for your interest but ${eventInfo.name} is no longer open for registration.`} />;
  }

  if (eventInfo.status === 'cancelled') {
    const errorTitle = `${eventInfo.name} is Cancelled`;
    return (
      <ErrorPage
        errorTitle={errorTitle}
        message={`We've had to cancel, but please follow us on social media for future news. Sorry for the inconvenience, and thank you for your support!`}
      />
    );
  }

  if (eventInfo.payedEvent && eventInfo.status === 'completed') {
    return <ErrorPage errorTitle="Registration is Closed" message={`Thank you for your interest but ${eventInfo.name} is no longer open for registration.`} />;
  }

  useMetaData({
    title: eventInfo.name,
    iconUrl: eventInfo.logoUrl
  });

  const fieldsToCheck: RegisterField[] = REGISTER_STEPS_FIELD[currentStep as keyof typeof REGISTER_STEPS_FIELD];
  const scrollToView = () => {
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.2;
    window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
  };
  const checkDiscountCode = async () => {
    const currentDiscountCode = getValues('discountCode');
    if (!eventId || !currentDiscountCode) {
      errorToast({
        title: 'Discount Code is Empty',
        description: 'The discount code you entered is empty. Please enter a valid discount code.'
      });
      return;
    }

    try {
      const response = await api.query(getDiscount(currentDiscountCode, eventId));
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
        scrollToView();
      }
    };

    const currentEmail = getValues('email');
    const { eventId } = eventInfo;
    if (currentStep == 'UserBio' && eventId && currentEmail) {
      try {
        const response = await api.query(getEventRegistrationWithEmail(eventId, currentEmail));
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
        const response = await api.query(getDiscount(currentDiscountCode, eventId));
        const discountCode = response.data;
        if (response.status === 200) {
          const price = eventInfo.price * (1 - discountCode.discountPercentage);
          setPricing({
            price: eventInfo.price,
            discount: discountCode.discountPercentage,
            total: price
          });
          setValue('amountPaid', price);

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
          scrollToView();
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
  const showPrevButton = REGISTER_STEPS.indexOf(currentStep) !== 0 && REGISTER_STEPS.indexOf(currentStep) < REGISTER_STEPS.length - 1;
  const showSubmitButton = REGISTER_STEPS.indexOf(currentStep) === REGISTER_STEPS.length - 2;
  const showReloadButton = REGISTER_STEPS.indexOf(currentStep) === REGISTER_STEPS.length - 1;
  const reloadPage = () => window.location.reload();

  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
        <FileViewerComponent objectKey={eventInfo.logoLink} className="w-12 h-12 rounded-full overflow-hidden" />
        <div className="flex w-full justify-center relative overflow-hidden">
          <FileViewerComponent objectKey={eventInfo.bannerLink} className="w-full max-w-md object-cover z-10" />
          <div className="blur-2xl absolute w-full h-full inset-0 bg-center" style={{ backgroundImage: `url(${eventInfo.bannerUrl})` }}></div>
        </div>

        <FormProvider {...form}>
          <main className="w-full">
            {currentStep !== 'EventDetails' && <h1 className="text-xl text-center">{getStepTitle(currentStep)}</h1>}
            {showStepper && <Stepper steps={REGISTER_STEPS_DISPLAY} currentStep={currentStep} />}
            <div className="space-y-4">
              {currentStep === 'EventDetails' && <EventDetails event={eventInfo} />}
              {currentStep === 'UserBio' && <RegisterForm1 />}
              {currentStep === 'PersonalInfo' && <RegisterForm2 />}
              {currentStep === 'GCash' && (
                <RegisterForm3
                  setValue={setValue}
                  receiptUrl={receiptUrl}
                  setReceiptUrl={setReceiptUrl}
                  pricing={pricing}
                  checkDiscountCode={checkDiscountCode}
                  event={eventInfo}
                />
              )}
            </div>
            {currentStep === 'Summary' && <Summary receiptUrl={receiptUrl} event={eventInfo} />}
            {currentStep === 'Success' && <Success eventName={eventInfo.name} />}
            {currentStep !== 'EventDetails' && currentStep !== 'Success' && <Separator className="my-4" />}

            <div className="flex w-full justify-around my-6">
              {showRegisterButton && (
                <Button onClick={nextStep} variant={'primaryGradient'} className="py-6 px-20">
                  Register
                </Button>
              )}
              {showPrevButton && (
                <Button onClick={prevStep} variant={'outline'} className="py-6 sm:px-16">
                  <Icon name="CaretLeft" />
                  Back
                </Button>
              )}
              {showNextButton && (
                <Button onClick={nextStep} className="py-6 sm:px-16">
                  Next
                  <Icon name="CaretRight" />
                </Button>
              )}
              {showSubmitButton && (
                <Button onClick={submit} type="submit" className="py-6 sm:px-16">
                  Submit
                </Button>
              )}
              {showReloadButton && (
                <Button onClick={reloadPage} className="py-6 sm:px-16">
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
