import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentAdminUser } from '@/hooks/useCurrentUser';
import { useNavigateTo } from '@/hooks/useNavigateTo';

const AdminAuthRouteLayout = () => {
  const auth = useCurrentAdminUser();
  const { toUrl } = useNavigateTo();

  if (auth?.user && auth?.user.isAdmin) {
    if (toUrl.pathname === '/' && !toUrl.search) {
      return <Navigate replace to="/admin/events" />;
    }

    return <Navigate replace to={{ pathname: toUrl.pathname, search: toUrl.search, hash: toUrl.hash }} />;
  }

  return <Outlet />;
};

export default AdminAuthRouteLayout;
