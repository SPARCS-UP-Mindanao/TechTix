import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { z } from 'zod';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { claimCertificate } from '@/api/evaluations';
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
import image_placeholder from './image_placeholder/sparcs-image-placeholder.png';

// interface QuestionConfigItem {
//   name: string;
//   questionType: string;
//   question: string;
//   options: string[];
// }

const QUESTION1: QuestionConfigItem[] = [
  {
    name: 'overall_experience',
    questionType: 'slider',
    question: 'Please rate your overall experience of the event (5 being the highest).',
    options: [],
    required: true
  },
  {
    name: 'how_did_you_hear_about_the_event',
    questionType: 'text_short',
    question: 'How did you hear about the event?',
    options: [],
    required: true
  },
  {
    name: 'what_do_you_like_most_about_the_event',
    questionType: 'text_long',
    question: 'What do you like most about the event?',
    options: [],
    required: true
  },
  {
    name: 'what_could_be_improved',
    questionType: 'text_long',
    question: 'What do you think could be improved for the event?',
    options: [],
    required: true
  },
  {
    name: 'event_timing_convenient',
    questionType: 'slider',
    question: 'Please rate your satisfaction with the duration of the event (5 being the highest).',
    options: [],
    required: true
  }
];

const QUESTION2: QuestionConfigItem[] = [
  {
    name: 'quality_of_speakers',
    questionType: 'slider',
    question: 'Please rate the quality of the speakers (5 being the highest).',
    options: [],
    required: true
  },
  {
    name: 'how_likely_recommend_events_to_others',
    questionType: 'slider',
    question: 'Please rate how likely you are to recommend the event to others (5 being most likely)',
    options: [],
    required: true
  },
  {
    name: 'suggestions_event_topics',
    questionType: 'text_long',
    question: 'Suggest topics you would like to be discussed in future events.',
    options: [],
    required: true
  },
  {
    name: 'other_comments',
    questionType: 'text_long',
    question: 'If you have further comments, please write them below.',
    options: [],
    required: false
  },
  {
    name: 'notified_of_future_events',
    questionType: 'multiple_choice',
    question: 'Do you want to be notified of future events?',
    options: ['Yes', 'No'],
    required: true
  }
];

const EVALUATE_STEPS = ['EventInformation', 'Evaluation_1', 'Evaluation_2', 'ClaimCertificate'] as const;
type EvaluateSteps = (typeof EVALUATE_STEPS)[number];
const EVALUATIONS_FORM_STEPS = ['Evaluation_1', 'Evaluation_2'];

const Evaluate = () => {
  type QuestionField = keyof z.infer<typeof questionSchema>;
  const EVALUATION_FORM_STEPS_FIELD: { [key: string]: QuestionField[] } = {
    Evaluation_1: QUESTION1.map((question) => question.name),
    Evaluation_2: QUESTION2.map((question) => question.name)
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

  let cachedCertificate, registrationId;
  if (data) {
    registrationId = data.registrationId;
    cachedCertificate = <CertificateClaim certificateLink={data.certificateTemplate as string} />;
  }

  const { form, submitForm, postEvalSuccess } = useEvaluationForm([...QUESTION1, ...QUESTION2], eventId, registrationId);
  const questionSchema = QuestionSchemaBuilder([...QUESTION1, ...QUESTION2]);

  if (postEvalSuccess) {
    nextStep();
  }
  // const [date, setDate] = useState(new Date());

  // const handleDateSelect = (selectedDate) => {
  //   console.log('Selected Date:', selectedDate);
  // };

  // useEffect(() => {
  //   console.log('Selected Date:', date);
  // }, [date]);

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
            {currentStep !== 'ClaimCertificate' && <PageHeader avatarImg={sparcs_logo_white} bannerImg={response.data.bannerLink} />}
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
                <QuestionBuilder questions={QUESTION1} {...form} />
                <hr className="my-9 bg-neutral-200 w-full" />
              </div>
            )}

            {currentStep === 'Evaluation_2' && (
              <div className="flex flex-col items-center mt-6 w-full">
                <QuestionBuilder questions={QUESTION2} {...form} />
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

              {/* {(currentStep === 'Evaluation_1' || currentStep === 'Evaluation_2') && (
                <Button onClick={nextStep} variant={'gradient'} className="py-3 px-6 rounded-xl w-[120px]">
                  {currentStep === 'Evaluation_1' ? 'Next' : 'Submit'}
                  <Icon name="CaretRight" />
                </Button>
              )} */}

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
