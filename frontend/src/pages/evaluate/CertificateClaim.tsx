import { useEffect, useRef } from 'react';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Skeleton from '@/components/Skeleton';
import sparcs_logo_white from './../../assets/logos/sparcs_logo_white.png';

interface LinkedInDetailsProps {
  certificateName: string | undefined;
  organizationId: string | undefined;
  certificateIssueYear: number | undefined;
  certificateIssueMonth: number | undefined;
  certificateURL: string | undefined;
  certificateId: string | undefined;
}

const fillLinkedInDetails = ({
  certificateName,
  organizationId,
  certificateIssueYear,
  certificateIssueMonth,
  certificateURL,
  certificateId
}: LinkedInDetailsProps) => {
  const certId = certificateId || '';
  const certUrl = certificateURL || '';
  const isFromA2p = true;
  const issueMonth = certificateIssueMonth || 0;
  const issueYear = certificateIssueYear || 0;
  const name = certificateName || '';

  const linkedInURL = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&certId=${certId}&certUrl=${encodeURIComponent(
    certUrl
  )}&isFromA2p=${isFromA2p}&issueMonth=${issueMonth}&issueYear=${issueYear}&name=${encodeURIComponent(name)}&organizationId=${organizationId}`;

  return linkedInURL;
};

const CertificateClaim = ({ certificateLink, certificatePDFTemplate }: { certificateLink: string | undefined; certificatePDFTemplate: string | undefined }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log(certificateLink);
  const imageName = `${certificateLink?.split('/').pop()!.split('.')[0]}.jpeg`;
  const LinkedInParams = {
    certificateName: 'testCert',
    organizationId: '96606526',
    certificateIssueYear: 2023,
    certificateIssueMonth: 10,
    certificateURL: certificateLink,
    certificateId: 'test'
  };

  const LinkedInDetails = fillLinkedInDetails(LinkedInParams);
  console.log('LinkedinDetails', LinkedInDetails);

  useEffect(() => {
    console.log('CertificatePDF: ', certificatePDFTemplate);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    const img = new Image();
    img.onload = function () {
      canvas!.width = img.width;
      canvas!.height = img.height;

      context?.drawImage(img, 0, 0, img.width, img.height);
    };

    img.setAttribute('crossorigin', 'anonymous');
    img.src = certificateLink!;
  }, [canvasRef]);

  const downloadImage = () => {
    const canvas = canvasRef.current;

    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = imageName;

      link.click();
    }
  };

  const downloadPDF = async () => {
    try {
      const link = await fetch(certificateLink!); // change argument to certificatePDFTemplate
      const blob = await link.blob();
      const dataURL = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = imageName;

      downloadLink.click();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="h-12 w-12">
          <Avatar src={sparcs_logo_white} fallback="CN" />
        </div>
        <div className="mt-12">
          <p className="text-2xl font-bold font-subjectivity leading-6 text-neutral-50 text-center">Here's your Certificate!</p>
          <div className="my-5 sm:h-72 w-[91vw] ">
            {certificateLink ? (
              <>
                {/* <img
                  src={certificateLink}
                  alt="image_placeholder"
                  className="animate-[fade-in_3s_ease-in-out] rounded-2xl object-center object-cover w-full h-full"
                /> */}
                <canvas ref={canvasRef} className="w-full h-full animate-[fade-in_3s_ease-in-out] rounded-2xl"></canvas>
              </>
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
            <Button variant="default" className="py-3 px-6 font-raleway bg-gradient-to-r from-[#4F65E3] to-[#F43F79] text-[#F6F6F6]">
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
