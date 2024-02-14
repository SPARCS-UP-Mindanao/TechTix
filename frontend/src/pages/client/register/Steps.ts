export type RegisterStepId = 'EventDetails' | 'UserBio' | 'PersonalInfo' | 'Summary' | 'Success' | 'Payment';

export interface RegisterStep {
  id: RegisterStepId;
  title?: string;
  description?: string;
}

export const STEP_EVENT_DETAILS: RegisterStep = {
  id: 'EventDetails'
};

export const STEP_USER_BIO: RegisterStep = {
  id: 'UserBio',
  title: 'Personal Information'
};

export const STEP_PERSONAL_INFO: RegisterStep = {
  id: 'PersonalInfo',
  title: 'Professional Information'
};

export const STEP_PAYMENT: RegisterStep = {
  id: 'Payment',
  title: 'Payment'
};

export const STEP_SUMMARY: RegisterStep = {
  id: 'Summary',
  title: 'Summary'
};

export const STEP_SUCCESS: RegisterStep = {
  id: 'Success',
  title: 'Registration Successful!'
};

export const RegisterSteps: RegisterStep[] = [STEP_EVENT_DETAILS, STEP_USER_BIO, STEP_PERSONAL_INFO, STEP_SUMMARY, STEP_SUCCESS];
export const RegisterStepsWithPayment: RegisterStep[] = [STEP_EVENT_DETAILS, STEP_USER_BIO, STEP_PERSONAL_INFO, STEP_PAYMENT, STEP_SUMMARY, STEP_SUCCESS];
