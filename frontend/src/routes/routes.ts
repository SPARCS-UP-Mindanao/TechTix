import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';

export const routes = createBrowserRouter([
  {
    path: '',
    lazy: () => import('@/pages/landingPage/Auth')
  },
  {
    path: '/events',
    lazy: () => import('@/pages/landingPage/EventsPage')
  },
  {
    path: '/:eventId',
    lazy: () => import('@/pages/client/ClientPage'),
    children: [
      {
        path: 'preregister',
        lazy: () => import('@/pages/client/preregister/PreRegisterPage')
      },
      {
        path: 'register',
        lazy: () => import('@/pages/client/register/RegisterPage')
      },
      {
        path: 'registration',
        lazy: () => import('@/pages/client/register/RegisterPage')
      },
      {
        path: 'evaluate',
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
    lazy: () => import('@/pages/admin/login/AdminLoginPage')
  },
  {
    path: '/admin',
    lazy: () => import('@/pages/admin/AdminPage'),
    children: [
      {
        path: 'authority',
        lazy: () => import('@/pages/admin/authority/AdminAuthorityPage')
      },
      {
        path: 'events',
        lazy: () => import('@/pages/admin/event/dashboard/AdminAllEventsPage')
      },
      {
        path: 'events/create',
        lazy: () => import('@/pages/admin/event/dashboard/CreateEventPage')
      },
      {
        path: 'events/:eventId',
        lazy: () => import('@/pages/admin/event/AdminEventPage'),
        children: [
          {
            index: true,
            lazy: () => import('@/pages/admin/event/info/AdminEventInfo')
          },
          {
            path: 'evaluations',
            lazy: () => import('@/pages/admin/event/evaluations/AdminEventEvaluations')
          },
          {
            path: 'discounts',
            lazy: () => import('@/pages/admin/event/discounts/AdminEventDiscounts')
          },
          {
            path: 'registrations',
            lazy: () => import('@/pages/admin/event/registrations/AdminEventRegistrations')
          },
          {
            path: 'faqs',
            lazy: () => import('@/pages/admin/event/faqs/AdminEventFAQs')
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
    lazy: () => import('@/pages/admin/updatePassword/UpdatePasswordPage')
  },
  {
    path: '*',
    element: ErrorPage({})
  }
]);
