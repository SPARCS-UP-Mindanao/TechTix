import { createApi } from '@/api/utils/createApi';
import { RegisterUserInfo } from '@/model/registrations';

export const registerUserInEvent = (userInfo: RegisterUserInfo) =>
  createApi<RegisterUserInfo>({
    method: 'post',
    url: '/registrations',
    body: { ...userInfo }
  });

export const getAllRegistrations = () =>
  createApi<RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: '/registrations'
  });

export const getEventRegistrations = (eventId: string) =>
  createApi<RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: '/registrations',
    queryParams: { eventId }
  });

export const getEventRegistrationWithEmail = (eventId: string, email: string) =>
  createApi<RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: `/registrations/${email}/email`,
    queryParams: { eventId }
  });

export const getSpecificRegistration = (eventId: string, registrationId: string) =>
  createApi<RegisterUserInfo[]>({
    method: 'get',
    authorize: true,
    url: `/registrations/${registrationId}`,
    queryParams: { eventId, entryId: registrationId }
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
