import { useState } from 'react';
import { Outlet as AdminPageRoute, useParams } from 'react-router-dom';
import AlertModal from '@/components/AlertModal';
import { Toaster } from '@/components/Toast/Toaster';
import { useActiveBreakpoints } from '@/hooks/useActiveBreakpoints';
import { useAdminLogout } from '@/hooks/useAdminLogout';
import { useCurrentAdminUser } from '@/hooks/useCurrentUser';
import { useMetaData } from '@/hooks/useMetaData';
import AdminSideBar from './sidebar/AdminSideBar';
import AdminSideBarTrigger from './sidebar/AdminSideBarTrigger';
import { getAdminRouteConfig } from './sidebar/getAdminRouteConfig';

const AdminPageContent = () => {
  const setMetaData = useMetaData();
  setMetaData({});

  const auth = useCurrentAdminUser();
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const { eventId } = useParams();
  const [md] = useActiveBreakpoints('md');

  const SIDEBAR_OFFSET = 25;
  const openSidebarWidth = 220 + SIDEBAR_OFFSET;
  const collapsedSidebarWidth = 120;

  const toggleSidebar = () => setSideBarOpen(!isSideBarOpen);

  const { isLogoutOpen, setLogoutOpen, isLoggingOut, onLogoutAdmin } = useAdminLogout();
  const onCloseLogoutModal = () => setLogoutOpen(false);

  const ADMIN_CONFIG = getAdminRouteConfig({
    isSuperAdmin: !!auth?.user?.isSuperAdmin,
    eventId: eventId,
    setLogoutOpen
  });

  return (
    <div className="flex w-full h-full flex-col md:flex-row">
      <AdminSideBar
        tablet={md}
        isSidebarOpen={isSideBarOpen}
        adminConfig={ADMIN_CONFIG}
        setSidebarOpen={setSideBarOpen}
        openSidebarWidth={openSidebarWidth}
        collapsedSidebarWidth={collapsedSidebarWidth}
      />

      <AlertModal
        alertModalTitle="Sign out"
        alertModalDescription="Are you sure you want to sign out?"
        visible={isLogoutOpen}
        confirmVariant="negative"
        isLoading={isLoggingOut}
        onOpenChange={setLogoutOpen}
        onCancelAction={onCloseLogoutModal}
        onCompleteAction={onLogoutAdmin}
      />

      <main className="h-full w-full relative z-10 overflow-hidden">
        <div
          className="h-full max-h-full overflow-y-auto overflow-x-hidden bg-background rounded-none md:rounded-l-3xl"
          style={{ paddingLeft: !md ? 0 : SIDEBAR_OFFSET }}
        >
          {md && <AdminSideBarTrigger isSidebarOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />}
          <div className="p-10 px-4 md:p-14">
            <AdminPageRoute />
          </div>
        </div>
      </main>
    </div>
  );
};

const AdminPage = () => {
  return (
    <>
      <AdminPageContent />
      <Toaster />
    </>
  );
};

export const Component = AdminPage;

export default AdminPage;
