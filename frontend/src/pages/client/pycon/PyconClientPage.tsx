import { Outlet as PyconClientPageRoute } from 'react-router-dom';
import { Toaster } from '@/components/Toast/Toaster';
import { usePyconStyles } from './hooks/usePyconStyles';
import { CLIENT_HEADER_HEIGHT } from '@/routes/layouts/client/ClientRouteLayout';

const PyconClientPage = () => {
  usePyconStyles();

  return (
    <>
      <main data-page="pycon" className="my-0 p-0 md:p-4 lg:px-8 py-8 flex flex-col" style={{ minHeight: `calc(100vh - ${CLIENT_HEADER_HEIGHT}px)` }}>
        <PyconClientPageRoute />
      </main>
      <Toaster />
    </>
  );
};

export const Component = PyconClientPage;

export default PyconClientPage;
