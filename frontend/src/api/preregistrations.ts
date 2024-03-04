import { PreRegistration, PreRegistrationCreate, PreRegistrationUpdate } from '@/model/preregistrations';
import { createApi } from './utils/createApi';

interface PreRegistrationDto extends PreRegistration {}

const mapPreRegistrationToDto = (preRegistration: PreRegistrationDto): PreRegistration => ({
  ...preRegistration,
  acceptanceStatus: preRegistration.acceptanceStatus || 'PENDING',
  type: 'preregistration'
});

const mapPreRegistrationsToDto = (preRegistrations: PreRegistrationDto[]): PreRegistration[] => preRegistrations.map(mapPreRegistrationToDto);

export const preRegisterUserInEvent = (userInfo: PreRegistrationCreate) =>
  createApi<PreRegistration>({
    method: 'post',
    url: '/preregistrations',
    body: { ...userInfo }
  });

export const getEventPreRegistrations = (eventId: string) =>
  createApi<PreRegistrationDto[], PreRegistration[]>({
    method: 'get',
    authorize: true,
    url: '/preregistrations',
    queryParams: { eventId },
    output: mapPreRegistrationsToDto
  });

export const getPreRegistration = (eventId: string, entryId: string) =>
  createApi<PreRegistrationDto, PreRegistration>({
    method: 'get',
    authorize: true,
    url: `/preregistrations/${entryId}`,
    queryParams: { eventId, entryId },
    output: mapPreRegistrationToDto
  });

export const updatePreRegistration = (eventId: string, entryId: string, userInfo: PreRegistrationUpdate) =>
  createApi<PreRegistration>({
    method: 'put',
    authorize: true,
    url: `/preregistrations/${entryId}`,
    queryParams: { eventId, entryId },
    body: { ...userInfo }
  });

export const checkPreRegistration = (eventId: string, email: string) =>
  createApi<PreRegistrationDto, PreRegistration>({
    method: 'get',
    authorize: true,
    url: `/preregistrations/${email}/email`,
    queryParams: { eventId },
    output: mapPreRegistrationToDto
  });
