import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { getEventRegistrations } from '@/api/registrations';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { registrationColumns } from './RegistrationsColumns';

const AdminEventRegistrations: FC = () => {
  const { eventId } = useOutletContext<Event>();
  const { data: response, isFetching } = useApiQuery(getEventRegistrations(eventId!));

  return (
    <section className="flex flex-col items-center">
      <h1>Registrations</h1>
      <DataTable columns={registrationColumns} data={response?.data} loading={isFetching} noDataText="No Registrations" />
    </section>
  );
};

const AdminEventRegistrationsPage = () => {
  return <AdminEventRegistrations />;
};

export default AdminEventRegistrationsPage;
