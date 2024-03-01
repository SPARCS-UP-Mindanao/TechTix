import { RegisterFormValues } from '@/hooks/useRegisterForm';
import { Registration } from './registrations';

export type AcceptanceStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface PreRegistration
  extends Omit<
    Registration,
    'certificateClaimed' | 'amountPaid' | 'paymentId' | 'registrationId' | 'referenceNumber' | 'gcashPayment' | 'gcashPaymentUrl' | 'discountCode'
  > {
  acceptanceStatus: AcceptanceStatus;
  preRegistrationId?: string;
  acceptanceEmailSent: boolean;
}

export const mapCreatePreregistrationValues = (registration: RegisterFormValues, eventId: string): PreRegistration => ({
  email: registration.email,
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title,
  eventId: eventId,
  acceptanceEmailSent: false,
  acceptanceStatus: 'PENDING'
});
