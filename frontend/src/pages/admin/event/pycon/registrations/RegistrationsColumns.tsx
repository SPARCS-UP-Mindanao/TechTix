import moment from 'moment';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import { Registration } from '@/model/pycon/registrations';
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

export const getRegistrationColumns = (): ColumnDef<Registration>[] => {
  const RegistrationColumns: ColumnDef<Registration>[] = [
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
      accessorKey: 'jobTitle',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Title
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('jobTitle')
    },
    {
      accessorKey: 'ticketType',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Ticket Type
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('ticketType')
    },
    {
      accessorKey: 'discountCode',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Discount Code Used
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('ticketType'),
      cell: ({ row }) => row.original.discountCode || <span className="text-muted-foreground">None</span>
    },
    {
      accessorKey: 'dietaryRestrictions',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Dietary Restrictions
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('ticketType')
    },
    {
      accessorKey: 'accessibilityNeeds',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Accessibility needs
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('ticketType')
    },
    {
      accessorKey: 'sprintDay',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Will join sprint day?
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <Icon name={row.original.sprintDay ? 'Check' : 'X'} />,
      enableHiding: getEnableHiding('ticketType')
    },
    // {
    //   accessorKey: 'availTShirt',
    //   header: ({ column }) => {
    //     return (
    //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //         Will avail T-shrt?
    //         <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   enableHiding: getEnableHiding('ticketType')
    // },
    // {
    //   accessorKey: 'shirtType',
    //   header: ({ column }) => {
    //     return (
    //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //         Shirt type
    //         <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   enableHiding: getEnableHiding('ticketType')
    // },
    // {
    //   accessorKey: 'shirtSize',
    //   header: ({ column }) => {
    //     return (
    //       <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
    //         Shirt size
    //         <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    //   enableHiding: getEnableHiding('ticketType')
    // },
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
      cell: ({ row }) => {
        return moment(row.getValue('createDate')).local().format('MMM D h:mm A');
      }
    },
    {
      accessorKey: 'updateDate',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Date Updated
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return moment(row.getValue('createDate')).local().format('MMM D h:mm A');
      },
      enableHiding: getEnableHiding('linkedInLink')
    },
    {
      accessorKey: 'facebookLink',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Facebook link
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('facebookLink')
    },
    {
      accessorKey: 'linkedInLink',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Linkedin link
            <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableHiding: getEnableHiding('linkedInLink')
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

  return RegistrationColumns;
};
