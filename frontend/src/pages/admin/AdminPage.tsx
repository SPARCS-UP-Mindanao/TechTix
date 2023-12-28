import { useState } from 'react';
import { Outlet as AdminPageRoute, Navigate, useParams } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import AlertModal from '@/components/AlertModal';
import { useAdminLogout } from '@/hooks/useAdminLogout';
import { useLayout } from '@/hooks/useLayout';
import { useMetaData } from '@/hooks/useMetaData';
import AdminSideBar from './AdminSideBar';
import AdminSideBarTrigger from './AdminSideBarTrigger';
import { getAdminRouteConfig } from './getAdminRouteConfig';

const AdminPageContent = () => {
  useMetaData({});
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const [isCreateEventOpen, setCreateEventOpen] = useState(false);

  const layout = useLayout('md');

  const { eventId } = useParams();

  const SIDEBAR_OFFSET = 25;
  const openSidebarWidth = 220 + SIDEBAR_OFFSET;
  const collapsedSidebarWidth = 120;

  const toggleSidebar = () => setSideBarOpen(!isSideBarOpen);
  const toggleCreateEvent = () => setCreateEventOpen(!isCreateEventOpen);

  const { isLogoutOpen, setLogoutOpen, onLogoutAdmin } = useAdminLogout();
  const onCloseLogoutModal = () => setLogoutOpen(false);
  const ADMIN_CONFIG = getAdminRouteConfig({ eventId: eventId!, isCreateEventOpen, toggleCreateEvent, setLogoutOpen });

  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="flex w-full h-full flex-col md:flex-row">
      <AdminSideBar
        tablet={layout.md}
        isSidebarOpen={isSideBarOpen}
        isCreateEventOpen={isCreateEventOpen}
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
        onOpenChange={setLogoutOpen}
        onCancelAction={onCloseLogoutModal}
        onCompleteAction={onLogoutAdmin}
      />
      <main className="h-full w-full relative z-10 overflow-hidden">
        <div
          className="h-full max-h-full overflow-y-auto overflow-x-hidden bg-background rounded-none md:rounded-l-3xl"
          style={{ paddingLeft: !layout.md ? 0 : SIDEBAR_OFFSET }}
        >
          {layout.md && <AdminSideBarTrigger isSidebarOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />}
          <AdminPageRoute context={{ isCreateEventOpen, setCreateEventOpen, adminConfig: ADMIN_CONFIG }} />
        </div>
      </main>
    </div>
  );
};

const AdminPage = () => {
  return <AdminPageContent />;
};

export default AdminPage;
