import { createApi } from '@/api/utils/createApi';
import { Registration } from '@/model/registrations';

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
  certificateImgObjectKey: string | null;
  certificatePdfObjectKey: string | null;
}

const mapRegistrationDtoToRegistration = (registration: RegistrationDto): Registration => ({
  ...registration
});

const mapRegistrationsDtoToRegistrations = (registrations: RegistrationDto[]): Registration[] =>
  registrations.map((registration) => mapRegistrationDtoToRegistration(registration));

export const registerUserInEvent = (userInfo: Registration) =>
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
  createApi<Registration[]>({
    method: 'get',
    authorize: true,
    url: `/registrations/${email}/email`,
    queryParams: { eventId }
  });

export const getSpecificRegistration = (eventId: string, registrationId: string) =>
  createApi<RegistrationDto, Registration>({
    method: 'get',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId },
    output: mapRegistrationDtoToRegistration
  });

export const updateRegistration = (eventId: string, registrationId: string, userInfo: Registration) =>
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
