import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from '@/components/ErrorPage';
import EvaluatePage from '@/pages/client/evaluate/EvaluatePage';
import LoginPage from '@/pages/client/login/LoginPage';
import PreRegisterPage from '@/pages/client/preregister/PreRegisterPage';
import PyconClientPage from '@/pages/client/pycon/PyconClientPage';
import RegisterPage from '@/pages/client/pycon/register/RegisterPage';
import UserInfoPage from '@/pages/client/pycon/register/UserInfoPage';
import Callback from './Callback';
import ClientAuthRouteLayout from './layouts/client/ClientAuthRouteLayout';
import ClientRouteLayout from './layouts/client/ClientRouteLayout';
import ClientAuthContextProvider from '@/context/ClientAuthContext';

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
    {
      path: '/signin/callback',
      element: <Callback />
    },

    // Client User Routes
    {
      path: '',
      element: <ClientAuthContextProvider />,
      children: [
        {
          path: '',
          element: <ClientAuthRouteLayout />,
          children: [
            {
              path: '/login',
              element: <LoginPage />
            }
          ]
        },
        {
          path: '',
          element: <ClientRouteLayout />,
          children: [
            {
              path: '/:eventId',
              element: <PyconClientPage />,
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
                  path: 'register/userInfo',
                  element: <UserInfoPage />
                },
                {
                  path: 'registration/userInfo',
                  element: <UserInfoPage />
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
