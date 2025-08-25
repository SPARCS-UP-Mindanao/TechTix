import { Outlet as PyconClientPageRoute } from 'react-router-dom';
import { Toaster } from '@/components/Toast/Toaster';

const PyconClientPage = () => {
  return (
    <>
      <main className="h-max max-w-[1080px] mx-auto my-0 p-0 md:p-4 lg:px-8 py-8">
        <PyconClientPageRoute />
      </main>
      <Toaster />
    </>
  );
};

export const Component = PyconClientPage;

export default PyconClientPage;
