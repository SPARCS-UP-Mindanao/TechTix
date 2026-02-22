import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes/routes';

export const RouteProvider = () => {
  return <RouterProvider router={routes} />;
};
