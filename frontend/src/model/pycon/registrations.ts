import { EditRegistrationFormValues } from '@/pages/admin/event/pycon/registrations/useEditRegistrationForm';
import { RegisterFormValues } from '@/pages/client/pycon/hooks/useRegisterForm';

export interface Registration {
  registrationId: string;
  transactionId: string;
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
  amountPaid: 0,
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

export const mapCreateRegistrationDataForPayment = (registration: RegisterFormValues, eventId: string) => ({
  eventId: eventId,
  firstName: registration.firstName,
  lastName: registration.lastName,
  nickname: registration.nickname || '',
  pronouns: registration.pronouns,
  email: registration.email,
  contactNumber: registration.contactNumber,
  organization: registration.organization,
  jobTitle: registration.jobTitle,
  facebookLink: registration.facebookLink || 'https://www.example.com', // TODO: Update links or have a function to map to a proper link
  linkedInLink: registration.linkedInLink || 'https://www.example.com', // TODO: Update links or have a function to map to a proper link
  ticketType: registration.ticketType,
  sprintDay: registration.sprintDay,
  availTShirt: registration.availTShirt,
  shirtType: registration.shirtType || null,
  shirtSize: registration.shirtSize || null,
  communityInvolvement: registration.communityInvolvement,
  futureVolunteer: registration.futureVolunteer,
  dietaryRestrictions: registration.dietaryRestrictions || null,
  accessibilityNeeds: registration.accessibilityNeeds || null,
  discountCode: registration.discountCode || null,
  validIdObjectKey: registration.validIdObjectKey
});

export const mapCreateRegistrationValues = (registration: RegisterFormValues, eventId: string): CreateRegistration => ({
  ...mapCreateRegistrationDataForPayment(registration, eventId),
  amountPaid: registration.amountPaid,
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
