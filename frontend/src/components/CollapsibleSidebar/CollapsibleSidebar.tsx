import { FC, HTMLAttributes } from 'react';
import { cn } from '@/utils/classes';

interface Props extends HTMLAttributes<HTMLElement> {
  open?: boolean;
  openSideBarWidth?: number;
  collapsedSideBarWidth?: number;
}

const CollapsibleSidebar: FC<Props> = ({ open = true, openSideBarWidth = 300, collapsedSideBarWidth = 100, className, children, ...props }) => {
  const width = open ? `${openSideBarWidth}px` : `${collapsedSideBarWidth}px`;
  return (
    <aside style={{ width }} className={cn('flex flex-col bg-primary-400 overflow-hidden transition-width duration-300 ease-out', className)} {...props}>
      {children}
    </aside>
  );
};

export default CollapsibleSidebar;
