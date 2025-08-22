import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNavigateTo } from '@/hooks/useNavigateTo';

const ClientAuthRouteLayout = () => {
  const auth = useCurrentUser();
  const { toUrl } = useNavigateTo();

  if (auth?.user) {
    return <Navigate replace to={{ pathname: toUrl.pathname, search: toUrl.search, hash: toUrl.hash }} />;
  }

  return <Outlet />;
};

export default ClientAuthRouteLayout;
