import React from 'react';
import { Outlet } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import Skeleton from '@/components/Skeleton';
import { createQueryKey } from '@/api/utils/createApi';
import { CurrentUser, getUserAttributes } from '@/model/auth';
import { useQuery } from '@tanstack/react-query';

type AdminAuthContext = {
  user: CurrentUser | null;
  refetchUser: (() => void) | null;
};

export const AdminAuthContext = React.createContext<AdminAuthContext>({
  user: null,
  refetchUser: null
});

const AdminAuthContextProvider = () => {
  const { data, isPending, refetch } = useQuery({
    queryKey: createQueryKey('getCurrentAdminUser'),
    queryFn: async () => await fetchAuthSession(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const currentUser = getUserAttributes(data);

  if (isPending) {
    return <Skeleton className="w-full h-full rounded-none" />;
  }

  return (
    <AdminAuthContext.Provider value={{ user: currentUser, refetchUser: refetch }}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContextProvider;
