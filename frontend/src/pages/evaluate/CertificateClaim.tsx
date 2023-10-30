import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import image_placeholder from "./image_placeholder/placeholder.png";

const CertificateClaim = () => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="h-12 w-12">
          <Avatar src="https://github.com/shadcn.png" fallback="CN" />
        </div>
        <p className="mt-2 text-2xl font-bold">Here's your Certificate!</p>
        <div className="mt-6 sm:h-72 w-[91vw]">
          <img
            src={image_placeholder}
            alt="image_placeholder"
            className="rounded-2xl object-center object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col mt-4 w-[91vw]">
          <Button
            variant="default"
            className="mt-2.5 focus:bg-[#56B32F] bg-[#56B32F] text-[#F6F6F6]"
          >
            <Icon name="DownloadSimple" className="mr-2 h-4 w-4" />
            Download Image
          </Button>
          <Button
            variant="default"
            className="mt-2.5 focus:bg-[#56B32F] bg-[#56B32F] text-[#F6F6F6]"
          >
            <Icon name="DownloadSimple" className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button
            variant="default"
            className="mt-2.5 focus:bg-[#475FE9] bg-[#475FE9] text-[#F6F6F6]"
          >
            <Icon name="ShareNetwork" className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Icon name="download-simple" className="mr-2 h-4 w-4" />
        </div>
      </div>
    </>
  );
};

export default CertificateClaim;
