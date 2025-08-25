import { EditRegistrationFormValues } from '@/pages/admin/event/registrations/useEditRegistrationForm';
import { RegisterFormValues } from '@/pages/client/pycon/hooks/useRegisterForm';

export interface Registration {
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
}

export const mapRegistrationToFormValues = (registration: Registration): RegisterFormValues => ({
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

export type CreateRegistration = Registration & {
  eventId: string;
  amountPaid: number | null;
  transactionId: string | null;
};

export const mapCreateRegistrationDataForPayment = (registration: RegisterFormValues, eventId: string) => ({
  eventId: eventId,
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
  shirtType: registration.shirtType ?? null,
  shirtSize: registration.shirtSize ?? null,
  communityInvolvement: registration.communityInvolvement,
  futureVolunteer: registration.futureVolunteer,
  dietaryRestrictions: registration.dietaryRestrictions ?? '',
  accessibilityNeeds: registration.accessibilityNeeds ?? '',
  discountCode: registration.discountCode ?? '',
  validIdObjectKey: registration.validIdObjectKey
});

export const mapCreateRegistrationValues = (registration: RegisterFormValues, eventId: string): CreateRegistration => ({
  ...mapCreateRegistrationDataForPayment(registration, eventId),
  amountPaid: registration.amountPaid,
  transactionId: registration.transactionId
});

export type UpdateRegistration = Omit<Registration, 'type' | 'registrationId' | 'email' | 'amountPaid' | 'certificateClaimed' | 'eventId'>;

// export const mapUpdateRegistrationValues = (newRegistrationValues: EditRegistrationFormValues, previousRegistration: Registration) => ({
//   firstName: newRegistrationValues.firstName,
//   lastName: newRegistrationValues.lastName,
//   contactNumber: newRegistrationValues.contactNumber,
//   careerStatus: newRegistrationValues.careerStatus,
//   yearsOfExperience: newRegistrationValues.yearsOfExperience,
//   organization: newRegistrationValues.organization,
//   title: newRegistrationValues.title ?? '',
//   certificateClaimed: previousRegistration.certificateClaimed,
//   discountCode: previousRegistration.discountCode,
//   gcashPayment: previousRegistration.gcashPayment,
//   referenceNumber: previousRegistration.referenceNumber,
//   amountPaid: previousRegistration.amountPaid,
//   certificatePdfObjectKey: previousRegistration.certificatePdfObjectKey,
//   certificateImgObjectKey: previousRegistration.certificateImgObjectKey,
//   certificateGenerated: previousRegistration.certificateGenerated,
//   eventId: previousRegistration.eventId,
//   ticketTypeId: previousRegistration.ticketTypeId,
//   shirtSize: previousRegistration.shirtSize,
//   cityOfResidence: previousRegistration.cityOfResidence ?? '',
//   industry: previousRegistration.industry,
//   levelOfAWSUsage: previousRegistration.levelOfAWSUsage,
//   awsUsecase: previousRegistration.awsUsecase,
//   awsCommunityDayInLineWith: previousRegistration.awsCommunityDayInLineWith,
//   foodRestrictions: previousRegistration.foodRestrictions
// });
