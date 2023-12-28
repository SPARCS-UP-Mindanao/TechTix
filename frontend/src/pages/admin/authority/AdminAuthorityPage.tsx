import { useMetaData } from '@/hooks/useMetaData';

const AdminAuthority = () => {
  useMetaData({});
  return <div>AdminAuthorityPage</div>;
};

const AdminAuthorityPage = () => {
  return <AdminAuthority />;
};

export default AdminAuthorityPage;
