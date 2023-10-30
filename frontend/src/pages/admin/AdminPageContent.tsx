import { Outlet as AdminPageRoute, Navigate } from "react-router-dom";
import AdminPageHeader from "./AdminPageHeader";
import { useIsAuthenticated } from "react-auth-kit";

const AdminPageContent = () => {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div>
      <AdminPageHeader />
      <h1>AdminPage</h1>
      <AdminPageRoute />
    </div>
  );
};

export default AdminPageContent;
