import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/admin/AdminPage';
import AdminAuthorityPage from '@/pages/admin/authority/AdminAuthorityPage';
import AdminEventPage from '@/pages/admin/event/AdminEventPage';
import AdminAllEventsPage from '@/pages/admin/event/dashboard/AdminAllEventsPage';
import AdminEventDiscountsPage from '@/pages/admin/event/discounts/AdminEventDiscounts';
import AdminEventeEvaluationsPage from '@/pages/admin/event/evaluations/AdminEventEvaluations';
import AdminEventInfoPage from '@/pages/admin/event/info/AdminEventInfo';
import AdminEventRegistrationsPage from '@/pages/admin/event/registrations/AdminEventRegistrations';
import AdminLoginPage from '@/pages/admin/login/AdminLoginPage';
import UpdatePasswordPage from '@/pages/admin/updatePassword/UpdatePasswordPage';
import EvaluatePage from '@/pages/evaluate/EvaluatePage';
import EventsPage from '@/pages/landingPage/EventsPage';
import HomePage from '@/pages/landingPage/HomePage';
import RegisterPage from '@/pages/register/RegisterPage';

export const routes = createBrowserRouter([
  // {
  //   path: '',
  //   element: HomePage()
  // },
  // {
  //   path: '/events',
  //   element: EventsPage()
  // },
  {
    path: '/:eventId',
    children: [
      {
        path: 'register',
        element: RegisterPage()
      },
      {
        path: 'evaluate',
        element: EvaluatePage()
      },
      {
        path: '',
        element: ErrorPage({})
      }
    ]
  },
  {
    path: '/admin/login',
    element: AdminLoginPage()
  },
  {
    path: '/admin',
    element: AdminPage(),
    children: [
      {
        path: 'authority',
        element: AdminAuthorityPage()
      },
      {
        path: 'events',
        element: AdminAllEventsPage()
      },
      {
        path: 'events/:eventId',
        element: AdminEventPage(),
        children: [
          {
            index: true,
            element: AdminEventInfoPage()
          },
          {
            path: 'evaluations',
            element: AdminEventeEvaluationsPage()
          },
          {
            path: 'discounts',
            element: AdminEventDiscountsPage()
          },
          {
            path: 'registrations',
            element: AdminEventRegistrationsPage()
          },
          {
            path: '*',
            element: ErrorPage({})
          }
        ]
      }
    ]
  },
  {
    path: 'admin/update-password',
    element: UpdatePasswordPage()
  },
  {
    path: '*',
    element: ErrorPage({})
  }
]);
