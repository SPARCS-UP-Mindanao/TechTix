import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { getEvaluations } from '@/api/evaluations';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { evaluationColumns } from './EvaluationColumns';

const AdminEventeEvaluations: FC = () => {
  const { eventId } = useOutletContext<Event>();
  const { data: response, isFetching } = useApiQuery(getEvaluations(eventId!));

  if (!eventId) {
    return <h1>Event not found</h1>;
  }

  if (isFetching) {
    return (
      // TODO: Add skeleton page
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      // TODO: Add event not found page
      <div className="flex flex-col items-center">
        <h1>No evaluations found</h1>
      </div>
    );
  }

  const eventEvaluations = response.data;

  return (
    <section className="flex flex-col items-center py-10">
      <h1>Evaluations</h1>
      <DataTable columns={evaluationColumns} data={eventEvaluations} />
    </section>
  );
};

const AdminEventeEvaluationsPage = () => {
  return <AdminEventeEvaluations />;
};

export default AdminEventeEvaluationsPage;