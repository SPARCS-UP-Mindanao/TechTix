import { createApi } from '@/api/utils/createApi';
import { CreateRegistration, Registration, UpdateRegistration } from '@/model/pycon/registrations';

export interface RegistrationDto {
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
  amountPaid: number | null;
  transactionId: string | null;
}

interface CsvResponse {
  downloadLink: string;
  objectKey: string;
}

const mapRegistrationDtoToRegistration = (registration: RegistrationDto): Registration => ({
  ...registration
});

const mapRegistrationsDtoToRegistrations = (registrations: RegistrationDto[]): Registration[] =>
  registrations.map((registration) => mapRegistrationDtoToRegistration(registration));

export const registerUserInEvent = (userInfo: CreateRegistration) =>
  createApi<Registration>({
    method: 'post',
    url: '/pycon/registrations',
    body: { ...userInfo }
  });

export const getAllRegistrations = () =>
  createApi<RegistrationDto[], Registration[]>({
    method: 'get',
    authorize: true,
    url: '/pycon/registrations',
    output: mapRegistrationsDtoToRegistrations
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
    url: `/registrations/${email}/email`,
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
    body: { ...userInfo }
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
