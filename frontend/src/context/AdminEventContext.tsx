import { createContext, PropsWithChildren } from 'react';
import { Event } from '@/model/events';

type AdminEventContext = (Event & { refetchEvent: () => void }) | null;

export const AdminEventContext = createContext<AdminEventContext>(null);

interface Props extends PropsWithChildren {
  event: Event;
  refetchEvent: () => void;
}

const AdminEventContextProvider = ({ event, refetchEvent, children }: Props) => {
  return <AdminEventContext.Provider value={{ ...event, refetchEvent }}>{children}</AdminEventContext.Provider>;
};

export default AdminEventContextProvider;
