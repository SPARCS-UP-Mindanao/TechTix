import Avatar from '@/components/Avatar';
import FileViewerComponent from '@/components/FileViewerComponent';

interface PageHeaderProps {
  avatarImg?: string | null;
  bannerImg?: string | null;
  bannerUrl?: string | null;
}

const PageHeader = ({ avatarImg, bannerImg, bannerUrl }: PageHeaderProps) => {
  return (
    <>
      {avatarImg && bannerImg && (
        <div className="flex flex-col items-center">
          <FileViewerComponent objectKey={avatarImg} className="w-12 h-12 rounded-full overflow-hidden" />
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
