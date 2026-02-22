import { AuthProvider } from 'react-auth-kit';
import refreshApi from '@/utils/refreshToken';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  return (
    <AuthProvider
      authType="cookie"
      authName="_auth"
      cookieDomain={window.localStorage.hostname}
      cookieSecure={window.location.protocol === 'https:'}
      refresh={refreshApi}
    >
      {children}
    </AuthProvider>
  );
};

export default AuthContextProvider;
