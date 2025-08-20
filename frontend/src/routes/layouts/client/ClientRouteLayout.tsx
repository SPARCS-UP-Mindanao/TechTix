import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const ClientRouteLayout = () => {
  const { user } = useCurrentUser();

  if (!user || user?.isAdmin) {
    return <Navigate replace to="/login" />;
  }

  return <Outlet />;
};

export default ClientRouteLayout;
