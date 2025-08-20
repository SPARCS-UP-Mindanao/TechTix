import { Navigate, Outlet } from 'react-router-dom';
import { useNavigateTo } from '@/utils/routing';
import { useCurrentAdminUser } from '@/hooks/useCurrentUser';

const AdminAuthRouteLayout = () => {
  const { user } = useCurrentAdminUser();
  const { toUrl } = useNavigateTo();

  console.log({ user });

  // if (user) {
  //   return <Navigate replace to={{ pathname: toUrl.pathname, search: toUrl.search, hash: toUrl.hash }} />;
  // }

  return <Outlet />;
};

export default AdminAuthRouteLayout;
