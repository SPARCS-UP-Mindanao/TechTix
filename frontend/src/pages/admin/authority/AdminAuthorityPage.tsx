import { useOutletContext } from 'react-router-dom';
import { CurrentUser } from '@/api/auth';
import { useMetaData } from '@/hooks/useMetaData';

interface AdminAuthorityContext {
  userGroups: CurrentUser['cognito:groups'];
}

const AdminAuthority = () => {
  useMetaData({});

  const { userGroups } = useOutletContext<AdminAuthorityContext>();

  return (
    <div>
      AdminAuthorityPage
      <p> Groups: {userGroups}</p>
    </div>
  );
};

const AdminAuthorityPage = () => {
  return <AdminAuthority />;
};

export default AdminAuthorityPage;
