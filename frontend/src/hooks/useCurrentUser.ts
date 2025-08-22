import { useContext } from 'react';
import { AdminAuthContext } from '@/context/AdminAuthContext';
import { ClientAuthContext } from '@/context/ClientAuthContext';

export const useCurrentUser = () => {
  const context = useContext(ClientAuthContext);

  return context;
};

export const useCurrentAdminUser = () => {
  const context = useContext(AdminAuthContext);

  return context;
};
