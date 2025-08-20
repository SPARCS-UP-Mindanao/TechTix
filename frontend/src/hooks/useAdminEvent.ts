import { useContext } from 'react';
import { AdminEventContext } from '@/context/AdminEventContext';

const useAdminEvent = () => {
  const context = useContext(AdminEventContext);

  if (context === undefined) {
    throw new Error('useAdminEvent should be used within a AdminEventContextProvider');
  }

  return context;
};

export default useAdminEvent;
