import { createApi } from '@/api/utils/createApi';
import { RegisterUserInfo } from '@/model/registrations';

interface RegistrationDto {
  firstName: string;
  lastName: string;
  contactNumber: string;
  careerStatus: string;
  yearsOfExperience: string;
  organization: string;
  title: string;
  certificateClaimed: boolean;
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
}

const mapRegistrationDtoToRegistration = (registration: RegistrationDto): RegisterUserInfo => ({
  firstName: registration.firstName,
  lastName: registration.lastName,
  contactNumber: registration.contactNumber,
  careerStatus: registration.careerStatus,
  yearsOfExperience: registration.yearsOfExperience,
  organization: registration.organization,
  title: registration.title,
  certificateClaimed: registration.certificateClaimed,
  email: registration.email,
  eventId: registration.eventId,
  registrationId: registration.registrationId,
  createDate: registration.createDate,
  paymentId: registration.paymentId,
  discountCode: registration.discountCode,
  amountPaid: registration.amountPaid,
  referenceNumber: registration.referenceNumber,
  gcashPayment: registration.gcashPayment,
  gcashPaymentUrl: registration.gcashPaymentUrl
});

const mapRegistrationsDtoToRegistrations = (registrations: RegistrationDto[]): RegisterUserInfo[] =>
  registrations.map((registration) => mapRegistrationDtoToRegistration(registration));

export const registerUserInEvent = (userInfo: RegisterUserInfo) =>
  createApi<RegisterUserInfo>({
    method: 'post',
    url: '/registrations',
    body: { ...userInfo }
  });

export const getAllRegistrations = () =>
  createApi<RegistrationDto[], RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: '/registrations',
    output: mapRegistrationsDtoToRegistrations
  });

export const getEventRegistrations = (eventId: string) =>
  createApi<RegistrationDto[], RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: '/registrations',
    queryParams: { eventId },
    output: mapRegistrationsDtoToRegistrations
  });

export const getEventRegistrationWithEmail = (eventId: string, email: string) =>
  createApi<RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: `/registrations/${email}/email`,
    queryParams: { eventId }
  });

export const getSpecificRegistration = (eventId: string, registrationId: string) =>
  createApi<RegistrationDto, RegisterUserInfo>({
    method: 'get',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    output: mapRegistrationDtoToRegistration
  });

export const updateRegistration = (eventId: string, registrationId: string, userInfo: RegisterUserInfo) =>
  createApi<RegisterUserInfo>({
    method: 'put',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    body: { ...userInfo }
  });

export const deleteRegistration = (eventId: string, registrationId: string) =>
  createApi<RegisterUserInfo>({
    method: 'delete',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId }
  });
