export interface AdminRouteConfigProps {
  optionName: string;
  iconName: string;
  route?: string;
  location: 'upper' | 'lower';
  selected?: boolean;
  visible?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface Props {
  eventId?: string;
  isCreateEventOpen: boolean;
  toggleCreateEvent: () => void;
  setLogoutOpen: (open: boolean) => void;
  isSuperAdmin: boolean | null;
}

export const getAdminRouteConfig = ({ eventId = '', isCreateEventOpen, toggleCreateEvent, setLogoutOpen, isSuperAdmin }: Props): AdminRouteConfigProps[] => {
  const adminConfig: AdminRouteConfigProps[] = [
    {
      optionName: 'Dashboard',
      iconName: 'House',
      route: '/admin/events',
      location: 'upper'
    },
    {
      optionName: 'Create event',
      iconName: 'Plus',
      visible: !eventId,
      onClick: toggleCreateEvent,
      selected: isCreateEventOpen,
      location: 'upper'
    },
    {
      optionName: 'Info',
      iconName: 'Info',
      visible: !!eventId,
      route: `/admin/events/${eventId}/`,
      location: 'upper'
    },
    {
      optionName: 'Registrations',
      iconName: 'User',
      visible: !!eventId,
      route: `/admin/events/${eventId}/registrations`,
      location: 'upper'
    },
    {
      optionName: 'Discounts',
      iconName: 'Tag',
      visible: !!eventId,
      route: `/admin/events/${eventId}/discounts`,
      location: 'upper'
    },
    {
      optionName: 'Evaluations',
      iconName: 'Clipboard',
      visible: !!eventId,
      route: `/admin/events/${eventId}/evaluations`,
      location: 'upper'
    }
  ];

  if (isSuperAdmin) {
    adminConfig.push({
      optionName: 'Admins',
      iconName: 'Users',
      route: `/admin/authority`,
      location: 'lower'
    });
  }

  adminConfig.push({
    optionName: 'Sign out',
    iconName: 'SignOut',
    location: 'lower',
    onClick: () => setLogoutOpen(true)
  });

  return adminConfig;
};
