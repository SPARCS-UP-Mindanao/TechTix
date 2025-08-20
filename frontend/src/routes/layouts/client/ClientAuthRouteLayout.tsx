import { Navigate, Outlet } from 'react-router-dom';
import { useNavigateTo } from '@/utils/routing';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const ClientAuthRouteLayout = () => {
  const { user } = useCurrentUser();
  const { toUrl } = useNavigateTo();

  if (user) {
    return <Navigate replace to={{ pathname: toUrl.pathname, search: toUrl.search, hash: toUrl.hash }} />;
  }

  return <Outlet />;
};

export default ClientAuthRouteLayout;
