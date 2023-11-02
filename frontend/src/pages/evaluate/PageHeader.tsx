import Avatar from '@/components/Avatar';

// interface PageHeaderProps {
//   avatarImg: string;
//   bannerImg: string;
// }

const PageHeader = ({ avatarImg, bannerImg }: { avatarImg: any; bannerImg: any }) => {
  return (
    <div className="flex flex-col items-center pt-4">
      <Avatar className="h-12 w-12" src={avatarImg} fallback="sparcs_logo" />
      <img src={bannerImg} alt="event_banner" className="drop-shadow-xl rounded-2xl object-center object-cover w-full h-full mt-6" />
    </div>
  );
};

export default PageHeader;
