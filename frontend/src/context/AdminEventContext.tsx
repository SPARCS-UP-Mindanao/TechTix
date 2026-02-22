import { createContext, PropsWithChildren } from 'react';
import { Event } from '@/model/events';

interface AdminEventContext {
  event: Event;
  refetchEvent: () => void;
}

export const AdminEventContext = createContext<AdminEventContext | null>(null);

const AdminEventContextProvider = ({ event, refetchEvent, children }: PropsWithChildren<AdminEventContext>) => {
  return <AdminEventContext.Provider value={{ event, refetchEvent }}>{children}</AdminEventContext.Provider>;
};

export default AdminEventContextProvider;
