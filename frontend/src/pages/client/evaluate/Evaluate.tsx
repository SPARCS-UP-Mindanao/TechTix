import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/components/Button';
import ErrorPage from '@/components/ErrorPage';
import Icon from '@/components/Icon';
import Separator from '@/components/Separator';
import { getEvent } from '@/api/events';
import { isEmpty } from '@/utils/functions';
import { useApiQuery } from '@/hooks/useApi';
import { useCheckEmailForm } from '@/hooks/useCheckEmailForm';
import { QuestionSchemaBuilder, useEvaluationForm } from '@/hooks/useEvaluationForm';
import { useMetaData } from '@/hooks/useMetaData';
import CertificateClaim from './CertificateClaim';
import EvaluateFormSkeleton from './EvaluateFormSkeleton';
import EventInformation from './EventInformation';
import PageHeader from './PageHeader';
import QuestionBuilder from './QuestionBuilder';
import Stepper from './Stepper';
import { question1, question2 } from './questionsConfig';

const EVALUATE_STEPS = ['EventInformation', 'Evaluation_1', 'Evaluation_2', 'ClaimCertificate'] as const;
type EvaluateSteps = (typeof EVALUATE_STEPS)[number];
const EVALUATIONS_FORM_STEPS = ['Evaluation_1', 'Evaluation_2'];

const Evaluate = () => {
  const setMetaData = useMetaData();
  const [currentStep, setCurrentStep] = useState<EvaluateSteps>(EVALUATE_STEPS[0]);
  const eventId = useParams().eventId!;
  const { data: eventResponse, isFetching } = useApiQuery(getEvent(eventId!));

  const evaluationSchema = QuestionSchemaBuilder([...question1, ...question2]);
  type EvaluationField = keyof z.infer<typeof evaluationSchema> & string;

  const EVALUATION_FORM_STEPS_FIELD: { [key: string]: EvaluationField[] } = {
    Evaluation_1: question1.map((question) => question.name),
    Evaluation_2: question2.map((question) => question.name)
  };

  const fieldsToCheck: EvaluationField[] = EVALUATION_FORM_STEPS_FIELD[currentStep as keyof typeof EVALUATION_FORM_STEPS_FIELD];
  const scrollToView = () => {
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.2;
    window.scrollTo({ top: scrollAmount, behavior: 'smooth' });
  };
  const nextStep = async () => {
    const moveToNextStep = () => {
      const currentIndex = EVALUATE_STEPS.indexOf(currentStep);
      if (currentIndex < EVALUATE_STEPS.length - 1) {
        setCurrentStep(EVALUATE_STEPS[currentIndex + 1]);
        scrollToView();
      }
    };

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

  const {
    claimCertificateForm,
    checkEmail,
    data: certificateResponse,
    isClaimCertificateLoading
  } = useCheckEmailForm({
    eventId,
    setCurrentStep,
    nextStep,
    EVALUATE_STEPS
  });

  const { form, submitEvaluation, postEvalSuccess } = useEvaluationForm([...question1, ...question2], eventId, certificateResponse?.registrationId!);

  const prevStep = () => {
    const currentIndex = EVALUATE_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(EVALUATE_STEPS[currentIndex - 1]);
    }
  };

  if (isFetching) {
    return <EvaluateFormSkeleton />;
  }

  if (!eventResponse || (eventResponse && !eventResponse.data && eventResponse.errorData)) {
    return <ErrorPage error={eventResponse} />;
  }

  if (eventResponse.data.status !== 'completed') {
    return <ErrorPage />;
  }

  const eventInfo = eventResponse.data;

  setMetaData({
    title: eventInfo.name,
    iconUrl: eventInfo.logoUrl
  });

  if (postEvalSuccess) {
    nextStep();
  }

  let cachedCertificate;
  if (certificateResponse && eventInfo && eventInfo?.logoLink) {
    cachedCertificate = (
      <CertificateClaim
        logoLink={eventInfo?.logoLink}
        certificateTemplateKey={certificateResponse?.certificateTemplateKey}
        certificatePDFTemplateKey={certificateResponse?.certificatePDFTemplateKey}
      />
    );
  }

  const showEvaluateButton = EVALUATE_STEPS.indexOf(currentStep) === 0;
  const showNextButton = EVALUATE_STEPS.indexOf(currentStep) !== 0 && EVALUATE_STEPS.indexOf(currentStep) < EVALUATE_STEPS.length - 2;
  const showPrevButton = EVALUATE_STEPS.indexOf(currentStep) !== 0 && EVALUATE_STEPS.indexOf(currentStep) < EVALUATE_STEPS.length - 1;
  const showSubmitButton = EVALUATE_STEPS.indexOf(currentStep) === EVALUATE_STEPS.length - 2;

  return (
    <section className="flex flex-col items-center px-4">
      <div className="flex flex-col items-center w-full max-w-2xl mb-9">
        <FormProvider {...form}>
          <section className="w-full">
            {currentStep !== 'ClaimCertificate' && (
              <PageHeader avatarImg={eventInfo.logoLink} bannerImg={eventInfo.bannerLink} bannerUrl={eventInfo.bannerUrl} />
            )}
            {currentStep === 'EventInformation' && (
              <EventInformation event={eventInfo} nextStep={nextStep} eventId={eventId} claimCertificateForm={claimCertificateForm} />
            )}
            {(currentStep === 'Evaluation_1' || currentStep === 'Evaluation_2') && (
              <div className="flex flex-col items-center w-full mt-6">
                <p className="font-subjectivity font-bold text-center text-xl leading-6">Evaluation</p>
                <div className="w-[94px]">
                  <Stepper steps={EVALUATIONS_FORM_STEPS} currentStep={currentStep} />
                </div>
              </div>
            )}

            {currentStep === 'Evaluation_1' && (
              <div className="flex flex-col items-center mt-6 w-full">
                <QuestionBuilder questions={question1} />
              </div>
            )}

            {currentStep === 'Evaluation_2' && (
              <div className="flex flex-col items-center mt-6 w-full">
                <QuestionBuilder questions={question2} />
              </div>
            )}

            {(currentStep === 'Evaluation_1' || currentStep === 'Evaluation_2') && <Separator className="my-4" />}

            {currentStep === 'ClaimCertificate' && cachedCertificate}

            <div className="flex w-full justify-around my-6">
              {showEvaluateButton && (
                <Button onClick={checkEmail} loading={isClaimCertificateLoading} variant="primaryGradient" className="py-6 sm:px-16">
                  Evaluate
                </Button>
              )}
              {showPrevButton && (
                <Button onClick={prevStep} variant={'outline'} className="py-6 sm:px-16">
                  <Icon name="ChevronLeft" />
                  Back
                </Button>
              )}
              {showNextButton && (
                <Button onClick={nextStep} className="py-6 sm:px-16">
                  Next
                  <Icon name="ChevronRight" />
                </Button>
              )}
              {showSubmitButton && (
                <Button onClick={submitEvaluation} type="submit" className="py-6 sm:px-16">
                  Submit
                </Button>
              )}
            </div>
          </section>
        </FormProvider>
      </div>
    </section>
  );
};

export default Evaluate;
