import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import notFound from '@/assets/not-found.png';
import { DataTable } from '@/components/DataTable';
import Skeleton from '@/components/Skeleton';
import TableSkeleton from '@/components/TableSkeleton';
import { getEvaluations } from '@/api/evaluations';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { evaluationColumns } from './EvaluationColumns';

const AdminEventeEvaluations: FC = () => {
  const { eventId } = useOutletContext<Event>();
  const { data: response, isFetching } = useApiQuery(getEvaluations(eventId!));

  return (
    <section className="flex flex-col items-center py-10 px-4">
      <h2>Evaluations</h2>
      <DataTable columns={evaluationColumns} data={response?.data} loading={isFetching} noDataText="No Evaluations" />
    </section>
  );
};

const AdminEventeEvaluationsPage = () => {
  return <AdminEventeEvaluations />;
};

export default AdminEventeEvaluationsPage;
