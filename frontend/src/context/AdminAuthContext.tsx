import React from 'react';
import { Outlet } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import Skeleton from '@/components/Skeleton';
import { createQueryKey } from '@/api/utils/createApi';
import { CurrentUser, getUserAttributes } from '@/model/auth';
import { useQuery } from '@tanstack/react-query';

type AdminAuthContext = {
  user: CurrentUser;
  refetchUser: () => void;
} | null;

export const AdminAuthContext = React.createContext<AdminAuthContext>(null);

//TODO: Fix this
const AdminAuthContextProvider = () => {
  const { data, isFetching, refetch } = useQuery({
    queryKey: createQueryKey('getCurrentAdminUser'),
    queryFn: async () => await fetchAuthSession(),
    // queryFn: async () => ({
    //   user: true
    // }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const currentUser = getUserAttributes(data);
  // const currentUser = {
  //   id: '1',
  //   email: '2@gmal.com',
  //   groups: ['admin'],
  //   isAdmin: true
  // };

  if (isFetching) {
    return <Skeleton className="w-full h-full rounded-none" />;
  }

  return (
    <AdminAuthContext.Provider value={{ user: currentUser, refetchUser: refetch }}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContextProvider;
