import Button from "@/components/Button";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/MenuBar";
import { Link } from "react-router-dom";


const AdminPageHeader = () => {
  const { onLogoutUser } = useAdminLogout();
  return (
    <nav className="flex flex-row items-center justify-center gap-10 p-5">
      <Menubar>
        <MenubarMenu>
          <Link relative="path" to='../registrations'>
            <MenubarTrigger>Registrations</MenubarTrigger>
          </Link>
        </MenubarMenu>
      </Menubar>

      <Button onClick={onLogoutUser}>Logout</Button>
    </nav>
  );
};

export default AdminPageHeader;
