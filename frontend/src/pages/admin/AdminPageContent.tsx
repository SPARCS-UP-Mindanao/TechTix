import { Outlet as AdminPageRoute, Navigate } from "react-router-dom";
import AdminPageHeader from "./AdminPageHeader";
import { useIsAuthenticated } from "react-auth-kit";
import { useApi } from "@/hooks/useApi";
import { getAllEvents, getEvent } from "@/api/events";

const AdminPageContent = () => {
  const isAuthenticated = useIsAuthenticated();
  const { data: allEvents } = useApi(getAllEvents());
  const { data: event } = useApi(getEvent("01HCXXDEAHNG0S57WG2MHVNRYV"));

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

      <h1 className="text-secondary">{event?.name}</h1>
      <AdminPageRoute />
    </div>
  );
};

export default AdminPageContent;
