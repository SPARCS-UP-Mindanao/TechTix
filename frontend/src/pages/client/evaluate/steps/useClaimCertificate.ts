import { useFormContext } from 'react-hook-form';
import { decodeObjectKeys, downloadFile } from '@/utils/functions';
import { DefaultEvaluateFormValues } from '@/hooks/useEvaluationForm';
import { useFileUrl } from '@/hooks/useFileUrl';

export const useClaimCertificate = () => {
  const { getValues } = useFormContext<DefaultEvaluateFormValues>();
  const certificate = getValues('certificate');

  const { certificateTemplateKey, certificatePDFTemplateKey } = certificate;

  const { fileUrl: certificateImgDataURL, isFetching: isFetchingImg } = useFileUrl(certificateTemplateKey);
  const { fileUrl: certificatePdfDataURL, isFetching: isFetchingPdf } = useFileUrl(certificatePDFTemplateKey);

  const isLoading = isFetchingImg || isFetchingPdf;

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
