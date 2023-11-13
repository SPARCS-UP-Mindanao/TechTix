import React, { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { getEvent } from '@/api/events';
import { isEmpty } from '@/utils/functions';
import { useApi } from '@/hooks/useApi';
import { useCheckEmailForm } from '@/hooks/useCheckEmailForm';
import { QuestionSchemaBuilder, useEvaluationForm } from '@/hooks/useEvaluationForm';
import sparcs_logo_white from '../../assets/logos/sparcs_logo_white.png';
import QuestionBuilder, { QuestionConfigItem } from '../evaluate/QuestionBuilder';
import CertificateClaim from './CertificateClaim';
import EventInformation from './EventInformation';
import PageHeader from './PageHeader';
import Stepper from './Stepper';
import question_config from './questions_config.json';

type QuestionConfig = {
  _question_part_1: QuestionConfigItem[];
  _question_part_2: QuestionConfigItem[];
};

const EVALUATE_STEPS = ['EventInformation', 'Evaluation_1', 'Evaluation_2', 'ClaimCertificate'] as const;
type EvaluateSteps = (typeof EVALUATE_STEPS)[number];
const EVALUATIONS_FORM_STEPS = ['Evaluation_1', 'Evaluation_2'];

const Evaluate = () => {
  const { _question_part_1, _question_part_2 } = question_config as QuestionConfig;
  type QuestionField = keyof z.infer<typeof questionSchema>;
  const EVALUATION_FORM_STEPS_FIELD: { [key: string]: QuestionField[] } = {
    Evaluation_1: _question_part_1.map((question) => question.name),
    Evaluation_2: _question_part_2.map((question) => question.name)
  };

  const [currentStep, setCurrentStep] = useState<EvaluateSteps>(EVALUATE_STEPS[0]);
  const fieldsToCheck = EVALUATION_FORM_STEPS_FIELD[currentStep as any];
  const eventId = useParams().eventId!;
  console.log('Event1', eventId);
  const { data: response, isFetching } = useApi(getEvent(eventId!));

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
      await form.trigger(fieldsToCheck as any).then((isValid) => {
        if (isValid) {
          moveToNextStep();
        }
      });
    }
  };

  const prevStep = () => {
    const currentIndex = EVALUATE_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(EVALUATE_STEPS[currentIndex - 1]);
    }
  };

  const { claimCertificateForm, submit, data } = useCheckEmailForm({
    eventId,
    setCurrentStep,
    nextStep,
    EVALUATE_STEPS
  });

  let cachedCertificate: ReactNode,
    registrationId: string = '';
  if (data) {
    registrationId = data['registrationId']!;
    cachedCertificate = <CertificateClaim certificateLink={data['certificateTemplate']} />;
  }

  const { form, submitForm, postEvalSuccess } = useEvaluationForm([..._question_part_1, ..._question_part_2], eventId, registrationId);
  const questionSchema = QuestionSchemaBuilder([..._question_part_1, ..._question_part_2]);

  if (postEvalSuccess) {
    nextStep();
  }

  if (isFetching) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      // TODO: Add event not found page
      <div>
        <h1>Event not found</h1>
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col items-center w-full">
        <FormProvider {...form}>
          <main className="full">
            {currentStep !== 'ClaimCertificate' && <PageHeader avatarImg={sparcs_logo_white} bannerImg={response.data?.bannerLink} />}
            {currentStep === 'EventInformation' && (
              <EventInformation event={response.data} nextStep={nextStep} eventId={eventId} claimCertificateForm={claimCertificateForm} submit={submit} />
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
                <QuestionBuilder questions={question_config._question_part_1 as QuestionConfigItem[]} {...form} />
                <hr className="my-9 bg-neutral-200 w-full" />
              </div>
            )}

            {currentStep === 'Evaluation_2' && (
              <div className="flex flex-col items-center mt-6 w-full">
                <QuestionBuilder questions={question_config._question_part_2 as QuestionConfigItem[]} {...form} />
                <hr className="my-9 bg-neutral-200 w-full" />
              </div>
            )}

            {currentStep === 'ClaimCertificate' && cachedCertificate}

            <div className={`flex w-full my-4 ${currentStep !== 'Evaluation_1' ? 'justify-between' : 'justify-center'}`}>
              {currentStep === 'Evaluation_2' && (
                <Button onClick={prevStep} variant={'gradient'} className="py-3 px-6 rounded-xl w-[120px]">
                  <Icon name="CaretLeft" />
                  Previous
                </Button>
              )}

              {currentStep === 'Evaluation_1' && (
                <Button onClick={nextStep} variant={'gradient'} className="py-3 px-6 rounded-xl w-[120px]">
                  Next
                  <Icon name="CaretRight" />
                </Button>
              )}

              {currentStep === 'Evaluation_2' && (
                <Button onClick={submitForm} variant={'gradient'} className="py-3 px-6 rounded-xl w-[120px]">
                  Submit
                  <Icon name="CaretRight" />
                </Button>
              )}
            </div>
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

export default Evaluate;
