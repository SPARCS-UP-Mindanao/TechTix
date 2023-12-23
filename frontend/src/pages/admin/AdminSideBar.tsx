import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/Button';
import CollapsibleSidebar from '@/components/CollapsibleSidebar/CollapsibleSidebar';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import { useLayout } from '@/hooks/useLayout';

// TODO: Create mapping for sidebar navigations

const SIDEBAR_ROUTE_MAP: Record<string, string> = {
  '/admin': 'Dashboard',
  '/info': 'Info',
  '/registrations': 'Registrations',
  '/discounts': 'Discounts',
  '/evaluations': 'Evaluations',
  '/authority': 'Admins'
};

const AdminSideBar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const handleClick = () => setOpen(!open);

  const layout = useLayout('md');
  const { eventId } = useParams();

  interface SideBarOptionProps {
    optionName: string;
    iconName?: string;
    disabled?: boolean;
    onClick?: () => void;
  }

  const SideBarOption = ({ optionName, iconName, disabled, onClick }: SideBarOptionProps) => {
    return (
      <li>
        <Button className="flex w-full justify-start text-primary-foreground" onClick={onClick} variant="ghost" disabled={disabled}>
          {iconName && <Icon name={iconName} />}
          {open && <p>{optionName}</p>}
        </Button>
      </li>
    );
  };

  if (!layout.md) {
    return (
      <Sheet onOpenChange={setOpen} trigger={<Button onClick={handleClick}>Menu</Button>}>
        <ul>
          <SideBarOption optionName="Dashboard" iconName="CaretLeft" />
          <SideBarOption optionName="Info" iconName="CaretLeft" />
          <SideBarOption optionName="Registrations" iconName="CaretLeft" />
          <SideBarOption optionName="Discounts" iconName="CaretLeft" />
          <SideBarOption optionName="Evaluations" iconName="CaretLeft" />
        </ul>

        <ul>
          <SideBarOption optionName="Settings" iconName="CaretLeft" />
          <SideBarOption optionName="Logout" iconName="CaretLeft" />
        </ul>
      </Sheet>
    );
  }

  return (
    <CollapsibleSidebar className="adminSideBar" open={open} openSideBarWidth={200} collapsedSideBarWidth={120}>
      <div className="flex flex-col justify-between h-full">
        <ul>
          <SideBarOption optionName="Dashboard" iconName="CaretLeft" />
          {eventId && (
            <>
              <SideBarOption optionName="Info" iconName="CaretLeft" />
              <SideBarOption optionName="Registrations" iconName="CaretLeft" />
              <SideBarOption optionName="Discounts" iconName="CaretLeft" />
              <SideBarOption optionName="Evaluations" iconName="CaretLeft" />
            </>
          )}
          <SideBarOption optionName="Test" iconName="CaretRight" onClick={handleClick} />
        </ul>

        <ul>
          <SideBarOption optionName="Settings" iconName="CaretLeft" />
          <SideBarOption optionName="Logout" iconName="CaretLeft" />
        </ul>
      </div>
    </CollapsibleSidebar>
  );
};

export default AdminSideBar;
