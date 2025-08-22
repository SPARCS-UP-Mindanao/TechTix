import { FC, useState } from 'react';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropdownMenu';
import Icon from '@/components/Icon';
import { Admin } from '@/model/admin';
import { useDeleteAdmin } from '@/hooks/useDeleteAdmin';

interface DropdownMenuItemProps {
  setIsModalOpen: (value: boolean) => void;
}

const DeleteAdminModalTrigger: FC<DropdownMenuItemProps> = ({ setIsModalOpen }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0 self-end bg-bg">
        <span className="sr-only">Open menu</span>
        <Icon name="EllipsisVertical" className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        className="text-xs font-semibold text-negative"
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
      >
        Delete Admin
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

interface Props {
  adminInfo: Admin;
  refetch: () => void;
}

const DeleteAdminModal: FC<Props> = ({ adminInfo, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const { onDeleteAdmin, isDeletingAdmin } = useDeleteAdmin(adminInfo.entryId!);

  const deleteAdmin = async () => {
    await onDeleteAdmin();
    refetch();
  };

  return (
    <>
      <DeleteAdminModalTrigger setIsModalOpen={setShowModal} />
      <AlertModal
        alertModalTitle="Delete Admin"
        alertModalDescription="Are you sure you want to delete this admin?"
        visible={showModal}
        confirmText="Delete"
        confirmVariant="negative"
        isLoading={isDeletingAdmin}
        onOpenChange={setShowModal}
        onCompleteAction={deleteAdmin}
        onCancelAction={() => setShowModal(false)}
      />
    </>
  );
};

export default DeleteAdminModal;
