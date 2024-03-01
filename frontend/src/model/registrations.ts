import { RegisterFormValues } from '@/hooks/useRegisterForm';
import { PreRegistration } from './preregistrations';

export interface Registration {
  firstName: string;
  lastName: string;
  contactNumber: string;
  careerStatus: string;
  yearsOfExperience: string;
  organization: string;
  title: string;
  certificateClaimed: boolean;
  email: string;
  eventId: string;
  registrationId?: string;
  createDate?: string;
  paymentId?: string | null;
  discountCode?: string | null;
  amountPaid?: number | null;
  referenceNumber?: string | null;
  gcashPayment?: string | null;
  gcashPaymentUrl?: string | null;
}

export const mapRegistrationToFormValues = (registration: Registration | PreRegistration): RegisterFormValues => ({
  email: registration.email,
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title
});

export const mapCreateRegistrationValues = (registration: RegisterFormValues, eventId: string): Registration => ({
  email: registration.email,
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title,
  eventId: eventId,
  certificateClaimed: false
});
