import { useContext } from 'react';
import { AdminAuthContext } from '@/context/AdminAuthContext';
import { AuthContext } from '@/context/AuthContext';

export const useCurrentUser = () => {
  const context = useContext(AuthContext);

  return context;
};

export const useCurrentAdminUser = () => {
  const context = useContext(AdminAuthContext);

  return context;
};
