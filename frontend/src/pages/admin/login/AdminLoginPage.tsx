import techTixLogo from '@/assets/logos/icon-192x192.png';
import LoginForm from './LoginForm';

const AdminLoginPage = () => {
  return (
    <main className="loginPage">
      <div className="w-full flex justify-center">
        <section className="flex flex-col space-y-4 w-full max-w-2xl">
          <header className="flex justify-center">
            <img src={techTixLogo} className="w-24 md:w-32" />
          </header>
          <h4>Admin login</h4>
          <LoginForm />
        </section>
      </div>
    </main>
  );
};

export default AdminLoginPage;
