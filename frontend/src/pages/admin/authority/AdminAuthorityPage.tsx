import { FC, useState } from 'react';
import { Navigate, useOutletContext } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { FormLabel, FormItem, FormError } from '@/components/Form';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getAllAdmins } from '@/api/admin';
import { CurrentUser } from '@/model/auth';
import { useApiQuery } from '@/hooks/useApi';
import { useAdminForm } from '@/hooks/useInviteAdminForm';
import { useMetaData } from '@/hooks/useMetaData';
import { adminColumns } from './AdminColumns';

interface AdminAuthorityContext {
  userGroups: CurrentUser['cognito:groups'];
}

interface InviteAdmintModalProps {
  disabled: boolean;
  refetch: () => void;
}

const InviteAdminModal = ({ disabled, refetch }: InviteAdmintModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  const { form, submit } = useAdminForm(onSuccess);

  const handleSubmit = async () => submit();

  return (
    <div className="px-4 py-2">
      <Modal
        modalTitle="Invite Admin"
        trigger={
          <Button disabled={disabled} variant="primaryGradient">
            Invite Admin
          </Button>
        }
        modalFooter={
          <Button onClick={handleSubmit} type="submit" className="w-full" variant="primaryGradient">
            Submit
          </Button>
        }
        visible={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        <FormProvider {...form}>
          <main className="w-full flex flex-col gap-2">
            <FormItem name="email">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="firstName">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="lastName">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="position">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Position</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="address">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Address</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="contactNumber">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Contact Number</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
          </main>
        </FormProvider>
      </Modal>
    </div>
  );
};

const AdminAuthority: FC = () => {
  useMetaData({});

  const { userGroups } = useOutletContext<AdminAuthorityContext>();

  if (userGroups && !userGroups.includes('super_admin')) {
    return <Navigate to="/admin/events" />;
  }

  const { data: response, isFetching, refetch } = useApiQuery(getAllAdmins());

  return (
    <section className="flex flex-col items-center py-10 px-4 h-full">
      <h2>Admins</h2>
      <InviteAdminModal refetch={refetch} disabled={isFetching} />
      <DataTable columns={adminColumns(refetch)} data={response?.data} loading={isFetching} noDataText="No Admins" />
    </section>
  );
};

const AdminAuthorityPage = () => {
  return <AdminAuthority />;
};

export default AdminAuthorityPage;
