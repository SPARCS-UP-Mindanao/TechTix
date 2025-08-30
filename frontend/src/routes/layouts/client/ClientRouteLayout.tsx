import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { LogOut } from 'lucide-react';
import Alert from '@/components/Alert';
import Avatar, { extractNameInitials } from '@/components/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/DropdownMenu';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const CLIENT_HEADER_HEIGHT = 50;

const ClientRouteLayout = () => {
  const auth = useCurrentUser();
  const loc = useLocation();
  const navigate = useNavigate();
  const to = encodeURIComponent(loc.pathname + loc.search + loc.hash);
  const [showAdminWarning, setShowAdminWarning] = useState(!!auth?.user?.isAdmin);

  const adminWarningRef = useRef<HTMLDivElement>(null);
  const onCloseAdminWarning = () => {
    adminWarningRef?.current?.remove();
    setShowAdminWarning(false);
  };

  useEffect(() => {
    if (auth?.user?.isAdmin) {
      setShowAdminWarning(true);
    }
  }, [auth?.user?.isAdmin]);

  if (!auth?.user) {
    return <Navigate replace to={{ pathname: '/login', search: `?to=${to}` }} />;
  }

  const { userName, picture } = auth.user;

  const onSignOut = () => {
    signOut();
    navigate({ pathname: '/login', search: `?to=${to}` });
    location.reload();
  };

  return (
    <>
      {showAdminWarning && (
        <Alert closable className="bg-accent/50 rounded-none sticky top-0" title="You are accessing a client page as an admin" onClose={onCloseAdminWarning} />
      )}

      <header
        style={{ height: CLIENT_HEADER_HEIGHT, boxShadow: '0px 8px 12px 0px hsla(0, 0%, 12%, 0.04)', top: showAdminWarning ? 50 : 0 }}
        className="sticky z-10 w-full py-2 px-8 md:px16 border-b bg-pycon-custard"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-8 ms-auto" fallback={extractNameInitials(userName ?? 'User')} src={picture} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userName ?? 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer" onClick={onSignOut}>
              Signout
              <LogOut className="text-pycon-red" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Outlet />
    </>
  );
};

export default ClientRouteLayout;
