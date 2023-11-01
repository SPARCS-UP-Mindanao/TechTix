import sparcs_logo_white from '@/assets/logos/sparcs_logo_white.png';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import image_placeholder from './image_placeholder/placeholder.png';

const CertificateClaim = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="h-12 w-12">
          <Avatar src={sparcs_logo_white} fallback="CN" />
        </div>
        <div className="mt-12">
          <p className="text-2xl font-bold font-subjectivity leading-6 text-neutral-50 text-center">Here's your Certificate!</p>
          <div className="my-5 sm:h-72 w-[91vw]">
            <img src={image_placeholder} alt="image_placeholder" className="rounded-2xl object-center object-cover w-full h-full" />
          </div>
          <div className="flex flex-col pt-3 w-[91vw] space-y-3">
            <Button variant="default" className="py-3 px-6 font-raleway bg-gradient-to-r from-[#D95229] to-[#F4805D] text-[#F6F6F6]">
              <Icon name="DownloadSimple" className="mr-2 h-4 w-4" />
              Download Image
            </Button>
            <Button variant="default" className="py-3 px-6 font-raleway bg-gradient-to-r from-[#D95229] to-[#F4805D] text-[#F6F6F6]">
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
