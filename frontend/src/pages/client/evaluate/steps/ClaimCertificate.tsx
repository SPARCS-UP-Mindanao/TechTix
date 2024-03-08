import { FC } from 'react';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import { reloadPage } from '@/utils/functions';
// import shareToLinkedIn from './shareToLinkedIn';
import { useClaimCertificate } from './useClaimCertificate';

const ClaimCertificate: FC = () => {
  const { certificateImgDataURL, isLoading, onDownloadImg, onDownloadPdf } = useClaimCertificate();

  // const onShareToLinkedIn = () => {
  //   const LinkedInParams = {
  //     certificateName: 'testCert',
  //     organizationId: '96606526',
  //     certificateIssueYear: 2023,
  //     certificateIssueMonth: 10,
  //     certificateURL: 'https://i.pinimg.com/originals/1d/bd/a3/1dbda3a29df5da215a639c8d35070c9c.jpg',
  //     certificateId: 'test'
  //   };
  //   shareToLinkedIn(LinkedInParams);
  // };

  console.log(certificateImgDataURL, isLoading);

  if (isLoading) {
    return <Skeleton className="rounded-2xl h-[330px] w-full" />;
  }

  if (!certificateImgDataURL) {
    <p className="font-subjectivity font-bold text-transparent gradient-text bg-gradient-to-br from-secondary-pink-400 to-primary-500">
      Please refresh the page
    </p>;
  }

  return (
    <>
      <h3>Here's your Certificate!</h3>
      {certificateImgDataURL && (
        <img src={certificateImgDataURL} className="animate-[fade-in_3s_ease-in-out] rounded-2xl object-center object-cover w-full h-full" />
      )}
      <div className="w-full space-y-10">
        <div className="flex flex-col space-y-4">
          <Button onClick={onDownloadImg} icon="Download" variant="secondaryGradient" className="py-3 px-6">
            Download Image
          </Button>
          <Button onClick={onDownloadPdf} icon="Download" variant="primaryGradient" className="py-3 px-6">
            Download PDF
          </Button>
        </div>

        {/* <Button onClick={onShareToLinkedIn} icon="Share" variant="primaryGradient" className="py-3 px-6">
          Share to LinkedIn
        </Button> */}

        <Button onClick={reloadPage} icon="ChevronRight" iconPlacement="right" className="w-full py-3 px-6">
          Evaluate with another user
        </Button>
      </div>
    </>
  );
};

export default ClaimCertificate;
