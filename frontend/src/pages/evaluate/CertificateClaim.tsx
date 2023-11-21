import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import FileViewerComponent from '@/components/S3Image';
import Skeleton from '@/components/Skeleton';
import { useFileUrl } from '@/hooks/useFileUrl';
import sparcs_logo_white from './../../assets/logos/sparcs_logo_white.png';
import shareToLinkedIn from './shareToLinkedIn';

const CertificateClaim = ({ certificateLink, certificatePDFTemplate }: { certificateLink: string | undefined; certificatePDFTemplate: string | undefined }) => {
  const imageNameImg = `${decodeURIComponent(certificateLink?.split('/').pop()!.split('.')[0] ?? '')}.jpeg`;
  const imageNamePdf = `${decodeURIComponent(certificateLink?.split('/').pop()!.split('.')[0] ?? '')}.jpeg`; // TODO: change certificateLink to certificatePDFTemplate
  const certificateImgLinkS3 = decodeURIComponent(new URL(certificateLink!).pathname.split('?')[0].slice(1));
  const certificatePdfLinkS3 = decodeURIComponent(new URL(certificateLink!).pathname.split('?')[0].slice(1)); // TODO: change certificateLink to certificatePDFTemplate
  const certificateImgDataURL = useFileUrl(certificateImgLinkS3!);
  const certificatePdfDataURL = useFileUrl(certificatePdfLinkS3!);

  console.log(certificatePDFTemplate);

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
      <div className="flex flex-col items-center">
        <div className="h-12 w-12">
          <Avatar src={sparcs_logo_white} fallback="CN" />
        </div>
        <div className="mt-12">
          <p className="text-2xl font-bold font-subjectivity leading-6 text-center">Here's your Certificate!</p>
          <div className="my-5 w-[91vw] ">
            {certificateLink ? (
              <div>
                <FileViewerComponent
                  objectKey={certificateImgLinkS3}
                  className="animate-[fade-in_3s_ease-in-out] rounded-2xl object-center object-cover w-full h-full"
                />
              </div>
            ) : (
              <Skeleton className="rounded-2xl h-[330px] w-full bg-neutral-500" />
            )}
          </div>
          <div className="flex flex-col pt-3 w-[91vw] space-y-3">
            <Button onClick={downloadImage} variant="default" className="py-3 px-6 font-raleway bg-gradient-to-r from-[#D95229] to-[#F4805D] text-[#F6F6F6]">
              <Icon name="DownloadSimple" className="mr-2 h-4 w-4" />
              Download Image
            </Button>
            <Button onClick={downloadPDF} variant="default" className="py-3 px-6 font-raleway bg-gradient-to-r from-[#D95229] to-[#F4805D] text-[#F6F6F6]">
              <Icon name="DownloadSimple" className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={shareCertificate} variant="default" className="py-3 px-6 font-raleway bg-gradient-to-r from-[#4F65E3] to-[#F43F79] text-[#F6F6F6]">
              <Icon name="ShareNetwork" className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Icon name="download-simple" className="mr-2 h-4 w-4" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateClaim;
