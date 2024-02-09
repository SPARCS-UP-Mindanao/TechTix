import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { ulid } from 'ulid';
import Button from '@/components/Button';
import ErrorPage from '@/components/ErrorPage';
import FileViewerComponent from '@/components/FileViewerComponent';
import Icon from '@/components/Icon';
import Separator from '@/components/Separator';
import { getDiscount } from '@/api/discounts';
import { getEvent } from '@/api/events';
import { createEwalletPaymentRequest, initiateDirectDebitPayment, getTransactionDetails } from '@/api/payments';
import { getEventRegistrationWithEmail } from '@/api/registrations';
import { Pricing } from '@/model/discount';
import { Event } from '@/model/events';
import { DirectDebitChannelCode, eWalletChannelCode, PaymentMethod } from '@/model/payments';
import { RegistrationFormFields } from '@/model/registrations';
import { isEmpty, getPathFromUrl } from '@/utils/functions';
import { useApiQuery, useApi } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { RegisterFormValues, useRegisterForm } from '@/hooks/useRegisterForm';
import EventDetails from './EventDetails';
import RegisterForm1 from './RegisterForm1';
import RegisterForm2 from './RegisterForm2';
import RegisterForm3 from './RegisterForm3';
import RegisterFormLoading from './RegisterFormSkeleton';
import RegisterFormSubmittingSkeleton from './RegisterFormSubmittingSkeleton';
import Stepper from './Stepper';
import Success from './Success';
import Summary from './Summary';

// TODO: Add success page
let REGISTER_STEPS = ['EventDetails', 'UserBio', 'PersonalInfo', 'Payment', 'Summary', 'Submitting', 'Success'];
type RegisterSteps = (typeof REGISTER_STEPS)[number];
let REGISTER_STEPS_DISPLAY = ['UserBio', 'PersonalInfo', 'Payment', 'Summary'];

const getStepTitle = (step: RegisterSteps) => {
  const map: Record<RegisterSteps, string> = {
    EventDetails: 'Register',
    UserBio: 'Personal Information',
    PersonalInfo: 'Professional Information',
    Payment: 'Payment',
    Summary: 'Summary',
    Submitting: 'Submitting',
    Success: 'Registration Successful!'
  };

  return map[step];
};

type RegisterField = keyof RegisterFormValues;
type RegisterFieldMap = Partial<Record<RegisterSteps, RegisterField[]>>;

const REGISTER_STEPS_FIELD: RegisterFieldMap = {
  UserBio: ['firstName', 'lastName', 'email', 'contactNumber'],
  PersonalInfo: ['careerStatus', 'organization', 'title', 'yearsOfExperience'],
  Payment: ['gcashPayment', 'referenceNumber']
};

