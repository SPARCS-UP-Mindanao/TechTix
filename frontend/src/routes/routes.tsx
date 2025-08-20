import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import ClientPage from '@/pages/client/ClientPage';
import EvaluatePage from '@/pages/client/evaluate/EvaluatePage';
import PreRegisterPage from '@/pages/client/preregister/PreRegisterPage';
import RegisterPage from '@/pages/client/register/RegisterPage';
import ClientAuthRouteLayout from './layouts/client/ClientAuthRouteLayout';
import ClientRouteLayout from './layouts/client/ClientRouteLayout';
import AuthContextProvider from '@/context/AuthContext';

export const routes = createBrowserRouter(
  [
    // {
    //   path: '',
    //   lazy: () => import('@/pages/landingPage/HomePage')
    // },
    // {
    //   path: '/events',
    //   lazy: () => import('@/pages/landingPage/EventsPage')
    // },

    // Client User Routes
    {
      path: '',
      element: <AuthContextProvider />,
      children: [
        {
          path: '',
          element: <ClientAuthRouteLayout />,
          children: [
            {
              path: '/login',
              element: '' // TODO: Create login page for client
            }
          ]
        },
        {
          path: '',
          element: <ClientRouteLayout />,
          children: [
            {
              path: '/:eventId',
              element: <ClientPage />,
              children: [
                {
                  path: 'preregister',
                  element: <PreRegisterPage />
                },
                {
                  path: 'register',
                  element: <RegisterPage />
                },
                {
                  path: 'registration',
                  element: <RegisterPage />
                },
                {
                  path: 'evaluate',
                  element: <EvaluatePage />
                },
                {
                  path: '',
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
  ],
  {
    async patchRoutesOnNavigation({ path, patch }) {
      // lazy load admin routes
      if (path.startsWith('/admin')) {
        const children = (await import('@/routes/adminRoutes')).default;
        patch(null, children);
      }
    }
  }
);
