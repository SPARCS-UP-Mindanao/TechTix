import { createBrowserRouter } from 'react-router-dom';
import Error404 from '@/pages/Error404';
import AdminPage from '@/pages/admin/AdminPage';
import AdminAuthorityPage from '@/pages/admin/authority/AdminAuthorityPage';
import AdminAllEventsPage from '@/pages/admin/event/allEvents/AdminAllEventsPage';
import AdminEventEvaluationsPage from '@/pages/admin/event/evaluations/AdminEventEvaluationsPage';
import AdminEventPage from '@/pages/admin/event/event/AdminEventPage';
import AdminEventRegistrationsPage from '@/pages/admin/event/registrations/AdminEventRegistrationsPage';
import AdminLoginPage from '@/pages/admin/login/AdminLoginPage';
import EvaluatePage from '@/pages/evaluate/EvaluatePage';
import RegisterPage from '@/pages/register/RegisterPage';
import SuccessPage from '@/pages/register/Success/SuccessPage';
import App from '@/App';

export const routes = createBrowserRouter(
  [
    {
      path: '/',
      element: App(),
      children: [
        {
          path: ':eventId',
          children: [
            {
              path: 'register',
              element: RegisterPage()
            },
            {
              path: 'register/success',
              element: SuccessPage()
            },
            {
              path: 'evaluate',
              element: EvaluatePage()
            }
          ]
        }
      ]
    },
    {
      path: '/admin/login',
      element: AdminLoginPage()
    },
    {
      path: '/admin/events',
      element: AdminPage(),
      children: [
        {
          index: true,
          element: AdminAllEventsPage()
        },
        {
          path: ':eventId',
          element: AdminEventPage(),
          children: [
            {
              path: 'registrations',
              element: AdminEventRegistrationsPage()
            },
            {
              path: 'evaluations',
              element: AdminEventEvaluationsPage()
            }
          ]
        }
      ]
    },
    {
      path: 'admin/authority',
      element: AdminAuthorityPage()
    },
    {
      path: '*',
      element: Error404()
    }
  ],
  {
    basename: import.meta.env.VITE_STAGE === 'prod' ? '/events' : '/'
  }
);
