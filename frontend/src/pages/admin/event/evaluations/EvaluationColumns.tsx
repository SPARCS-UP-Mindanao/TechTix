import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import { Evaluation } from '@/model/evaluations';
import EvaluationInfoModal from './EvaluationInfoModal';
import { ColumnDef } from '@tanstack/react-table';

const showableHeaders: readonly string[] = ['registration', 'evaluationList'];
const getEnableHiding = (header: string) => showableHeaders.includes(header);

export const evaluationColumns: ColumnDef<Evaluation>[] = [
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
    header: 'First Name',
    enableHiding: getEnableHiding('firstName'),
    cell: ({ row }) => {
      const evaluation = row.original;
      return evaluation.registration.firstName;
    }
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Last Name
          <Icon name="ArrowDownUp" className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    enableHiding: getEnableHiding('lastName'),
    cell: ({ row }) => {
      const evaluation = row.original;
      return evaluation.registration.lastName;
    }
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
    enableHiding: getEnableHiding('email'),
    cell: ({ row }) => {
      const evaluation = row.original;
      return evaluation.registration.email;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const evaluation = row.original;
      const fullName = evaluation.registration.firstName + ' ' + evaluation.registration.lastName;
      return <EvaluationInfoModal fullName={fullName} evaluationList={evaluation.evaluationList} />;
    },
    enableHiding: getEnableHiding('actions')
  }
];
