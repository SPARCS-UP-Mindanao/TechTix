import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { getEvaluations } from '@/api/evaluations';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { evaluationColumns } from './EvaluationColumns';

const AdminEventEvaluations: FC = () => {
  const { eventId } = useOutletContext<Event>();
  const { data: response, isFetching } = useApiQuery(getEvaluations(eventId!));

  return (
    <section className="flex flex-col items-center">
      <h2>Evaluations</h2>
      <DataTable columns={evaluationColumns} data={response?.data} loading={isFetching} noDataText="No Evaluations" />
    </section>
  );
};

const AdminEventEvaluationsPage = () => {
  return <AdminEventEvaluations />;
};

export const Component = AdminEventEvaluationsPage;

export default AdminEventEvaluationsPage;
