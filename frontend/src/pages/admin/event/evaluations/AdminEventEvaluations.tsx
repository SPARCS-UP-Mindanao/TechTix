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

  if (!eventId) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-5">
        <img src={notFound} alt="Not Found" />
        <h2 className="text-center">Event not found</h2>
      </div>
    );
  }

  if (isFetching) {
    const colCount = 6;
    const rowCount = 15;
    return (
      <div className="flex flex-col items-center gap-2 py-10 px-4">
        <h2>Evaluations</h2>
        <Skeleton className="h-9 w-36 self-start" />
        <TableSkeleton colCount={colCount} rowCount={rowCount} />
      </div>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full gap-5">
        <img src={notFound} alt="Not Found" />
        <h2 className="text-center">No Evaluations found</h2>
      </div>
    );
  }

  const eventEvaluations = response.data;

  return (
    <section className="flex flex-col items-center py-10 px-4">
      <h2>Evaluations</h2>
      <DataTable columns={evaluationColumns} data={eventEvaluations} />
    </section>
  );
};

const AdminEventeEvaluationsPage = () => {
  return <AdminEventeEvaluations />;
};

export default AdminEventeEvaluationsPage;
