import { Step } from '@/components/Stepper';

export type RegisterStepId = 'EventDetails' | 'BasicInfo' | 'TicketSelection' | 'Miscellaneous' | 'Summary' | 'Payment&Verification' | 'Success';

export interface RegisterStep extends Step {
  id: RegisterStepId;
}

export const STEP_EVENT_DETAILS: RegisterStep = {
  id: 'EventDetails'
};

export const STEP_BASIC_INFO: RegisterStep = {
  id: 'BasicInfo',
  title: 'Personal Information'
};

export const STEP_TICKET_SELECTION: RegisterStep = {
  id: 'TicketSelection',
  title: 'Ticket Selection'
};

export const STEP_MISCELLANEOUS: RegisterStep = {
  id: 'Miscellaneous',
  title: 'Miscellaneous'
};

export const STEP_PAYMENT: RegisterStep = {
  id: 'Payment&Verification',
  title: 'Promotions & Verification'
};

export const STEP_SUMMARY: RegisterStep = {
  id: 'Summary',
  title: 'Summary'
};

export const STEP_SUCCESS: RegisterStep = {
  id: 'Success',
  title: 'Registration Successful!'
};

export const RegisterSteps: RegisterStep[] = [
  STEP_EVENT_DETAILS,
  STEP_BASIC_INFO,
  STEP_TICKET_SELECTION,
  STEP_MISCELLANEOUS,
  STEP_SUMMARY,
  STEP_SUCCESS
] as const;
export const RegisterStepsWithPayment: RegisterStep[] = [
  STEP_EVENT_DETAILS,
  STEP_BASIC_INFO,
  STEP_TICKET_SELECTION,
  STEP_MISCELLANEOUS,
  STEP_PAYMENT,
  STEP_SUMMARY,
  STEP_SUCCESS
] as const;

export const CURRENT_STEP = STEP_TICKET_SELECTION;
