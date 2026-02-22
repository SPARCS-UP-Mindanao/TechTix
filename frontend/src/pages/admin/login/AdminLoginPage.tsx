import { TECHTIX_72 } from '@/assets/techtix';
import { Toaster } from '@/components/Toast/Toaster';
import LoginForm from './LoginForm';

const AdminLoginPage = () => {
  return (
    <>
      <main className="h-full max-w-[1080px] mx-auto my-0 p-8 pt-32">
        <div className="w-full flex justify-center">
          <section className="flex flex-col space-y-4 w-full max-w-2xl">
            <header className="flex justify-center">
              <img src={TECHTIX_72} className="w-24 md:w-32" />
            </header>
            <h4>Admin login</h4>
            <LoginForm />
          </section>
        </div>
      </main>
      <Toaster />
    </>
  );
};

export const Component = AdminLoginPage;

export default AdminLoginPage;
