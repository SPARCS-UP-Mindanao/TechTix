import { RouteObject } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import AdminPage from '@/pages/admin/AdminPage';
import AdminAuthorityPage from '@/pages/admin/authority/AdminAuthorityPage';
import AdminEventPage from '@/pages/admin/event/AdminEventPage';
import AdminAllEventsPage from '@/pages/admin/event/dashboard/AdminAllEventsPage';
import CreateEventPage from '@/pages/admin/event/dashboard/CreateEventPage';
import AdminEventDiscounts from '@/pages/admin/event/discounts/AdminEventDiscounts';
import AdminEventEvaluations from '@/pages/admin/event/evaluations/AdminEventEvaluations';
import AdminEventFAQs from '@/pages/admin/event/faqs/AdminEventFAQs';
import AdminEventInfo from '@/pages/admin/event/info/AdminEventInfo';
import AdminEventRegistrations from '@/pages/admin/event/pycon/registrations/AdminEventRegistrations';
// import AdminEventRegistrations from '@/pages/admin/event/registrations/AdminEventRegistrations';
import AdminLoginPage from '@/pages/admin/login/AdminLoginPage';
import UpdatePasswordPage from '@/pages/admin/updatePassword/UpdatePasswordPage';
import AdminAuthRouteLayout from './layouts/admin/AdminAuthRouteLayout';
import AdminRouteLayout from './layouts/admin/AdminRouteLayout';
import AdminAuthContextProvider from '@/context/AdminAuthContext';

const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminAuthContextProvider />,
    children: [
      {
        path: '',
        element: <AdminAuthRouteLayout />,
        children: [
          {
            path: 'login',
            element: <AdminLoginPage />
          },
          {
            path: 'update-password',
            element: <UpdatePasswordPage />
          }
        ]
      },
      {
        path: '',
        element: <AdminRouteLayout />,
        children: [
          {
            element: <AdminPage />,
            children: [
              {
                path: 'authority',
                element: <AdminAuthorityPage />
              },
              {
                path: 'events',
                element: <AdminAllEventsPage />
              },
              {
                path: 'events/create',
                element: <CreateEventPage />
              },
              {
                path: 'events/:eventId',
                element: <AdminEventPage />,
                children: [
                  {
                    index: true,
                    element: <AdminEventInfo />
                  },
                  {
                    path: 'evaluations',
                    element: <AdminEventEvaluations />
                  },
                  {
                    path: 'discounts',
                    element: <AdminEventDiscounts />
                  },
                  {
                    path: 'registrations',
                    element: <AdminEventRegistrations />
                  },
                  {
                    path: 'faqs',
                    element: <AdminEventFAQs />
                  },
                  {
                    path: '*',
                    element: ErrorPage({})
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: '*',
        element: ErrorPage({})
      }
    ]
  }
];

export default adminRoutes;
