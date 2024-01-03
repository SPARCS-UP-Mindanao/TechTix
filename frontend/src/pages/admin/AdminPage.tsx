import { useState, useEffect } from 'react';
import { useNavigate, Outlet as AdminPageRoute, useParams } from 'react-router-dom';
import { useIsAuthenticated } from 'react-auth-kit';
import AlertModal from '@/components/AlertModal';
import ErrorPage from '@/components/ErrorPage';
import { getCurrentUser } from '@/api/auth';
import { useAdminLogout } from '@/hooks/useAdminLogout';
import { useApiQuery } from '@/hooks/useApi';
import { useLayout } from '@/hooks/useLayout';
import { useMetaData } from '@/hooks/useMetaData';
import AdminSideBar from './AdminSideBar';
import AdminSideBarTrigger from './AdminSideBarTrigger';
import { getAdminRouteConfig } from './getAdminRouteConfig';
import { AdminRouteConfigProps } from './getAdminRouteConfig';

const AdminPageContent = () => {
  useMetaData({});
  const navigate = useNavigate();
  const { data: response, isFetching } = useApiQuery(getCurrentUser());
  const [isSideBarOpen, setSideBarOpen] = useState(true);
  const [isCreateEventOpen, setCreateEventOpen] = useState(false);
  const [adminConfig, setAdminConfig] = useState<AdminRouteConfigProps[]>([]);
  const [userGroups, setUserGroups] = useState<string[]>([]);
  const { eventId } = useParams();

  useEffect(() => {
    if (!response) {
      return;
    }

    const userGroupsRes = response.data['cognito:groups'];
    setUserGroups(userGroupsRes);

    const ADMIN_CONFIG = getAdminRouteConfig({
      userGroups: userGroupsRes,
      eventId: eventId!,
      isCreateEventOpen,
      toggleCreateEvent,
      setLogoutOpen
    });

    setAdminConfig(ADMIN_CONFIG);
  }, [response, eventId]);

  const { md } = useLayout('md');

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

  if (isFetching) {
    return <h1>Loading...</h1>;
  }

  if (!response || (response && !response.data && response.errorData)) {
    return <ErrorPage error={response} />;
  }

  return (
    <div className="flex w-full h-full flex-col md:flex-row">
      <AdminSideBar
        tablet={md}
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
          style={{ paddingLeft: !md ? 0 : SIDEBAR_OFFSET }}
        >
          {md && <AdminSideBarTrigger isSidebarOpen={isSideBarOpen} toggleSidebar={toggleSidebar} />}
          <AdminPageRoute context={{ isCreateEventOpen, setCreateEventOpen, adminConfig: adminConfig, userGroups }} />
        </div>
      </main>
    </div>
  );
};

const AdminPage = () => {
  return <AdminPageContent />;
};

export default AdminPage;
