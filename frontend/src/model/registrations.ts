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

  ticketTypeId?: string | null;
  shirtSize?: string | null;
  cityOfResidence?: string | null;
  industry: string | null;
  levelOfAWSUsage?: string | null;
  awsUsecase?: string | null;
  awsCommunityDayInLineWith?: string | null;
  foodRestrictions?: string | null;
  transactionId?: string | null;
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
  title: registration.title,
  ticketTypeId: registration.ticketTypeId ?? undefined,
  shirtSize: registration.shirtSize ?? undefined,
  cityOfResidence: registration.cityOfResidence ?? '',
  industry: registration.industry ?? undefined,
  levelOfAWSUsage: registration.levelOfAWSUsage ?? undefined,
  awsUsecase: registration.awsUsecase ?? undefined,
  awsCommunityDayInLineWith: registration.awsCommunityDayInLineWith ?? undefined,
  foodRestrictions: registration.foodRestrictions ?? undefined,
  transactionId: registration.transactionId ?? undefined
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
  eventId: eventId,
  ticketTypeId: registration.ticketTypeId ?? null,
  shirtSize: registration.shirtSize ?? null,
  cityOfResidence: registration.cityOfResidence ?? null,
  industry: registration.industry ?? null,
  levelOfAWSUsage: registration.levelOfAWSUsage ?? null,
  awsUsecase: registration.awsUsecase ?? null,
  awsCommunityDayInLineWith: registration.awsCommunityDayInLineWith ?? null,
  foodRestrictions: registration.foodRestrictions ?? null,
  transactionId: registration.transactionId ?? null
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
  eventId: previousRegistration.eventId,
  ticketTypeId: previousRegistration.ticketTypeId,
  shirtSize: previousRegistration.shirtSize,
  cityOfResidence: previousRegistration.cityOfResidence,
  industry: previousRegistration.industry,
  levelOfAWSUsage: previousRegistration.levelOfAWSUsage,
  awsUsecase: previousRegistration.awsUsecase,
  awsCommunityDayInLineWith: previousRegistration.awsCommunityDayInLineWith,
  foodRestrictions: previousRegistration.foodRestrictions
});
