import { Outlet as AdminPageRoute, Navigate } from "react-router-dom";
import AdminPageHeader from "./AdminPageHeader";
import { useIsAuthenticated } from "react-auth-kit";
import { useApi } from "@/hooks/useApi";
import { getAllEvents } from "@/api/events";

const AdminPageContent = () => {
  const isAuthenticated = useIsAuthenticated();
  const { data: allEvents } = useApi(getAllEvents());

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div>
      <AdminPageHeader />
      <h1>AdminPage</h1>
      {allEvents?.map((event) => (
        <p>{event.name}</p>
      ))}
      <AdminPageRoute />
    </div>
  );
};

export default AdminPageContent;