const Register = () => {
  const setMetaData = useMetaData();
  const { successToast, errorToast } = useNotifyToast();
  const { eventId } = useParams();
  const [searchParams] = useSearchParams();
  const api = useApi();
  const currentUrl = window.location.href;

  const navigateOnSuccess = () => setCurrentStep('Success');
  const { form, submit } = useRegisterForm(eventId!, navigateOnSuccess);
  const { setValue, getValues } = form;

  const [currentStep, setCurrentStep] = useState<RegisterSteps>(REGISTER_STEPS[0]);
  const [pricing, setPricing] = useState<Pricing>({ price: 0, discount: 0, total: 0, transactionFees: 0 });
  const [eventInfo, setEventInfo] = useState<Event | undefined>();
  const [paymentChannel, setPaymentChannel] = useState<eWalletChannelCode | DirectDebitChannelCode>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();
  const [isLoading, setIsLoading] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  const { data: response, isFetching } = useApiQuery(getEvent(eventId!));

  const saveFormState = () => {
    const formState = getValues();
    localStorage.setItem('formState', JSON.stringify(formState));
    localStorage.setItem('pricing', JSON.stringify(pricing));
  };

  const restoreFormState = () => {
    const savedState = localStorage.getItem('formState');
    if (savedState) {
      const formState = JSON.parse(savedState);
      // Loop through the saved state and use setValue to update each field
      Object.keys(formState).forEach((key) => {
        setValue(key as RegistrationFormFields, formState[key]);
      });
    }

    if (localStorage.getItem('pricing')) {
      setPricing(JSON.parse(localStorage.getItem('pricing') as string));
    }
  };

  const deleteFormState = () => {
    localStorage.removeItem('formState');
    localStorage.removeItem('pricing');
    localStorage.removeItem('referenceNumber');
  };

  const eWalletPaymentRequest = async () => {
    saveFormState();

    const referenceId = ulid();
    const baseUrlPath = getPathFromUrl(currentUrl);

    setIsLoading(true);

    try {
      const response = await api.execute(
        createEwalletPaymentRequest({
          amount: pricing.total,
          channel_code: paymentChannel as eWalletChannelCode,
          failure_return_url: `${baseUrlPath}?step=Payment`,
          success_return_url: `${baseUrlPath}?step=Submitting`,
          cancel_return_url: `${baseUrlPath}?step=Payment`,
          reference_id: referenceId
        })
      );

      if (response.status === 200) {
        localStorage.setItem('referenceNumber', response.data.reference_id);
        window.location.href = response.data.payment_url;
      }
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  const directDebitPaymentRequest = async () => {
    saveFormState();
    const baseUrlPath = getPathFromUrl(currentUrl);

    setIsLoading(true);
    const response = await api.execute(
      initiateDirectDebitPayment({
        channel_code: paymentChannel as DirectDebitChannelCode,
        email: getValues('email'),
        given_names: getValues('firstName'),
        surname: getValues('lastName'),
        failure_return_url: `${baseUrlPath}?step=Summary`,
        success_return_url: `${baseUrlPath}?step=Submitting`,
        amount: pricing.total
      })
    );

    if (response.status === 200) {
      localStorage.setItem('referenceNumber', response.data.reference_id);
      window.location.href = response.data.payment_url;
    }

    setIsLoading(false);
  };

  const submitPaymentForm = async () => {
    if (eventInfo && !eventInfo.payedEvent) {
      setIsLoading(true);
      await submit();
      setIsLoading(false);
      return;
    }

    if (paymentMethod == 'DIRECT_DEBIT') {
      await directDebitPaymentRequest();
    } else if (paymentMethod == 'E_WALLET') {
      await eWalletPaymentRequest();
    }
  };

  const successPayment = async () => {
    setIsLoading(true);
    restoreFormState();
    await submit();
    deleteFormState();
    setIsLoading(false);
  };

  const reloadPage = () => {
    const baseUrlPath = getPathFromUrl(currentUrl);
    window.location.href = baseUrlPath;
  };

  const recalculatePricing = async () => {
    if (!eventInfo) return;

    const discountedPrice = eventInfo.price * (1 - discountPercentage);
    let transactionFees = 0;
    let total = discountedPrice;

    if (paymentMethod && paymentChannel) {
      try {
        setIsLoading(true);
        const response = await api.query(
          getTransactionDetails({
            payment_channel: paymentChannel as string,
            payment_method: paymentMethod as string,
            ticket_price: discountedPrice
          })
        );

        if (response.status === 200) {
          transactionFees = response.data.transaction_fee;
          total = response.data.total_price;
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    setPricing({
      price: discountedPrice,
      discount: discountPercentage,
      total: total,
      transactionFees: transactionFees
    });
    setValue('amountPaid', total);
  };

  // USE EFFECTS
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
      total: price,
      transactionFees: 0
    });

    if (!eventData.payedEvent) {
      REGISTER_STEPS = ['EventDetails', 'UserBio', 'PersonalInfo', 'Summary', 'Success'];
      REGISTER_STEPS_DISPLAY = ['UserBio', 'PersonalInfo', 'Summary'];
    }
  }, [response]);

  useEffect(() => {
    setValue('amountPaid', pricing.total);
  }, [eventInfo]);

  useEffect(() => {
    recalculatePricing();
  }, [paymentChannel, paymentMethod, discountPercentage]);

  useEffect(() => {
    const step = searchParams.get('step');
    if (!step) {
      return;
    }

    setCurrentStep(step as RegisterSteps);
    if (step === 'Submitting') {
      successPayment();
    }

    const formState = localStorage.getItem('formState');
    if (!formState) {
      reloadPage();
    }
  }, [searchParams]);

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

  setMetaData({
    title: eventInfo.name,
    iconUrl: eventInfo.logoUrl
  });

  const fieldsToCheck: RegisterField[] = REGISTER_STEPS_FIELD[currentStep] || [];
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
      setIsLoading(true);
      const response = await api.query(getDiscount(currentDiscountCode, eventId));
      const discountCode = response.data;
      if (response.status === 200) {
        if (discountCode.claimed) {
          errorToast({
            title: 'Discount Code Already Claimed',
            description: 'The discount code you entered has already been claimed. Please enter a different discount code.'
          });
          setIsLoading(false);
          return;
        }
        setDiscountPercentage(discountCode.discountPercentage);
        successToast({
          title: 'Valid Discount Code',
          description: 'The discount code you entered is valid. Please proceed to the next step.'
        });
      } else if (response.status === 404) {
        errorToast({
          title: 'Invalid Discount Code',
          description: 'The discount code you entered is invalid. Please enter a different discount code.'
        });
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const checkDiscount = async (currentDiscountCode: string, eventId: string) => {
    setIsLoading(true);
    const response = await api.query(getDiscount(currentDiscountCode, eventId));
    setIsLoading(false);

    const discountCode = response.data;
    if (response.status === 200) {
      setDiscountPercentage(discountCode.discountPercentage);

      if (discountCode.claimed) {
        const errorMessage = 'Discount Code Already Claimed';
        errorToast({
          title: errorMessage,
          description: 'The discount code you entered has already been claimed. Please enter a different discount code.'
        });
        throw new Error(errorMessage);
      }
    } else if (response.status === 404) {
      const errorMessage = 'Invalid Discount Code';
      errorToast({
        title: errorMessage,
        description: 'The discount code you entered is invalid. Please enter a different discount code.'
      });
      throw new Error(errorMessage);
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
        setIsLoading(true);
        const response = await api.query(getEventRegistrationWithEmail(eventId, currentEmail));
        if (response.status === 200) {
          errorToast({
            title: 'Emailalready registered',
            description: 'The email you entered has already been used. Please enter a different email.'
          });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }

    if (currentStep == 'Payment' && eventId) {
      try {
        const currentDiscountCode = getValues('discountCode');
        if (currentDiscountCode) {
          setIsLoading(true);
          await checkDiscount(currentDiscountCode, eventId);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
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
  const showNextButton = REGISTER_STEPS.indexOf(currentStep) !== 0 && REGISTER_STEPS.indexOf(currentStep) < REGISTER_STEPS.length - 3;
  const showPrevButton = REGISTER_STEPS.indexOf(currentStep) !== 0 && REGISTER_STEPS.indexOf(currentStep) < REGISTER_STEPS.length - 1;
  const showSubmitButton = REGISTER_STEPS.indexOf(currentStep) === REGISTER_STEPS.length - 3;
  const showReloadButton = REGISTER_STEPS.indexOf(currentStep) === REGISTER_STEPS.length - 1;

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
              {currentStep === 'Payment' && (
                <RegisterForm3
                  setPaymentChannel={setPaymentChannel}
                  setPaymentMethod={setPaymentMethod}
                  pricing={pricing}
                  checkDiscountCode={checkDiscountCode}
                />
              )}
            </div>
            {currentStep === 'Summary' && <Summary event={eventInfo} pricing={pricing} />}
            {currentStep === 'Submitting' && <RegisterFormSubmittingSkeleton />}
            {currentStep === 'Success' && <Success eventName={eventInfo.name} />}
            {currentStep !== 'EventDetails' && currentStep !== 'Success' && <Separator className="my-4" />}

            <div className="flex w-full justify-around my-6">
              {currentStep !== 'Submitting' && (
                <>
                  {showRegisterButton && (
                    <Button loading={isLoading} onClick={nextStep} variant={'primaryGradient'} className="py-6 px-20">
                      Register
                    </Button>
                  )}
                  {showPrevButton && (
                    <Button onClick={prevStep} loading={isLoading} variant={'outline'} className="py-6 sm:px-16">
                      <Icon name="ChevronLeft" />
                      Back
                    </Button>
                  )}
                  {showNextButton && (
                    <Button onClick={nextStep} loading={isLoading} className="py-6 sm:px-16">
                      Next
                      <Icon name="ChevronRight" />
                    </Button>
                  )}
                  {showSubmitButton && (
                    <Button onClick={submitPaymentForm} loading={isLoading} type="submit" className="py-6 sm:px-16">
                      Submit
                    </Button>
                  )}
                  {showReloadButton && (
                    <Button onClick={reloadPage} className="py-6 sm:px-16">
                      Sign up another person
                    </Button>
                  )}
                </>
              )}
            </div>
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

export default Register;
