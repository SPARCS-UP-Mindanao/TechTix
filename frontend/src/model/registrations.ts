import { RegisterFormValues } from '@/hooks/useRegisterForm';
import { EditRegistrationFormValues } from '@/pages/admin/event/registrations/useEditRegistrationForm';
import { AcceptanceStatus } from './preregistrations';

export interface Registration {
  type: 'registration';
  firstName: string;
  lastName: string;
  contactNumber: string;
  careerStatus: string;
  yearsOfExperience: string;
  organization: string;
  title: string;
  email: string;
  eventId: string;
  registrationId: string;
  createDate?: string;
  paymentId?: string | null;
  discountCode?: string | null;
  amountPaid: number | null;
  referenceNumber?: string | null;
  gcashPayment?: string | null;
  gcashPaymentUrl?: string | null;
  certificateGenerated: boolean;
  certificateClaimed: boolean;
  certificateImgObjectKey: string | null;
  certificatePdfObjectKey: string | null;
}

export type RegisterMode = 'register' | 'preregister';

type AcceptanceStatusConfig = {
  displayName: string;
};

export const acceptanceStatusMap: Record<AcceptanceStatus, AcceptanceStatusConfig> = {
  PENDING: {
    displayName: 'Pending'
  },
  ACCEPTED: {
    displayName: 'Accepted'
  },
  REJECTED: {
    displayName: 'Rejected'
  }
};

export const mapRegistrationToFormValues = (registration: Registration): RegisterFormValues => ({
  email: registration.email,
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title
});

export type CreateRegistration = Omit<
  Registration,
  'type' | 'registrationId' | 'certificateGenerated' | 'certificateClaimed' | 'certificateImgObjectKey' | 'certificatePdfObjectKey'
>;

export const mapCreateRegistrationValues = (registration: RegisterFormValues, eventId: string): CreateRegistration => ({
  email: registration.email,
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title,
  discountCode: registration.discountPercentage ? registration.discountCode : '',
  amountPaid: registration.total ?? null,
  eventId: eventId
});

export type UpdateRegistration = Omit<Registration, 'type' | 'registrationId' | 'email' | 'amountPaid' | 'certificateClaimed' | 'eventId'>;

export const mapUpdateRegistrationValues = (newRegistrationValues: EditRegistrationFormValues, previousRegistration: Registration) => ({
  firstName: newRegistrationValues.firstName,
  lastName: newRegistrationValues.lastName,
  contactNumber: newRegistrationValues.contactNumber,
  careerStatus: newRegistrationValues.careerStatus,
  yearsOfExperience: newRegistrationValues.yearsOfExperience,
  organization: newRegistrationValues.organization,
  title: newRegistrationValues.title,
  certificateClaimed: previousRegistration.certificateClaimed,
  discountCode: previousRegistration.discountCode,
  gcashPayment: previousRegistration.gcashPayment,
  referenceNumber: previousRegistration.referenceNumber,
  amountPaid: previousRegistration.amountPaid,
  certificatePdfObjectKey: previousRegistration.certificatePdfObjectKey,
  certificateImgObjectKey: previousRegistration.certificateImgObjectKey,
  certificateGenerated: previousRegistration.certificateGenerated,
  eventId: previousRegistration.eventId
});
