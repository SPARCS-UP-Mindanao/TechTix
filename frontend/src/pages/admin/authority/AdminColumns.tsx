import { useState } from 'react';
import moment from 'moment';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import { Admin } from '@/model/admin';
import { useDeleteAdmin } from '@/hooks/useDeleteAdmin';
import { ColumnDef } from '@tanstack/react-table';

const showableHeaders: readonly string[] = [
  'email',
  'firstName',
  'lastName',
  'position',
  'address',
  'contactNumber',
  'entryId',
  'createDate',
  'updateDate',
  'createdBy',
  'isConfirmed'
];
const getEnableHiding = (header: string) => showableHeaders.includes(header);

export const adminColumns: (refetch: () => void) => ColumnDef<Admin>[] = (refetch: () => void) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: getEnableHiding('select')
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('email')
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    enableHiding: getEnableHiding('firstName')
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Last Name
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('lastName')
  },
  {
    accessorKey: 'position',
    header: 'Position',
    enableHiding: getEnableHiding('position')
  },
  {
    accessorKey: 'address',
    header: 'Address',
    enableHiding: getEnableHiding('address')
  },
  {
    accessorKey: 'contactNumber',
    header: 'Contact Number',
    enableHiding: getEnableHiding('contactNumber')
  },
  {
    accessorKey: 'entryId',
    header: 'Entry ID',
    enableHiding: getEnableHiding('entryId')
  },
  {
    accessorKey: 'createDate',
    header: 'Create Date',
    enableHiding: getEnableHiding('createDate'),
    cell: ({ row }) => {
      const admin = row.original;
      const createDate = admin.createDate;
      return moment(createDate).format('YYYY-MM-DD');
    }
  },
  {
    accessorKey: 'updateDate',
    header: 'Update Date',
    enableHiding: getEnableHiding('updateDate'),
    cell: ({ row }) => {
      const admin = row.original;
      const updateDate = admin.updateDate;
      return moment(updateDate).format('YYYY-MM-DD');
    }
  },
  {
    accessorKey: 'createdBy',
    header: 'Invited By',
    enableHiding: getEnableHiding('createdBy')
  },
  {
    accessorKey: 'isConfirmed',
    header: 'Is Confirmed',
    enableHiding: getEnableHiding('isConfirmed')
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const adminInfo = row.original;
      const [showModal, setShowModal] = useState(false);
      const { onDeleteAdmin, isDeletingAdmin } = useDeleteAdmin(adminInfo.entryId!);

      const deleteAdmin = async () => {
        await onDeleteAdmin();
        refetch();
      };

      return (
        <div className="flex items-center justify-center">
          <AlertModal
            trigger={
              <Button role="button" loading={isDeletingAdmin} variant="negative" className="">
                Delete
              </Button>
            }
            alertModalTitle="Delete Admin"
            alertModalDescription="Are you sure you want to delete this admin?"
            visible={showModal}
            confirmText="Delete"
            confirmVariant="negative"
            onOpenChange={setShowModal}
            onCompleteAction={deleteAdmin}
            onCancelAction={() => setShowModal(false)}
          />
        </div>
      );
    },
    enableHiding: getEnableHiding('actions')
  }
];
