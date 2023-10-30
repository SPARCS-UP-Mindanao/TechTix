import React from "react";
import { Outlet as AdminEventRoute } from "react-router-dom";

const AdminEventPageContent = () => {
  return (
    <div>
      AdminEventPageContent
      <AdminEventRoute />
    </div>
  );
};

export default AdminEventPageContent;
