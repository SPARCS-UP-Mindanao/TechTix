import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import Alert from '@/components/Alert';
import Skeleton from '@/components/Skeleton';
import { createQueryKey } from '@/api/utils/createApi';
import { CurrentUser, getUserAttributes } from '@/model/auth';
import { useQuery } from '@tanstack/react-query';

type ClientAuth = {
  user: CurrentUser;
  refetchUser: () => void;
} | null;

export const ClientAuthContext = React.createContext<ClientAuth>(null);

const ClientAuthContextProvider = () => {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const { data, isPending, refetch } = useQuery({
    queryKey: createQueryKey('getCurrentUser'),
    queryFn: async () => await fetchAuthSession(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !isAdminRoute
  });

  const currentUser = getUserAttributes(data);

  if (isAdminRoute) {
    return <Navigate replace to={location} />;
  }

  if (isPending) {
    return <Skeleton className="w-full h-full rounded-none" />;
  }

  return (
    <ClientAuthContext.Provider value={{ user: currentUser, refetchUser: refetch }}>
      {currentUser?.isAdmin && <Alert closable className="bg-accent/50 rounded-none" title="You are accessing a client page as an admin" />}
      <Outlet />
    </ClientAuthContext.Provider>
  );
};

export default ClientAuthContextProvider;
