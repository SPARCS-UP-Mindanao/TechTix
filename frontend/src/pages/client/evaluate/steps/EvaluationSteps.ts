import { Step } from '@/components/Stepper';

export type EvaluateStepId = 'EventDetails' | 'Evaluation_1' | 'Evaluation_2' | 'ClaimCertificate';

export interface EvaluateStep extends Step {
  id: EvaluateStepId;
}

export const STEP_EVENT_DETAILS: EvaluateStep = {
  id: 'EventDetails'
};

export const STEP_EVALUATION_1: EvaluateStep = {
  id: 'Evaluation_1',
  title: 'Evaluation'
};

export const STEP_EVALUATION_2: EvaluateStep = {
  id: 'Evaluation_2',
  title: 'Evaluation'
};

export const STEP_CLAIM_CERTIFICATE: EvaluateStep = {
  id: 'ClaimCertificate'
};

export const EvaluateSteps: EvaluateStep[] = [STEP_EVENT_DETAILS, STEP_EVALUATION_1, STEP_EVALUATION_2, STEP_CLAIM_CERTIFICATE];
