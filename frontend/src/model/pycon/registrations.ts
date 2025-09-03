import { EditRegistrationFormValues } from '@/pages/admin/event/pycon/registrations/useEditRegistrationForm';
import { RegisterFormValues } from '@/pages/client/pycon/hooks/useRegisterForm';
import { roundUpToTwoDecimals } from '@/pages/client/pycon/register/pricing';

export interface Registration {
  registrationId: string;
  transactionId: string;
  amountPaid: number;
  firstName: string;
  lastName: string;
  nickname: string;
  pronouns: string;
  email: string;
  contactNumber: string;
  organization: string;
  jobTitle: string;
  facebookLink: string;
  linkedInLink: string | null;
  ticketType: string;
  sprintDay: boolean;
  availTShirt: boolean;
  shirtType: string | null;
  shirtSize: string | null;
  communityInvolvement: boolean;
  futureVolunteer: boolean;
  dietaryRestrictions: string | null;
  accessibilityNeeds: string | null;
  discountCode: string | null;
  validIdObjectKey: string;
  createDate: string;
  updateDate: string;
}

export const mapRegistrationToFormValues = (registration: Registration): RegisterFormValues | EditRegistrationFormValues => ({
  firstName: registration.firstName,
  lastName: registration.lastName,
  nickname: registration.nickname ?? '',
  pronouns: registration.pronouns,
  email: registration.email,
  contactNumber: registration.contactNumber,
  organization: registration.organization,
  jobTitle: registration.jobTitle,
  facebookLink: registration.facebookLink ?? '',
  linkedInLink: registration.linkedInLink ?? '',
  ticketType: registration.ticketType,
  sprintDay: registration.sprintDay,
  availTShirt: registration.availTShirt,
  shirtType: registration.shirtType ?? undefined,
  shirtSize: registration.shirtSize ?? undefined,
  communityInvolvement: registration.communityInvolvement,
  futureVolunteer: registration.futureVolunteer,
  dietaryRestrictions: registration.dietaryRestrictions ?? '',
  accessibilityNeeds: registration.accessibilityNeeds ?? '',
  discountCode: registration.discountCode ?? '',
  validIdObjectKey: registration.validIdObjectKey,
  amountPaid: registration.amountPaid,
  transactionId: '',
  paymentMethod: null,
  paymentChannel: null,
  total: 0
});

export type CreateRegistration = Omit<Registration, 'registrationId' | 'createDate' | 'updateDate'> & {
  eventId: string;
  amountPaid: number | null;
  transactionId: string | null;
};

export const mapCreateRegistrationDataForPayment = (registration: RegisterFormValues, eventId: string, email?: string) => ({
  eventId: eventId,
  firstName: registration.firstName,
  lastName: registration.lastName,
  nickname: registration.nickname || '',
  pronouns: registration.pronouns,
  email: email ?? registration.email,
  contactNumber: registration.contactNumber,
  organization: registration.organization,
  jobTitle: registration.jobTitle,
  facebookLink: registration.facebookLink,
  linkedInLink: registration.linkedInLink || null,
  ticketType: registration.ticketType,
  sprintDay: registration.sprintDay,
  availTShirt: registration.availTShirt,
  shirtType: registration.availTShirt ? registration.shirtType || null : null,
  shirtSize: registration.availTShirt ? registration.shirtSize || null : null,
  communityInvolvement: registration.communityInvolvement,
  futureVolunteer: registration.futureVolunteer,
  dietaryRestrictions: registration.dietaryRestrictions || null,
  accessibilityNeeds: registration.accessibilityNeeds || null,
  discountCode: registration.discountPercentage ? registration.validCode || null : null,
  validIdObjectKey: registration.validIdObjectKey
});

export const mapCreateRegistrationValues = (registration: RegisterFormValues, eventId: string, email?: string): CreateRegistration => ({
  ...mapCreateRegistrationDataForPayment(registration, eventId, email),
  amountPaid: roundUpToTwoDecimals(registration.total),
  transactionId: registration.transactionId
});

export type UpdateRegistration = Omit<Registration, 'registrationId' | 'amountPaid' | 'transactionId' | 'discountCode' | 'createDate' | 'updateDate'>;

export const mapUpdateRegistrationValues = (newRegistrationValues: EditRegistrationFormValues): UpdateRegistration => ({
  email: newRegistrationValues.email,
  firstName: newRegistrationValues.firstName,
  lastName: newRegistrationValues.lastName,
  nickname: newRegistrationValues.nickname ?? '',
  pronouns: newRegistrationValues.pronouns,
  contactNumber: newRegistrationValues.contactNumber,
  organization: newRegistrationValues.organization,
  jobTitle: newRegistrationValues.jobTitle,
  facebookLink: newRegistrationValues.facebookLink ?? '',
  linkedInLink: newRegistrationValues.linkedInLink ?? '',
  ticketType: newRegistrationValues.ticketType,
  sprintDay: newRegistrationValues.sprintDay,
  availTShirt: newRegistrationValues.availTShirt,
  shirtType: newRegistrationValues.shirtType ?? '',
  shirtSize: newRegistrationValues.shirtSize ?? '',
  communityInvolvement: newRegistrationValues.communityInvolvement,
  futureVolunteer: newRegistrationValues.futureVolunteer,
  dietaryRestrictions: newRegistrationValues.dietaryRestrictions ?? null,
  accessibilityNeeds: newRegistrationValues.accessibilityNeeds ?? null,
  validIdObjectKey: newRegistrationValues.validIdObjectKey
});
