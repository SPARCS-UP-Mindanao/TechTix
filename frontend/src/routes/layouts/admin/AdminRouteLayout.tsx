import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCurrentAdminUser } from '@/hooks/useCurrentUser';

const AdminRouteLayout = () => {
  const auth = useCurrentAdminUser();
  const loc = useLocation();
  const to = encodeURIComponent(loc.pathname + loc.search + loc.hash);

  if (!auth?.user) {
    return <Navigate replace to={{ pathname: '/admin/login', search: `?to=${to}` }} />;
  }

  if (!auth.user?.isAdmin) {
    return <Navigate replace to={{ pathname: '/admin/login' }} />;
  }

  return <Outlet />;
};

export default AdminRouteLayout;
