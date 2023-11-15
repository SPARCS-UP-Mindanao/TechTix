import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/MenuBar';
import { useAdminLogout } from '@/hooks/useAdminLogout';

const AdminPageHeader = () => {
  const { onLogoutUser } = useAdminLogout();

  return (
    <nav className="flex flex-row items-center justify-center gap-10 p-5">
      <Menubar>
        <MenubarMenu>
          <Link relative="route" to="../admin/events">
            <MenubarTrigger>All Events</MenubarTrigger>
          </Link>
        </MenubarMenu>
      </Menubar>

      <Button onClick={onLogoutUser}>Logout</Button>
    </nav>
  );
};

export default AdminPageHeader;
