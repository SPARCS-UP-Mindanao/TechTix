import Avatar from '@/components/Avatar';
import FileViewerComponent from '@/components/S3Image';

interface PageHeaderProps {
  avatarImg?: string | null;
  bannerImg?: string | null;
  bannerUrl?: string | null;
}

const PageHeader = ({ avatarImg, bannerImg, bannerUrl }: PageHeaderProps) => {
  return (
    <>
      {avatarImg && bannerImg && (
        // <div className="flex flex-col items-center pt-4">
        //   <Avatar className="h-12 w-12" src={avatarImg} fallback="sparcs_logo" />
        //   <img src={bannerImg} alt="event_banner" className="drop-shadow-xl rounded-2xl object-center object-cover w-full h-full mt-6" />
        // </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <FileViewerComponent objectKey={avatarImg} />
          </div>
          <div className="flex w-full justify-center my-8 relative overflow-hidden">
            <FileViewerComponent objectKey={bannerImg} className="w-full max-w-md object-cover z-10" />
            <div className="blur-2xl absolute w-full h-full inset-0 bg-center" style={{ backgroundImage: `url(${bannerUrl})` }}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageHeader;
