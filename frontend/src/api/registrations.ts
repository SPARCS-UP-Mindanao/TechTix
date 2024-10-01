import { createApi } from '@/api/utils/createApi';
import { CreateRegistration, Registration, UpdateRegistration } from '@/model/registrations';

export interface RegistrationDto {
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
  createDate: string;
  updateDate: string;
  paymentId: string | null;
  discountCode: string | null;
  amountPaid: number | null;
  referenceNumber: string | null;
  gcashPayment: string | null;
  gcashPaymentUrl: string | null;
  certificateGenerated: boolean;
  certificateClaimed: boolean;
  certificateImgObjectKey: string | null;
  certificatePdfObjectKey: string | null;
  ticketTypeId: string | null;
  shirtSize: string | null;
  cityOfResidence: string | null;
  industry: string | null;
  levelOfAWSUsage: string | null;
  awsUsecase: string | null;
  awsCommunityDayInLineWith: string | null;
  foodRestrictions: string | null;
}

const mapRegistrationDtoToRegistration = (registration: RegistrationDto): Registration => ({
  ...registration,
  type: 'registration'
});

const mapRegistrationsDtoToRegistrations = (registrations: RegistrationDto[]): Registration[] =>
  registrations.map((registration) => mapRegistrationDtoToRegistration(registration));

export const registerUserInEvent = (userInfo: CreateRegistration) =>
  createApi<Registration>({
    method: 'post',
    url: '/registrations',
    body: { ...userInfo }
  });

export const getAllRegistrations = () =>
  createApi<RegistrationDto[], Registration[]>({
    method: 'get',
    authorize: true,
    url: '/registrations',
    output: mapRegistrationsDtoToRegistrations
  });

export const getEventRegistrations = (eventId: string) =>
  createApi<RegistrationDto[], Registration[]>({
    method: 'get',
    authorize: true,
    url: '/registrations',
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
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    output: mapRegistrationDtoToRegistration
  });

export const updateRegistration = (eventId: string, registrationId: string, userInfo: UpdateRegistration) =>
  createApi<Registration>({
    method: 'put',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    body: { ...userInfo }
  });

export const deleteRegistration = (eventId: string, registrationId: string) =>
  createApi<Registration>({
    method: 'delete',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId }
  });
