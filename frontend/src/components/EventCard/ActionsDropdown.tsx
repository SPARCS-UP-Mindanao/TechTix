import Button from '../Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../DropdownMenu';
import Icon from '../Icon';

interface ActionsDropdownProps {
  setDeleteModalOpen: (open: boolean) => void;
}

const ActionsDropdown = ({ setDeleteModalOpen }: ActionsDropdownProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0 self-end bg-card border group-hover:opacity-100">
        <span className="sr-only">Open menu</span>
        <Icon name="MoreVertical" className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        id="delete-event"
        className="text-xs font-semibold text-negative"
        onClick={(e) => {
          e.stopPropagation();
          setDeleteModalOpen(true);
        }}
      >
        Delete event
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

export default ActionsDropdown;
