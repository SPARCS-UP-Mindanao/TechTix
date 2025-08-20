import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentAdminUser } from '@/hooks/useCurrentUser';

const AdminRouteLayout = () => {
  const { user } = useCurrentAdminUser();

  if (!user || !user?.isAdmin) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};

export default AdminRouteLayout;
