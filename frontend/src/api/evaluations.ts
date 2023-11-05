import { createApi } from './utils/createApi';

export const claimCertificate = (email: string, eventId: string) =>
  createApi({
    method: 'put',
    url: `/certificates/${eventId}/claim`,
    params: {
      email
    }
  });
