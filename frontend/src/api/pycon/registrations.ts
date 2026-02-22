import { createApi } from '@/api/utils/createApi';
import { CreateRegistration, Registration, UpdateRegistration } from '@/model/pycon/registrations';

export interface RegistrationDto {
  registrationId: string;
  transactionId: string;
  amountPaid: number;
  firstName: string;
  lastName: string;
  nickname: string;
  pronouns: string;
  email: string;
  eventId: string;
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
  imageIdUrl: string;
  createDate: string;
  updateDate: string;
}

interface CsvResponse {
  downloadLink: string;
  objectKey: string;
}

const mapRegistrationDtoToRegistration = (registration: RegistrationDto): Registration => ({
  registrationId: registration.registrationId,
  transactionId: registration.transactionId,
  amountPaid: registration.amountPaid,
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
  validIdObjectKey: registration.validIdObjectKey,
  createDate: registration.createDate,
  updateDate: registration.updateDate
});

const mapRegistrationsDtoToRegistrations = (registrations: RegistrationDto[]): Registration[] =>
  registrations.map((registration) => mapRegistrationDtoToRegistration(registration));

export const registerUserInEvent = (userInfo: CreateRegistration) =>
  createApi<Registration>({
    method: 'post',
    url: '/pycon/registrations',
    body: { ...userInfo }
  });

export const getEventRegistrations = (eventId: string) =>
  createApi<RegistrationDto[], Registration[]>({
    method: 'get',
    authorize: true,
    url: '/pycon/registrations',
    queryParams: { eventId },
    output: mapRegistrationsDtoToRegistrations
  });

export const getEventRegistrationWithEmail = (eventId: string, email: string) =>
  createApi<RegistrationDto, Registration>({
    method: 'get',
    authorize: true,
    url: `/pycon/registrations/${email}/email`,
    queryParams: { eventId },
    output: mapRegistrationDtoToRegistration
  });

export const getSpecificRegistration = (eventId: string, registrationId: string) =>
  createApi<RegistrationDto, Registration>({
    method: 'get',
    authorize: true,
    url: `/pycon/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    output: mapRegistrationDtoToRegistration
  });

export const updateRegistration = (eventId: string, registrationId: string, userInfo: UpdateRegistration) =>
  createApi<Registration>({
    method: 'put',
    authorize: true,
    url: `/pycon/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    body: { eventId, ...userInfo }
  });

export const deleteRegistration = (eventId: string, registrationId: string) =>
  createApi<Registration>({
    method: 'delete',
    authorize: true,
    url: `/pycon/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId }
  });

export const getCsvRegistrations = (eventId: string) =>
  createApi<CsvResponse>({
    authorize: true,
    method: 'get',
    url: `/registrations/${eventId}/csv_download`
  });
