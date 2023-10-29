import Button from "@/components/Button";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import React from "react";

const AdminPageHeader = () => {
  const { onLogoutUser } = useAdminLogout();
  return (
    <nav>
      <Button onClick={onLogoutUser}>Logout</Button>
    </nav>
  );
};

export default AdminPageHeader;
