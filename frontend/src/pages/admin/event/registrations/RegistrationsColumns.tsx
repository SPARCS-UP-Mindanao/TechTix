import { FC } from 'react';
import moment from 'moment';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import { PreRegistration } from '@/model/preregistrations';
import { RegisterMode, Registration, acceptanceStatusMap } from '@/model/registrations';
import RegistrationModal from './RegistrationModal';
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
  'discountCode',
  'acceptanceStatus'
];
const getEnableHiding = (header: string) => showableHeaders.includes(header);

export const getRegistrationColumns = (registrationType: RegisterMode): ColumnDef<Registration | PreRegistration>[] => {
  const RegistrationColumns: ColumnDef<Registration | PreRegistration>[] = [
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
      accessorKey: 'firstName',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            First name
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('firstName')
    },
    {
      accessorKey: 'lastName',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Last name
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
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
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('email')
    },
    {
      accessorKey: 'organization',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Organization
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('organization')
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
      id: 'actions',
      header: () => <span>Actions</span>,
      cell: ({ row }) => {
        const registrationInfo = row.original;
        return <RegistrationModal registrationInfo={registrationInfo} />;
      },
      enableHiding: getEnableHiding('actions')
    }
  ];

  interface AcceptanceStatusCellProps {
    preRegistration: PreRegistration;
  }
  const AcceptanceStatusCell: FC<AcceptanceStatusCellProps> = ({ preRegistration }) => {
    const getVariant = () => {
      switch (preRegistration.acceptanceStatus) {
        case 'ACCEPTED':
          return 'positive';
        case 'REJECTED':
          return 'negative';
        default:
          return 'outline';
      }
    };

    const displayName = acceptanceStatusMap[preRegistration.acceptanceStatus].displayName;

    return (
      <Badge variant={getVariant()} className="max-w-[100px]">
        {displayName}
      </Badge>
    );
  };

  const acceptanceStatus: ColumnDef<Registration | PreRegistration> = {
    id: 'acceptanceStatus',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Acceptance Status
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (row.original.type === 'preregistration' ? <AcceptanceStatusCell preRegistration={row.original} /> : null),
    enableHiding: getEnableHiding('acceptanceStatus')
  };

  if (registrationType === 'preregister') {
    const PreRegistrationColumns = [...RegistrationColumns];
    PreRegistrationColumns.splice(5, 0, acceptanceStatus);
    return PreRegistrationColumns;
  }

  return RegistrationColumns;
};
