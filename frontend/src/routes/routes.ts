import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';

// import AdminPage from '@/pages/admin/AdminPage';
// import AdminAuthorityPage from '@/pages/admin/authority/AdminAuthorityPage';
// import AdminEventPage from '@/pages/admin/event/AdminEventPage';
// import AdminAllEventsPage from '@/pages/admin/event/dashboard/AdminAllEventsPage';
// import CreateEventPage from '@/pages/admin/event/dashboard/CreateEventPage';
// import AdminEventDiscountsPage from '@/pages/admin/event/discounts/AdminEventDiscounts';
// import AdminEventeEvaluationsPage from '@/pages/admin/event/evaluations/AdminEventEvaluations';
// import AdminEventInfoPage from '@/pages/admin/event/info/AdminEventInfo';
// import AdminEventRegistrationsPage from '@/pages/admin/event/registrations/AdminEventRegistrations';
// import AdminLoginPage from '@/pages/admin/login/AdminLoginPage';
// import UpdatePasswordPage from '@/pages/admin/updatePassword/UpdatePasswordPage';
// import EvaluatePage from '@/pages/evaluate/EvaluatePage';
// import EventsPage from '@/pages/landingPage/EventsPage';
// import HomePage from '@/pages/landingPage/HomePage';
// import RegisterPage from '@/pages/register/RegisterPage';

export const routes = createBrowserRouter([
  {
    path: '',
    // element: HomePage()
    lazy: () => import('@/pages/landingPage/HomePage')
  },
  {
    path: '/events',
    // element: EventsPage()
    lazy: () => import('@/pages/landingPage/EventsPage')
  },
  {
    path: '/:eventId',
    lazy: () => import('@/pages/client/ClientPage'),
    children: [
      {
        path: 'register',
        // element: RegisterPage()
        lazy: () => import('@/pages/client/register/RegisterPage')
      },
      {
        path: 'evaluate',
        // element: EvaluatePage()
        lazy: () => import('@/pages/client/evaluate/EvaluatePage')
      },
      {
        path: '',
        element: ErrorPage({})
      }
    ]
  },
  {
    path: '/admin/login',
    // element: AdminLoginPage()
    lazy: () => import('@/pages/admin/login/AdminLoginPage')
  },
  {
    path: '/admin',
    // element: AdminPage(),
    lazy: () => import('@/pages/admin/AdminPage'),
    children: [
      {
        path: 'authority',
        // element: AdminAuthorityPage()
        lazy: () => import('@/pages/admin/authority/AdminAuthorityPage')
      },
      {
        path: 'events',
        // element: AdminAllEventsPage()
        lazy: () => import('@/pages/admin/event/dashboard/AdminAllEventsPage')
      },
      {
        path: 'events/create',
        // element: CreateEventPage()
        lazy: () => import('@/pages/admin/event/dashboard/CreateEventPage')
      },
      {
        path: 'events/:eventId',
        // element: AdminEventPage(),
        lazy: () => import('@/pages/admin/event/AdminEventPage'),
        children: [
          {
            index: true,
            // element: AdminEventInfoPage()
            lazy: () => import('@/pages/admin/event/info/AdminEventInfo')
          },
          {
            path: 'evaluations',
            // element: AdminEventeEvaluationsPage()
            lazy: () => import('@/pages/admin/event/evaluations/AdminEventEvaluations')
          },
          {
            path: 'discounts',
            // element: AdminEventDiscountsPage()
            lazy: () => import('@/pages/admin/event/discounts/AdminEventDiscounts')
          },
          {
            path: 'registrations',
            // element: AdminEventRegistrationsPage()
            lazy: () => import('@/pages/admin/event/registrations/AdminEventRegistrations')
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
    // element: UpdatePasswordPage()
    lazy: () => import('@/pages/admin/updatePassword/UpdatePasswordPage')
  },
  {
    path: '*',
    element: ErrorPage({})
  }
]);
