import { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import FileViewerComponent from '@/components/S3Image';
import { getEvent } from '@/api/events';
import { isEmpty } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useCheckEmailForm } from '@/hooks/useCheckEmailForm';
import { QuestionSchemaBuilder, useEvaluationForm } from '@/hooks/useEvaluationForm';
import QuestionBuilder from '../evaluate/QuestionBuilder';
import CertificateClaim from './CertificateClaim';
import EventInformation from './EventInformation';
import PageHeader from './PageHeader';
import Stepper from './Stepper';
import { question1, question2 } from './questionsConfig';

const EVALUATE_STEPS = ['EventInformation', 'Evaluation_1', 'Evaluation_2', 'ClaimCertificate'] as const;
type EvaluateSteps = (typeof EVALUATE_STEPS)[number];
const EVALUATIONS_FORM_STEPS = ['Evaluation_1', 'Evaluation_2'];

const Evaluate = () => {
  const [currentStep, setCurrentStep] = useState<EvaluateSteps>(EVALUATE_STEPS[0]);
  const eventId = useParams().eventId!;
  const { data: eventResponse, isFetching } = useApi(getEvent(eventId!));

  const evaluationSchema = QuestionSchemaBuilder([...question1, ...question2]);
  type EvaluationField = keyof z.infer<typeof evaluationSchema> & string;

  const EVALUATION_FORM_STEPS_FIELD: { [key: string]: EvaluationField[] } = {
    Evaluation_1: question1.map((question) => question.name),
    Evaluation_2: question2.map((question) => question.name)
  };

  const fieldsToCheck: EvaluationField[] = EVALUATION_FORM_STEPS_FIELD[currentStep as keyof typeof EVALUATION_FORM_STEPS_FIELD];
  const nextStep = async () => {
    const moveToNextStep = () => {
      const currentIndex = EVALUATE_STEPS.indexOf(currentStep);
      if (currentIndex < EVALUATE_STEPS.length - 1) {
        setCurrentStep(EVALUATE_STEPS[currentIndex + 1]);
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
    submit,
    data: certificateResponse
  } = useCheckEmailForm({
    eventId,
    setCurrentStep,
    nextStep,
    EVALUATE_STEPS
  });

  const { form, submitForm, postEvalSuccess } = useEvaluationForm([...question1, ...question2], eventId, certificateResponse?.registrationId!);

  const prevStep = () => {
    const currentIndex = EVALUATE_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(EVALUATE_STEPS[currentIndex - 1]);
    }
  };

  if (isFetching) {
    return (
      // TODO: Add loading page
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!eventResponse || (eventResponse && !eventResponse.data)) {
    return (
      // TODO: Add event not found page
      <div>
        <h1>Event not found</h1>
      </div>
    );
  }

  const eventInfo = eventResponse.data;

  if (postEvalSuccess) {
    nextStep();
  }

  let cachedCertificate;
  if (certificateResponse) {
    cachedCertificate = (
      <CertificateClaim certificateLink={certificateResponse?.certificateTemplate} certificatePDFTemplate={certificateResponse?.certificatePDFTemplate} />
    );
  }

  return (
    <section className="flex flex-col items-center px-4">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <FormProvider {...form}>
          <section className="w-full">
            {currentStep !== 'ClaimCertificate' && (
              <PageHeader avatarImg={eventInfo.logoLink} bannerImg={eventInfo.bannerLink} bannerUrl={eventInfo.bannerUrl} />
            )}
            {currentStep === 'EventInformation' && (
              <EventInformation event={eventInfo} nextStep={nextStep} eventId={eventId} claimCertificateForm={claimCertificateForm} submit={submit} />
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
                <hr className="my-9 bg-neutral-200 w-full" />
              </div>
            )}

            {currentStep === 'Evaluation_2' && (
              <div className="flex flex-col items-center mt-6 w-full">
                <QuestionBuilder questions={question2} />
                <hr className="my-9 bg-neutral-200 w-full" />
              </div>
            )}

            {currentStep === 'ClaimCertificate' && cachedCertificate}

            <div className={`flex w-full my-4 ${currentStep !== 'Evaluation_1' ? 'justify-between' : 'justify-center'}`}>
              {currentStep === 'Evaluation_2' && (
                <Button onClick={prevStep} className="py-3 px-6 rounded-xl w-[120px]">
                  <Icon name="CaretLeft" />
                  Previous
                </Button>
              )}

              {currentStep === 'Evaluation_1' && (
                <Button onClick={nextStep} className="py-3 px-6 rounded-xl w-[120px]">
                  Next
                  <Icon name="CaretRight" />
                </Button>
              )}

              {currentStep === 'Evaluation_2' && (
                <Button onClick={submitForm} className="py-3 px-6 rounded-xl w-[120px]">
                  Submit
                  <Icon name="CaretRight" />
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
