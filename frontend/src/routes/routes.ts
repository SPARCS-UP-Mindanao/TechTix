import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "@/pages/register/RegisterPage";
import EvaluatePage from "@/pages/evaluate/EvaluatePage";
import AdminLoginPage from "@/pages/admin/login/AdminLoginPage";
import AdminAllEventsPage from "@/pages/admin/event/allEvents/AdminAllEventsPage";
import AdminEventRegistrationsPage from "@/pages/admin/event/registrations/AdminEventRegistrationsPage";
import AdminEventEvaluationsPage from "@/pages/admin/event/evaluations/AdminEventEvaluationsPage";
import AdminAuthorityPage from "@/pages/admin/authority/AdminAuthorityPage";
import App from "@/App";
import AdminPage from "@/pages/admin/AdminPage";
import Error404 from "@/pages/Error404";
import AdminEventPage from "@/pages/admin/event/event/AdminEventPage";

export const routes = createBrowserRouter(
  [
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
      path: "admin/events",
      element: AdminPage(),
      children: [
        {
          index: true,
          element: AdminAllEventsPage(),
        },
        {
          path: ":eventId",
          element: AdminEventPage(),
          children: [
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
  ],
  {
    basename: import.meta.env.VITE_STAGE === "prod" ? "/events" : "/",
  }
);
