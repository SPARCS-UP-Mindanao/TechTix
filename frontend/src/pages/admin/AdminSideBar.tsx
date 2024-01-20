import { FC, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logoTitleBorder from '@/assets/logos/techtix-border-logo-title.png';
import { TECHTIX_72, TECHTIX_WORD_72 } from '@/assets/techtix';
import Button from '@/components/Button';
import CollapsibleSidebar from '@/components/CollapsibleSidebar/CollapsibleSidebar';
import Icon from '@/components/Icon';
import Sheet from '@/components/Sheet';
import { cn } from '@/utils/classes';
import { AdminRouteConfigProps } from './getAdminRouteConfig';

interface AdminSideBarProps {
  tablet: boolean;
  adminConfig: AdminRouteConfigProps[];
  isSidebarOpen: boolean;
  isCreateEventOpen: boolean;
  openSidebarWidth: number;
  collapsedSidebarWidth: number;
  setSidebarOpen: (value: boolean) => void;
}

const AdminSideBar: FC<AdminSideBarProps> = ({
  tablet,
  isSidebarOpen,
  adminConfig: SIDEBAR_ROUTE_MAP,
  openSidebarWidth,
  collapsedSidebarWidth,
  setSidebarOpen
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  const SideBarOption = ({ optionName, iconName, route, onClick, selected = false, disabled = false, visible = true }: AdminRouteConfigProps) => {
    if (!visible) {
      return null;
    }

    const onOptionSelect = () => {
      if (route) {
        navigate(route);
        !tablet && toggleMobileSidebar();
      } else if (onClick) {
        onClick();
        !tablet && toggleMobileSidebar();
      }
    };

    const currentRouteSelected = pathname === route;

    return (
      <li>
        <Button
          className={cn(
            'flex w-full justify-start text-primary-700 md:text-primary-foreground border-none hover:bg-primary-700 hover:text-primary-foreground md:hover:bg-primary-foreground md:hover:text-primary-700 ',
            (currentRouteSelected || selected) && 'text-primary-foreground bg-primary-700 md:text-primary-700 md:bg-primary-foreground pointer-events-none',
            !isSidebarOpen && 'justify-center'
          )}
          onClick={onOptionSelect}
          variant="ghost"
          disabled={disabled}
        >
          {iconName && <Icon name={iconName} className={cn('flex-shrink-0', isSidebarOpen && 'mr-3')} />}
          <p className={cn(!isSidebarOpen && 'hidden')}>{optionName}</p>
        </Button>
      </li>
    );
  };

  const upperOptions = SIDEBAR_ROUTE_MAP.filter((option) => option.location === 'upper').map((option) => <SideBarOption key={option.optionName} {...option} />);
  const lowerOptions = SIDEBAR_ROUTE_MAP.filter((option) => option.location === 'lower').map((option) => <SideBarOption key={option.optionName} {...option} />);

  if (!tablet) {
    const handleMobileClick = () => {
      setSidebarOpen(true);
      setMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const MobileSidebar = (
      <Sheet className="bg-background pt-12" closeIconClassName="text-primary-700" visible={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <div className="h-full flex flex-col justify-between">
          <ul className="space-y-4">{upperOptions}</ul>
          <ul className="space-y-4">{lowerOptions}</ul>
        </div>
      </Sheet>
    );

    return (
      <nav className="flex flex-shrink-0 justify-center items-center p-2 bg-primary-700">
        <Button
          variant="ghost"
          className="text-primary-foreground absolute left-2"
          size="icon"
          icon="List"
          onClick={handleMobileClick}
          iconClassname="w-6 h-6"
        />
        {MobileSidebar}
        <span className="flex items-center justify-center space-x-2">
          <img src={logoTitleBorder} alt="Techtix Logo" className="h-12" />
        </span>
      </nav>
    );
  }

  return (
    <CollapsibleSidebar
      className="max-h-screen h-full left-0 p-4 bg-primary-700 flex-shrink-0 relative z-0 mr-[-25px]"
      open={isSidebarOpen}
      openSidebarWidth={openSidebarWidth}
      collapsedSidebarWidth={collapsedSidebarWidth}
    >
      <div className="h-full flex flex-col w-[80%] justify-between">
        <ul className="space-y-4">
          <span className="flex items-center justify-center space-x-1">
            <img src={TECHTIX_72} className="w-[50px]" alt="TechTix Logo" />
            <img src={TECHTIX_WORD_72} alt="" className={cn('w-24', !isSidebarOpen && 'hidden')} />
          </span>
          {upperOptions}
        </ul>
        <ul className="space-y-4">{lowerOptions}</ul>
      </div>
    </CollapsibleSidebar>
  );
};

export default AdminSideBar;
