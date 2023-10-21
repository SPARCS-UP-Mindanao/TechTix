import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div>
      <h1>AdminPage</h1>{" "}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPage;
