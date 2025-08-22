import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Avatar, { extractNameInitials } from '@/components/Avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/DropdownMenu';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const ClientRouteLayout = () => {
  const auth = useCurrentUser();
  const loc = useLocation();
  const to = encodeURIComponent(loc.pathname + loc.search + loc.hash);

  if (!auth?.user) {
    return <Navigate replace to={{ pathname: '/login', search: `?to=${to}` }} />;
  }

  const { userName, picture } = auth.user;

  return (
    <>
      <header className="py-2 px-8 md:px16">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-8 ms-auto" fallback={extractNameInitials(userName ?? 'User')} src={picture} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{userName ?? 'User'}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <Outlet />
    </>
  );
};

export default ClientRouteLayout;
