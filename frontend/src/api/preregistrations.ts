import { PreRegistration } from '@/model/preregistrations';
import { createApi } from './utils/createApi';

interface PreRegistrationDto extends PreRegistration {}

const mapPreRegistrationToDto = (preRegistration: PreRegistrationDto): PreRegistration => preRegistration;
const mapPreRegistrationsToDto = (preRegistrations: PreRegistrationDto[]): PreRegistration[] => preRegistrations.map(mapPreRegistrationToDto);

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

// map value to check if email is valid pre-registration
export const checkPreRegistration = (eventId: string, email: string) =>
  createApi<PreRegistrationDto, PreRegistration>({
    method: 'get',
    authorize: true,
    url: `/preregistrations/${email}/email`,
    queryParams: { eventId, email },
    output: mapPreRegistrationToDto
  });
