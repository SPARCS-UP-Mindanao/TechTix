import { useFormContext } from 'react-hook-form';
import { decodeObjectKeys, downloadFile } from '@/utils/functions';
import { useFileUrl } from '@/hooks/useFileUrl';
import { DefaultEvaluateFormValues } from '@/hooks/usePyconEvaluationForm';

export const useClaimCertificate = (eventId: string) => {
  const { getValues } = useFormContext<DefaultEvaluateFormValues>();
  const certificate = getValues('certificate');

  const { certificateTemplateKey, certificatePDFTemplateKey } = certificate;

  const { fileUrl: certificateImgDataURL, isPending: isPendingImg } = useFileUrl(eventId, certificateTemplateKey);
  const { fileUrl: certificatePdfDataURL, isPending: isPendingPdf } = useFileUrl(eventId, certificatePDFTemplateKey);

  const isLoading = isPendingImg || isPendingPdf;

  const onDownloadImg = () => {
    if (certificateImgDataURL && certificateTemplateKey) {
      downloadFile(certificateImgDataURL, decodeObjectKeys(certificateTemplateKey));
    }
  };

  const onDownloadPdf = () => {
    if (certificatePdfDataURL && certificatePDFTemplateKey) {
      downloadFile(certificatePdfDataURL, decodeObjectKeys(certificatePDFTemplateKey));
    }
  };

  return {
    certificateImgDataURL,
    isLoading,
    onDownloadImg,
    onDownloadPdf
  };
};
