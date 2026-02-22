import { FC } from 'react';
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import { cn } from '@/utils/classes';

interface Props {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AdminSideBarTrigger: FC<Props> = ({ isSidebarOpen, toggleSidebar }) => {
  const SIDEBAR_TOOLTIP = {
    true: 'Collapse sidebar',
    false: 'Expand sidebar'
  };

  const toolTipContent = SIDEBAR_TOOLTIP[isSidebarOpen ? 'true' : 'false'];

  const BASE_CLASSNAME = 'h-3 w-1 rounded-full bg-neutrals-900 rotate-[0deg] transition-all duration-200';
  const UPPER_SHAPE_CLASSNAME = ['translate-y-[0.15rem] ', isSidebarOpen && 'group-hover:rotate-15', !isSidebarOpen && 'rotate-[-15deg]'];
  const LOWER_SHAPE_CLASSNAME = ['translate-y-[-0.15rem]', isSidebarOpen && ' group-hover:rotate-[-15deg]', !isSidebarOpen && 'rotate-15'];

  return (
    <div className="absolute left-0 top-1/3 z-40">
      <Tooltip side="right" toolTipContent={toolTipContent}>
        <Button className="h-8 w-8 p-0" variant="ghost" asChild>
          <div className="group flex h-[72px] w-8 items-center justify-center hover:opacity-75 hover:cursor-pointer" onClick={toggleSidebar}>
            <div className="flex h-6 w-6 flex-col items-center">
              <div className={cn(BASE_CLASSNAME, ...UPPER_SHAPE_CLASSNAME)} />
              <div className={cn(BASE_CLASSNAME, ...LOWER_SHAPE_CLASSNAME)} />
            </div>
          </div>
        </Button>
      </Tooltip>
    </div>
  );
};

export default AdminSideBarTrigger;
