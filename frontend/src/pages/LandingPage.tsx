import { Outlet } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className='mx-8 mt-8 max-w-5xl'>
      <Outlet />;
    </div>
  )
};

export default LandingPage;
