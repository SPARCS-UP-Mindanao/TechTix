import { FC } from 'react';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import Tooltip from '@/components/Tooltip';
import { getEventRegistrations } from '@/api/pycon/registrations';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useApiQuery } from '@/hooks/useApi';
import { useGetCsv } from '@/hooks/useGetCsv';
import { getRegistrationColumns } from './RegistrationsColumns';

const AdminEventRegistrations: FC = () => {
  const {
    event: { isApprovalFlow, status, eventId }
  } = useAdminEvent();
  const { getCsv, isGettingCsv } = useGetCsv(eventId);

  const getDefaultValue = () => {
    if (isApprovalFlow && status === 'preregistration') {
      return 'preregistrations';
    }

    return 'registrations';
  };

  return (
    <section>
      <Tabs defaultValue={getDefaultValue()} className="flex flex-col items-center">
        <div className="self-start flex justify-between w-full items-center">
          <div>
            {isApprovalFlow && (
              <TabsList>
                <TabsTrigger value="registrations" disabled={status === 'preregistration'}>
                  Registrations
                </TabsTrigger>
              </TabsList>
            )}
          </div>
          <Button variant="positive" disabled={isGettingCsv} onClick={() => getCsv(getDefaultValue())}>
            Export CSV
          </Button>
        </div>
        <TabsContent value="registrations" className="w-full">
          <Registrations />
        </TabsContent>
      </Tabs>
    </section>
  );
};

const Registrations = () => {
  const {
    event: { eventId }
  } = useAdminEvent();
  const { data: response, isPending, refetch } = useApiQuery(getEventRegistrations(eventId));
  return (
    <>
      <div className="w-full inline-flex justify-center items-center space-x-4">
        <h2>Registrations</h2>
        <Tooltip toolTipContent="Refresh registrations" side="right">
          <Button variant="outline" loading={isPending} size="icon" icon="RotateCw" onClick={() => refetch()} />
        </Tooltip>
      </div>
      <DataTable columns={getRegistrationColumns()} data={response?.data} loading={isPending} noDataText="No Registrations" />
    </>
  );
};

const AdminEventRegistrationsPage = () => {
  return <AdminEventRegistrations />;
};

export const Component = AdminEventRegistrationsPage;

export default AdminEventRegistrationsPage;
