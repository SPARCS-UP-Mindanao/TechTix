import { useState } from 'react';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import Icon from '@/components/Icon';
import Modal from '@/components/Modal';
import { Evaluation, EvaluationListOut } from '@/model/evaluations';
import { questionToDisplayMap } from '@/pages/evaluate/questionsConfig';
import { ColumnDef } from '@tanstack/react-table';

const showableHeaders: readonly string[] = ['registration', 'evaluationList'];
const getEnableHiding = (header: string) => showableHeaders.includes(header);

const displayAnswers = (evaluation: Evaluation) => {
  const { questionType } = evaluation;
  switch (questionType) {
    case 'text':
      return <span>{evaluation.answer}</span>;
    case 'multiple_choice':
      return <span>{evaluation.answerScale}</span>;
    case 'boolean':
      return <span>{evaluation.booleanAnswer ? 'Yes' : 'No'}</span>;
  }
};

export const evaluationColumns: ColumnDef<EvaluationListOut>[] = [
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
    cell: ({ row }) => {
      const registrationInfo = row.original;
      const id = registrationInfo.registration.registrationId;
      return id && id.slice(-6);
    },
    enableHiding: getEnableHiding('registration.registrationId')
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    enableHiding: getEnableHiding('firstName'),
    cell: ({ row }) => {
      const registrationInfo = row.original;
      return registrationInfo.registration.firstName;
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
      const registrationInfo = row.original;
      return registrationInfo.registration.lastName;
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
      const registrationInfo = row.original;
      return registrationInfo.registration.email;
    }
  },
  {
    accessorKey: 'contactNumber',
    header: 'Contact Number',
    enableHiding: getEnableHiding('contactNumber'),
    cell: ({ row }) => {
      const registrationInfo = row.original;
      return registrationInfo.registration.contactNumber;
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const registrationInfo = row.original;
      const fullName = registrationInfo.registration.firstName + ' ' + registrationInfo.registration.lastName;
      const evaluations = registrationInfo.evaluationList;

      const [showModal, setShowModal] = useState(false);
      return (
        <Modal
          modalTitle={fullName + ' Evaluations'}
          visible={showModal}
          onOpenChange={setShowModal}
          trigger={<Button variant="ghost" size="icon" icon="MoreHorizontal" />}
        >
          <div className="flex flex-col gap-5">
            {evaluations.map((evaluation: Evaluation) => {
              const { question } = evaluation;
              return (
                <div key={question} className="flex flex-col w-full gap-1">
                  <p className="font-bold">{questionToDisplayMap.get(question!)}</p>
                  <p className="p-2 rounded-sm bg-input">{displayAnswers(evaluation)}</p>
                </div>
              );
            })}
          </div>
        </Modal>
      );
    },
    enableHiding: getEnableHiding('actions')
  }
];
