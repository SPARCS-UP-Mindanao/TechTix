import { FC } from 'react';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import Tooltip from '@/components/Tooltip';
import { getEvaluations } from '@/api/evaluations';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useApiQuery } from '@/hooks/useApi';
import { evaluationColumns } from './EvaluationColumns';

const AdminEventEvaluations: FC = () => {
  const { eventId } = useAdminEvent();
  const { data: response, isFetching, refetch } = useApiQuery(getEvaluations(eventId!));

  return (
    <section className="flex flex-col items-center">
      <div className="inline-flex justify-center items-center space-x-4">
        <h2>Evaluations</h2>
        <Tooltip toolTipContent="Refresh evaluations" side="right">
          <Button variant="outline" loading={isFetching} size="icon" icon="RotateCw" onClick={() => refetch()} />
        </Tooltip>
      </div>
      <DataTable columns={evaluationColumns} data={response?.data} loading={isFetching} noDataText="No Evaluations" />
    </section>
  );
};

const AdminEventEvaluationsPage = () => {
  return <AdminEventEvaluations />;
};

export const Component = AdminEventEvaluationsPage;

export default AdminEventEvaluationsPage;
