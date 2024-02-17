import Button from '@/components/Button';
import Icon from '@/components/Icon';
import ImageViewer from '@/components/ImageViewer';
import Skeleton from '@/components/Skeleton';
import { useFileUrl } from '@/hooks/useFileUrl';
import shareToLinkedIn from './shareToLinkedIn';

interface CertificateClaimProps {
  logoLink: string | undefined | null;
  certificateTemplateKey: string | undefined;
  certificatePDFTemplateKey: string | undefined;
}

const CertificateClaim = ({ logoLink, certificateTemplateKey, certificatePDFTemplateKey }: CertificateClaimProps) => {
  const imageNameImg = `${decodeURIComponent(certificateTemplateKey?.split('/').pop() ?? '')}`;
  const imageNamePdf = `${decodeURIComponent(certificatePDFTemplateKey?.split('/').pop() ?? '')}`;
  const { fileUrl: certificateImgDataURL } = useFileUrl(certificateTemplateKey!);
  const { fileUrl: certificatePdfDataURL } = useFileUrl(certificatePDFTemplateKey!);

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = certificateImgDataURL!;
    link.download = imageNameImg;

    link.click();
  };

  const downloadPDF = async () => {
    try {
      const link = document.createElement('a');
      link.href = certificatePdfDataURL!;
      link.download = imageNamePdf;

      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const shareCertificate = () => {
    const LinkedInParams = {
      certificateName: 'testCert',
      organizationId: '96606526',
      certificateIssueYear: 2023,
      certificateIssueMonth: 10,
      certificateURL: 'https://i.pinimg.com/originals/1d/bd/a3/1dbda3a29df5da215a639c8d35070c9c.jpg',
      certificateId: 'test'
    };
    shareToLinkedIn(LinkedInParams);
  };

  return (
    <>
      <div className="flex flex-col items-center h-[calc(100vh-64px)]">
        <ImageViewer objectKey={logoLink} className="w-12 h-auto rounded-full" />
        <div className="flex flex-col justify-center h-full items-center">
          <p className="text-2xl font-bold font-subjectivity leading-6 text-center">Here's your Certificate!</p>
          <div className="my-5 w-[91vw] max-w-2xl ">
            {certificateTemplateKey ? (
              <div>
                <ImageViewer
                  objectKey={certificateTemplateKey}
                  className="animate-[fade-in_3s_ease-in-out] rounded-2xl object-center object-cover w-full h-full"
                />
              </div>
            ) : (
              <Skeleton className="rounded-2xl h-[330px] w-full" />
            )}
          </div>
          <div className="flex flex-col pt-3 w-[91vw] space-y-3  max-w-2xl ">
            <Button onClick={downloadImage} variant="secondaryGradient" className="py-3 px-6">
              <Icon name="Download" className="mr-2 h-4 w-4" />
              Download Image
            </Button>
            <Button onClick={downloadPDF} variant="primaryGradient" className="py-3 px-6">
              <Icon name="Download" className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            {/* <Button onClick={shareCertificate} variant="primaryGradient" className="py-3 px-6">
              <Icon name="ShareNetwork" className="mr-2 h-4 w-4" />
              Share to LinkedIn
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateClaim;
