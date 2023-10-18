import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "@/pages/register/RegisterPage";
import EvaluatePage from "@/pages/evaluate/EvaluatePage";
import AdminLoginPage from "@/pages/admin/login/AdminLoginPage";
import AdminEventPage from "@/pages/admin/event/AdminEventPage";
import AdminEventRegistrationsPage from "@/pages/admin/event/AdminEventRegistrationsPage";
import AdminEventEvaluationsPage from "@/pages/admin/event/AdminEventEvaluationsPage";
import AdminAuthorityPage from "@/pages/admin/authority/AdminAuthorityPage";
import App from "@/App";
import AdminPage from "@/pages/admin/AdminPage";
import Error404 from "@/pages/Error404";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: App(),
  },
  {
    path: "/register",
    element: RegisterPage(),
  },
  {
    path: "/evaluate",
    element: EvaluatePage(),
  },
  {
    path: "/admin/login",
    element: AdminLoginPage(),
  },
  {
    path: "admin/events/:eventId",
    element: AdminPage(),
    children: [
      {
        index: true,
        element: AdminEventPage(),
      },
      {
        path: "registrations",
        element: AdminEventRegistrationsPage(),
      },
      {
        path: "evaluations",
        element: AdminEventEvaluationsPage(),
      },
    ],
  },
  {
    path: "admin/authority",
    element: AdminAuthorityPage(),
  },
  {
    path: "*",
    element: Error404(),
  },
]);
