import { Outlet } from 'react-router-dom';
import Register from './Register';

const RegisterPage = () => {
  return (
    <div>
      <Register />
      <Outlet />
    </div>
  );
};

export default RegisterPage;
