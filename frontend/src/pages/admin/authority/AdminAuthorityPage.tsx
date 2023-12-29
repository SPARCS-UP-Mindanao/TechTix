import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { getEvaluations } from '@/api/evaluations';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { evaluationColumns } from '../event/evaluations/EvaluationColumns';

const AdminAuthority: FC = () => {
  const eventId = 'admin-authority';
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
      <div className="flex flex-col items-center">
        <h1>No evaluations found</h1>
      </div>
    );
  }

  const eventEvaluations = response.data;

  return (
    <section className="flex flex-col items-center py-10">
      <h1>Admins</h1>
      <DataTable columns={evaluationColumns} data={eventEvaluations} />
    </section>
  );
};

const AdminAuthorityPage = () => {
  return <AdminAuthority />;
};

export default AdminAuthorityPage;
