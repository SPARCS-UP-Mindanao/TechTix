import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import Tooltip from '@/components/Tooltip';
import { getEventPreRegistrations } from '@/api/preregistrations';
import { getEventRegistrations } from '@/api/registrations';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { getRegistrationColumns } from './RegistrationsColumns';

const AdminEventRegistrations: FC = () => {
  const { isApprovalFlow, status } = useOutletContext<Event>();

  const getDefaultValue = () => {
    if (isApprovalFlow && status === 'preregistration') {
      return 'preregistrations';
    }

    return 'registrations';
  };

  return (
    <section>
      <Tabs defaultValue={getDefaultValue()} className="flex flex-col items-center">
        {isApprovalFlow && (
          <TabsList className="self-start">
            <TabsTrigger value="preregistrations">Pre-registrations</TabsTrigger>
            <TabsTrigger value="registrations" disabled={status === 'preregistration'}>
              Registrations
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="preregistrations" className="w-full">
          <PreRegistrations />
        </TabsContent>
        <TabsContent value="registrations" className="w-full">
          <Registrations />
        </TabsContent>
      </Tabs>
    </section>
  );
};

const Registrations = () => {
  const { eventId } = useOutletContext<Event>();
  const { data: response, isFetching, refetch } = useApiQuery(getEventRegistrations(eventId));
  return (
    <>
      <div className="w-full inline-flex justify-center items-center space-x-4">
        <h2>Registrations</h2>
        <Tooltip toolTipContent="Refresh registrations" side="right">
          <Button variant="outline" loading={isFetching} size="icon" icon="RotateCw" onClick={() => refetch()} />
        </Tooltip>
      </div>
      <DataTable columns={getRegistrationColumns('register')} data={response?.data} loading={isFetching} noDataText="No Registrations" />
    </>
  );
};

const PreRegistrations = () => {
  const { eventId } = useOutletContext<Event>();
  const { data: response, isFetching, refetch } = useApiQuery(getEventPreRegistrations(eventId));
  return (
    <>
      <div className="w-full inline-flex justify-center items-center space-x-4">
        <h2>Pre-registrations</h2>
        <Tooltip toolTipContent="Refresh pre-registrations" side="right">
          <Button variant="outline" loading={isFetching} size="icon" icon="RotateCw" onClick={() => refetch()} />
        </Tooltip>
      </div>
      <DataTable columns={getRegistrationColumns('preregister')} data={response?.data} loading={isFetching} noDataText="No Pre-registrations" />
    </>
  );
};

const AdminEventRegistrationsPage = () => {
  return <AdminEventRegistrations />;
};

export const Component = AdminEventRegistrationsPage;

export default AdminEventRegistrationsPage;
