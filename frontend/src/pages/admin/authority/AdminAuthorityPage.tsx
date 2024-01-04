import { FC, useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import notFound from '@/assets/not-found.png';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { FormItem } from '@/components/Form';
import { FormLabel } from '@/components/Form';
import { FormError } from '@/components/Form';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';
import { getAllAdmins } from '@/api/admin';
import { CurrentUser } from '@/api/auth';
import { useApiQuery } from '@/hooks/useApi';
import { useAdminForm } from '@/hooks/useInviteAdminForm';
import { useMetaData } from '@/hooks/useMetaData';
import { adminColumns } from './AdminColumns';

interface AdminAuthorityContext {
  userGroups: CurrentUser['cognito:groups'];
}

interface InviteAdmintModalProps {
  refetch: () => void;
}
const CreateDiscountModal = ({ refetch }: InviteAdmintModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onSuccess = async () => {
    setIsModalOpen(false);
    await refetch();
  };

  const { form, submit } = useAdminForm(onSuccess);

  const handleSubmit = async () => {
    await submit();
  };

  return (
    <div className="px-4 py-2">
      <Modal
        modalTitle="Invite Admin"
        trigger={<Button variant={'primaryGradient'}>Invite Admin</Button>}
        modalFooter={
          <Button onClick={handleSubmit} type="submit" className="w-full" variant={'primaryGradient'}>
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
                  <Input type="email" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="firstName">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>First Name</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="lastName">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Last Name</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="position">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Position</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="address">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Address</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="contactNumber">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Contact Number</FormLabel>
                  <Input type="text" className="" {...field} />
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

  const navigate = useNavigate();
  useEffect(() => {
    const isSuperAdmin = userGroups && userGroups.includes('super_admin');
    if (!isSuperAdmin) {
      navigate('/admin/events');
    }
  }, [userGroups]);

  const { data: response, isFetching, refetch } = useApiQuery(getAllAdmins());

  if (isFetching) {
    const colCount = 6;
    const rowCount = 15;
    return (
      <div className="flex flex-col items-center gap-2 py-10 px-4">
        <h2>Admins</h2>
        <CreateDiscountModal refetch={refetch} />
        <Skeleton className="h-9 w-36 self-start" />
        <div className="rounded-md border w-full">
          {Array.from(Array(rowCount)).map((_, index) => (
            <div key={index} className="grid grid-cols-6 gap-3 w-full py-4 px-2">
              {Array.from(Array(colCount)).map((_, index) => (
                <Skeleton className="w-full h-5" key={index} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center py-10 px-4 h-full">
      <h2>Admins</h2>
      <CreateDiscountModal refetch={refetch} />
      {!response || (response && !response.data) ? (
        <div className="flex flex-col items-center justify-center w-full h-full gap-5">
          <img src={notFound} alt="Not Found" />
          <h2 className="text-center">No Admins found</h2>
        </div>
      ) : (
        <DataTable columns={adminColumns(refetch)} data={response.data} />
      )}
    </section>
  );
};

const AdminAuthorityPage = () => {
  return <AdminAuthority />;
};

export default AdminAuthorityPage;
