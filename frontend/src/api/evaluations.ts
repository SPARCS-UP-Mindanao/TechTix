import { Evaluation } from '@/model/evaluations';
import { createApi } from './utils/createApi';

export interface ClaimCertificateResponse {
  isFirstClaim: boolean;
  certificateTemplate: string;
  certificatePDFTemplate: string;
  registrationId: string;
  certificateTemplateKey: string;
  certificatePDFTemplateKey: string;
}

export const claimCertificate = (eventId: string, email: string) =>
  createApi<ClaimCertificateResponse>({
    method: 'put',
    url: `/certificates/${eventId}/claim`,
    body: { email }
  });

export const getEvaluations = (eventId: string, registrationId?: string) => {
  return createApi<Evaluation[]>({
    method: 'get',
    url: `/evaluations`,
    queryParams: { eventId, registrationId }
  });
};

export const postEvaluation = (eventId: string, registrationId: string, data: any) =>
  createApi({
    method: 'post',
    url: `/evaluations`,
    body: { eventId, registrationId, evaluationList: data }
  });

export const getEventEvaluations = (eventId: string) =>
  createApi({
    method: 'get',
    url: '/evaluations',
    authorize: true,
    queryParams: { eventId }
  });
