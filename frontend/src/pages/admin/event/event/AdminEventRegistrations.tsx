import { FC } from 'react';
import { DataTable } from '@/components/DataTable';
import { getEventRegistrations } from '@/api/registrations';
import { useApi } from '@/hooks/useApi';
import { registrationColumns } from './RegistrationsColumns';

interface Props {
  eventId?: string;
}

const AdminEventRegistrations: FC<Props> = ({ eventId }) => {
  // TODO: Implement table

  const { data: response, isFetching } = useApi(getEventRegistrations(eventId!));

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
        <h1>No registrations found</h1>
      </div>
    );
  }

  const eventRegistrations = response.data;

  return (
    <section className="flex flex-col items-center p-10">
      <h1>Registrations</h1>
      <DataTable columns={registrationColumns} data={eventRegistrations} />
    </section>
  );
};

export default AdminEventRegistrations;