import { useContext } from 'react';
import { ClientAuthContext } from '@/context/ClientAuthContext';

export const useAuth = () => {
  const context = useContext(ClientAuthContext);

  if (context === undefined) throw new Error('useAuth must be used within a AuthContext');

  return context;
};
