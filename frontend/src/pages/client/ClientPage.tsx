import { Outlet as ClientPageRoute } from 'react-router-dom';
import { Toaster } from '@/components/Toast/Toaster';

const ClientPage = () => {
  return (
    <>
      <main className="h-max max-w-[1080px] mx-auto my-0 p-0 md:p-4 lg:px-8 py-8">
        <ClientPageRoute />
      </main>
      <Toaster />
    </>
  );
};

export const Component = ClientPage;

export default ClientPage;
