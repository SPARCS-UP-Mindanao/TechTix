import moment from 'moment';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import { Discount } from '@/model/discount';
import { Registration } from '@/model/registrations';
import { formatPercentage } from '@/utils/functions';
import { ColumnDef } from '@tanstack/react-table';

const showableHeaders: readonly string[] = ['entryId', 'createDate', 'claimed', 'discountPercentage', 'registration', 'email'];
const getEnableHiding = (header: string) => showableHeaders.includes(header);

export const discountColumns: ColumnDef<Discount>[] = [
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
    accessorKey: 'entryId',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Discout Code
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('entryId')
  },
  {
    accessorKey: 'claimed',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Is Claimed?
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <Icon name={row.original.claimed ? 'Check' : 'X'} />,
    enableHiding: getEnableHiding('claimed')
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Date Registered
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('createDate'),
    cell: ({ row }) => moment(row.getValue('createDate')).format('MMM D h:mm A')
  },
  {
    accessorKey: 'discountPercentage',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Discount Percentage
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('discountPercentage'),
    cell: ({ row }) => {
      const discount: number = row.getValue('discountPercentage');
      return formatPercentage(discount);
    }
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email Claimer
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('email'),
    cell: ({ row }) => {
      const registration: Registration = row.getValue('registration');
      return registration && registration.email ? registration.email : 'N/A';
    }
  },
  {
    accessorKey: 'registration',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name of Claimer
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('registration'),
    cell: ({ row }) => {
      const registration: Registration = row.getValue('registration');
      return registration && registration.firstName && registration.lastName ? registration.firstName + ' ' + registration.lastName : 'N/A';
    }
  }
];
