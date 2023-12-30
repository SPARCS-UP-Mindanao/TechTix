import { useState, useEffect } from 'react';
import { useNavigate, Outlet as AdminPageRoute, useParams } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import { setCookie } from 'typescript-cookie';
import AlertModal from '@/components/AlertModal';
import { getCurrentUser } from '@/api/auth';
import { useAdminLogout } from '@/hooks/useAdminLogout';
import { useLayout } from '@/hooks/useLayout';
import { useMetaData } from '@/hooks/useMetaData';
import AdminSideBar from './AdminSideBar';
import AdminSideBarTrigger from './AdminSideBarTrigger';
import { getAdminRouteConfig } from './getAdminRouteConfig';
import { AdminRouteConfigProps } from './getAdminRouteConfig';

const AdminPageContent = () => {
  useMetaData({});
  const navigate = useNavigate();
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const [isCreateEventOpen, setCreateEventOpen] = useState(false);
  const [adminConfig, setAdminConfig] = useState<AdminRouteConfigProps[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);

  const layout = useLayout('md');

  const { eventId } = useParams();

  const SIDEBAR_OFFSET = 25;
  const openSidebarWidth = 220 + SIDEBAR_OFFSET;
  const collapsedSidebarWidth = 120;

  const toggleSidebar = () => setSideBarOpen(!isSideBarOpen);
  const toggleCreateEvent = () => setCreateEventOpen(!isCreateEventOpen);

  const { isLogoutOpen, setLogoutOpen, onLogoutAdmin } = useAdminLogout();
  const onCloseLogoutModal = () => setLogoutOpen(false);

  const isAuthenticated = useIsAuthenticated();
  if (!isAuthenticated()) {
    navigate('/admin/login');
    return;
  }

  const updateAdminConfig = async () => {
    if (isSuperAdmin == null) {
      const { queryFn: getCurrent } = getCurrentUser();
      const response = await getCurrent();
      if (response.status == 200) {
        const { data: currentUser } = response;
        const group = currentUser['cognito:groups'];
        if (group && group.length > 0) {
          const isSuperAdminVal = group.includes('super_admin');
          setIsSuperAdmin(isSuperAdminVal);
          setCookie('_is_super_admin', isSuperAdminVal);
        }
      }
    }
  };

  useEffect(() => {
    updateAdminConfig();
  }, []);

  useEffect(() => {
    setAdminConfig(getAdminRouteConfig({ eventId: eventId!, isCreateEventOpen, toggleCreateEvent, setLogoutOpen, isSuperAdmin }));
  }, [eventId, isCreateEventOpen, isSuperAdmin]);

  return (
    <div className="flex w-full h-full flex-col md:flex-row">
      <AdminSideBar
        tablet={layout.md}
        isSidebarOpen={isSideBarOpen}
        isCreateEventOpen={isCreateEventOpen}
        adminConfig={adminConfig}
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
          <AdminPageRoute context={{ isCreateEventOpen, setCreateEventOpen, adminConfig: adminConfig }} />
        </div>
      </main>
    </div>
  );
};

const AdminPage = () => {
  return <AdminPageContent />;
};

export default AdminPage;
