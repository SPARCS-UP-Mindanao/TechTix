import { RegisterFormValues } from '@/hooks/useRegisterForm';
import { EditRegistrationFormValues } from '@/pages/admin/event/registrations/useEditRegistrationForm';
import { Registration } from './registrations';

export type AcceptanceStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface PreRegistration
  extends Omit<
    Registration,
    | 'certificateClaimed'
    | 'amountPaid'
    | 'paymentId'
    | 'registrationId'
    | 'referenceNumber'
    | 'gcashPayment'
    | 'gcashPaymentUrl'
    | 'discountCode'
    | 'type'
    | 'certificateGenerated'
    | 'certificateClaimed'
    | 'certificateImgObjectKey'
    | 'certificatePdfObjectKey'
  > {
  type: 'preregistration';
  acceptanceStatus: AcceptanceStatus;
  preRegistrationId: string;
  acceptanceEmailSent: boolean;
}

export const mapCreatePreregistrationValues = (registration: RegisterFormValues, eventId: string): PreRegistrationCreate => ({
  email: registration.email,
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title,
  eventId
});

export interface PreRegistrationCreate {
  email: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  careerStatus: string;
  yearsOfExperience: string;
  organization: string;
  title: string;
  eventId: string;
}

export type PreRegistrationUpdate = Omit<PreRegistration, 'type' | 'preRegistrationId' | 'email' | 'eventId'>;

export const mapPreRegistrationToFormValues = (preRegistration: PreRegistration): EditRegistrationFormValues => ({
  email: preRegistration.email,
  firstName: preRegistration.firstName,
  lastName: preRegistration.lastName,
  contactNumber: preRegistration.contactNumber,
  careerStatus: preRegistration.careerStatus,
  yearsOfExperience: preRegistration.yearsOfExperience,
  organization: preRegistration.organization,
  title: preRegistration.title
});

export const mapUpdatePreregistrationValues = (
  newPreregistrationValues: EditRegistrationFormValues,
  previousPreregistration: PreRegistration,
  updatedStatus?: AcceptanceStatus
) => ({
  firstName: newPreregistrationValues.firstName,
  lastName: newPreregistrationValues.lastName,
  contactNumber: newPreregistrationValues.contactNumber,
  careerStatus: newPreregistrationValues.careerStatus,
  yearsOfExperience: newPreregistrationValues.yearsOfExperience,
  organization: newPreregistrationValues.organization,
  title: newPreregistrationValues.title,
  acceptanceStatus: updatedStatus ?? previousPreregistration.acceptanceStatus,
  acceptanceEmailSent: previousPreregistration.acceptanceEmailSent,
  ticketTypeId: previousPreregistration.ticketTypeId,
  shirtSize: previousPreregistration.shirtSize
});
