import { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils/classes';

interface Props extends HTMLAttributes<HTMLElement> {
  open?: boolean;
  openSidebarWidth?: number;
  collapsedSidebarWidth?: number;
}

const CollapsibleSidebar: FC<Props> = ({ open = true, openSidebarWidth = 300, collapsedSidebarWidth = 100, className, children, ...props }) => {
  const width = open ? `${openSidebarWidth}px` : `${collapsedSidebarWidth}px`;
  return (
    <aside style={{ width }} className={cn('flex flex-col bg-primary-400 overflow-hidden transition-width duration-300 ease-out', className)} {...props}>
      {children}
    </aside>
  );
};

export default CollapsibleSidebar;
