import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/admin/AdminPage';
import AdminAuthorityPage from '@/pages/admin/authority/AdminAuthorityPage';
import AdminAllEventsPage from '@/pages/admin/event/allEvents/AdminAllEventsPage';
import AdminAllEvaluationsPage from '@/pages/admin/event/evaluations/AdminAllEvaluationsPage';
import AdminEventPage from '@/pages/admin/event/event/AdminEventPage';
import AdminAllRegistrationsPage from '@/pages/admin/event/registrations/AdminAllRegistrationsPage';
import AdminLoginPage from '@/pages/admin/login/AdminLoginPage';
import EvaluatePage from '@/pages/evaluate/EvaluatePage';
import RegisterPage from '@/pages/register/RegisterPage';
import App from '@/App';

export const routes = createBrowserRouter(
  [
    {
      path: '/:eventId',
      element: App(),
      children: [
        {
          path: 'register',
          element: RegisterPage()
        },
        {
          path: 'evaluate',
          element: EvaluatePage()
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
          element: AdminEventPage()
        },
        {
          path: 'registrations',
          element: AdminAllRegistrationsPage()
        },
        {
          path: 'evaluations',
          element: AdminAllEvaluationsPage()
        }
      ]
    },
    {
      path: 'admin/authority',
      element: AdminAuthorityPage()
    },
    {
      path: '*',
      element: ErrorPage({})
    }
  ],
  {
    basename: import.meta.env.VITE_STAGE === 'prod' ? '/events' : '/'
  }
);
