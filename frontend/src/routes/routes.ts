import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "@/pages/register/RegisterPage";
import EvaluatePage from "@/pages/evaluate/EvaluatePage";
import AdminLoginPage from "@/pages/admin/login/AdminLoginPage";
import AdminEventPage from "@/pages/admin/event/AdminEventPage";
import AdminEventRegistrationsPage from "@/pages/admin/event/AdminEventRegistrationsPage";
import AdminEventEvaluationsPage from "@/pages/admin/event/AdminEventEvaluationsPage";
import AdminAuthorityPage from "@/pages/admin/authority/AdminAuthorityPage";
import App from "@/App";

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
    element: AdminEventPage(),
  },
  {
    path: "admin/events/:eventId/registrations",
    element: AdminEventRegistrationsPage(),
  },
  {
    path: "admin/events/:eventId/evaluations",
    element: AdminEventEvaluationsPage(),
  },
  {
    path: "admin/authority",
    element: AdminAuthorityPage(),
  },
]);
