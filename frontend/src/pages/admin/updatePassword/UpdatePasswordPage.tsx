import techTixLogo from '@/assets/logos/icon-192x192.png';
import UpdatePasswordForm from './UpdatePasswordForm';

const UpdatePasswordPage = () => {
  return (
    <main className="h-full max-w-[1080px] mx-auto my-0 p-8 pt-32">
      <div className="w-full flex justify-center">
        <section className="flex flex-col space-y-4 w-full max-w-2xl">
          <header className="flex justify-center">
            <img src={techTixLogo} className="w-24 md:w-32" />
          </header>
          <h4>Update Password</h4>
          <UpdatePasswordForm />
        </section>
      </div>
    </main>
  );
};

export default UpdatePasswordPage;
