import { Outlet } from 'react-router-dom';

const LandingPage = () => {
  return (
    <main className="clientPage">
      <Outlet />
    </main>
  );
};

export default LandingPage;
