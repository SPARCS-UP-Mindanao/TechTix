import { RegisterFormValues } from '@/hooks/useRegisterForm';
import { EditRegistrationFormValues } from '@/pages/admin/event/registrations/useEditRegistrationForm';

export interface Registration {
  type: 'registration';
  firstName: string;
  lastName: string;
  nickname: string;
  pronouns: string;
  email: string;
  contactNumber: string;
  organization: string;
  jobTitle: string;
  facebookLink: string ;
  linkedInLink: string | null;
  ticketTyope: string;
  sprintDay: boolean;
  availTShirt: boolean;
  shirtType: string | null;
  shirtSize: string | null;
  communityInvolvement: boolean;
  futureVolunteer: boolean;
  dietaryRestrictions : string | null;
  accessibilityNeeds: string | null;
  discountCode : string | null;
  validIdObjectKey: string;
  amountPaid: number | null;  
  transactionId: string | null;
}

export type RegisterMode = 'register' | 'preregister';

type AcceptanceStatusConfig = {
  displayName: string;
};


// export const mapRegistrationToFormValues = (registration: Registration): RegisterFormValues => ({
//   email: registration.email,
//   firstName: registration.firstName,
//   lastName: registration.lastName,
//   contactNumber: registration.contactNumber,
//   careerStatus: registration.careerStatus,
//   yearsOfExperience: registration.yearsOfExperience,
//   organization: registration.organization,
//   shirtSize: registration.shirtSize ?? undefined,

//   transactionId: registration.transactionId ?? undefined
// });

export type CreateRegistration = Omit<
  Registration,
  'type' | 'registrationId' | 'certificateGenerated' | 'certificateClaimed' | 'certificateImgObjectKey' | 'certificatePdfObjectKey'
>;

// export const mapCreateRegistrationValues = (registration: RegisterFormValues, eventId: string): CreateRegistration => ({
//     firstName:registration.firstName,
//     lastName:registration.lastName,
//     nickname:registration.nickname,
//     pronouns:registration.,
//     email:registration.,
//     contactNumber:registration.,
//     organization:registration.,
//     jobTitle:registration.,
//     facebookLink:registration.,
//     linkedInLink:registration.,
//     ticketTyope:registration.,
//     sprintDay:registration.,
//     availTShirt:registration.,
//     shirtType:registration.,
//     shirtSize:registration.,
//     communityInvolvement:registration.,
//     futureVolunteer:registration.,
//     dietaryRestrictions :registration.,
//     accessibilityNeeds:registration.,
//     discountCode :registration.,
//     validIdObjectKey:registration.,
//     amountPaid:registration.,  
//     transactionId:registration.,
// });

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
