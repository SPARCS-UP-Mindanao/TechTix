import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/Button';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/MenuBar';
import { createEvent } from '@/api/events';
import { useAdminLogout } from '@/hooks/useAdminLogout';
import { useFetchQuery } from '@/hooks/useApi';
import { Event } from '@/model/events';

const AdminPageHeader = () => {
  const { onLogoutUser } = useAdminLogout();
  const navigate = useNavigate();
  const { fetchQuery } = useFetchQuery<any>();

  const defaultEvent: Event = {
    name: 'Unnamed Event',
    description: '',
    venue: '',
    startDate: new Date(),
    endDate: new Date(),
    price: 0,
    bannerLink: '',
    status: 'draft',
    autoConfirm: true,
    payedEvent: false
  };
  const createEventTrigger = async () => {
    const response = await fetchQuery(createEvent(defaultEvent));
    const eventResponse = response.data;
    navigate(`/admin/events/${eventResponse?.entryId}`);
  };
  return (
    <nav className="flex flex-row items-center justify-center gap-10 p-5">
      <Menubar>
        <MenubarMenu>
          <Link relative="route" to="../admin/events">
            <MenubarTrigger>All Events</MenubarTrigger>
          </Link>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger onClick={() => createEventTrigger()}>Create Event</MenubarTrigger>
        </MenubarMenu>
      </Menubar>

      <Button onClick={onLogoutUser}>Logout</Button>
    </nav>
  );
};

export default AdminPageHeader;
