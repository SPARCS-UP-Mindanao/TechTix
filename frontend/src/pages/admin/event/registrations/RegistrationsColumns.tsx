import { useState } from 'react';
import moment from 'moment';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import FileViewerComponent from '@/components/FileViewerComponent';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import { RegisterUserInfo } from '@/model/registrations';
import { ColumnDef } from '@tanstack/react-table';

const showableHeaders: readonly string[] = [
  'registrationId',
  'firstName',
  'lastName',
  'email',
  'contactNumber',
  'careerStatus',
  'yearsOfExperience',
  'organization',
  'title',
  'createDate',
  'referenceNumber',
  'discountCode'
];
const getEnableHiding = (header: string) => showableHeaders.includes(header);

export const registrationColumns: ColumnDef<RegisterUserInfo>[] = [
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
    accessorKey: 'registrationId',
    header: 'ID',
    enableHiding: getEnableHiding('registrationId'),
    cell: ({ row }) => {
      const id: string = row.getValue('registrationId');
      return id.slice(-6);
    }
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
    accessorKey: 'contactNumber',
    header: 'Contact Number',
    enableHiding: getEnableHiding('contactNumber')
  },
  {
    accessorKey: 'careerStatus',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Career Status
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('careerStatus')
  },
  {
    accessorKey: 'yearsOfExperience',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Years of Experience
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('yearsOfExperience')
  },
  {
    accessorKey: 'organization',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Organization
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('organization')
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Title
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: 'datetime',
    enableHiding: getEnableHiding('title')
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date Registered
          <Icon name="ArrowsDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('createDate'),
    cell: ({ row }) => moment(row.getValue('createDate')).format('MMM D h:mm A')
  },
  {
    accessorKey: 'referenceNumber',
    header: 'Reference Number',
    enableHiding: getEnableHiding('referenceNumber')
  },
  {
    accessorKey: 'discountCode',
    header: 'Discount Code',
    enableHiding: getEnableHiding('discountCode')
  },
  {
    accessorKey: 'amountPaid',
    header: () => <div className="text-right">Amount Paid</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amountPaid'));
      const formatted = amount
        ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
            currencyDisplay: 'code'
          })
            .format(amount)
            .replace('PHP', '')
            .trim()
        : '0.00';
      return <div className="text-right font-medium">{formatted}</div>;
    },
    enableHiding: getEnableHiding('amountPaid')
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const registrationInfo = row.original;
      const [showModal, setShowModal] = useState(false);
      return (
        <Modal
          modalTitle="User Info"
          visible={showModal}
          onOpenChange={setShowModal}
          trigger={<Button variant="ghost" size="icon" icon="DotsThree" />}
          modalFooter={
            <>
              <Button onClick={() => setShowModal(false)} variant="outline" type="submit" className="w-full">
                Cancel
              </Button>
              <Button onClick={() => console.log('delete')} variant="negative" type="submit" className="w-full">
                Delete
              </Button>
            </>
          }
        >
          <h4>{registrationInfo.registrationId}</h4>
          {registrationInfo.gcashPayment && <FileViewerComponent objectKey={registrationInfo.gcashPayment} />}
        </Modal>
      );
    },
    enableHiding: getEnableHiding('actions')
  }
];
