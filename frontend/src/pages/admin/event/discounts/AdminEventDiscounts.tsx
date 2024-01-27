import { FC, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getAllDiscounts } from '@/api/discounts';
import { Discount, DiscountOrganization } from '@/model/discount';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import { useDiscountForm } from '@/hooks/useDiscountForm';
import { discountColumns } from './DiscountColumns';

interface CreateDiscountModalProps {
  eventId: string;
  disabled: boolean;
  refetch: () => void;
}
const CreateDiscountModal = ({ eventId, disabled, refetch }: CreateDiscountModalProps) => {
  const [discountResponse, setDiscountResponse] = useState<Discount[]>([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setFormResponse = (discounts: Discount[]) => {
    setDiscountResponse(discounts);
    setIsInfoModalOpen(true);
  };
  const { form, submit } = useDiscountForm(eventId, setFormResponse);

  const handleSubmit = async () => await submit();
  const handleClose = async () => {
    setIsInfoModalOpen(false);
    setIsModalOpen(false);
    await refetch();
  };

  return (
    <div className="px-4">
      <Modal
        modalTitle="Create Discount"
        trigger={<Button disabled={disabled}>Create Discount</Button>}
        modalFooter={
          isInfoModalOpen ? (
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          ) : (
            <Button onClick={handleSubmit} type="submit" className="w-full">
              Submit
            </Button>
          )
        }
        visible={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        {isInfoModalOpen ? (
          <div>
            <ul>
              {discountResponse.map((discount) => {
                return (
                  <li key={discount.entryId} className="w-full">
                    {discount.entryId}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <FormProvider {...form}>
            <main className="w-full">
              <FormItem name="organizationName">
                {({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Discount Recipient</FormLabel>
                    <Input type="text" className="" {...field} />
                    <FormError />
                  </div>
                )}
              </FormItem>
              <FormItem name="discountPercentage">
                {({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Discount Percentage</FormLabel>
                    <Input type="number" className="" {...field} />
                    <FormError />
                  </div>
                )}
              </FormItem>
              <FormItem name="quantity">
                {({ field }) => (
                  <div className="flex flex-col">
                    <FormLabel>Quantity</FormLabel>
                    <Input type="number" min="0" step="1" className="" {...field} />
                    <FormError />
                  </div>
                )}
              </FormItem>
            </main>
          </FormProvider>
        )}
      </Modal>
    </div>
  );
};

interface DiscountTablesProps {
  discounts?: DiscountOrganization[];
  isFetching: boolean;
}

const DiscountTables = ({ discounts, isFetching }: DiscountTablesProps) => {
  if (isFetching || !discounts) {
    return <DataTable columns={discountColumns} data={[]} loading={isFetching} noDataText="No discounts" />;
  }

  return (
    <>
      {discounts.map((discount) => (
        <div key={discount.organizationId} className="w-full">
          <h3>
            Recipient: <span>{discount.organizationId}</span>{' '}
          </h3>
          <DataTable columns={discountColumns} data={discount.discounts} />
        </div>
      ))}
    </>
  );
};

const AdminEventDiscounts: FC = () => {
  const { eventId } = useOutletContext<Event>();

  const { data: response, isFetching, refetch } = useApiQuery(getAllDiscounts(eventId!));

  if (!eventId) {
    return <h1>Event not found</h1>;
  }

  return (
    <section className="flex flex-col gap-5 items-center">
      <h1>Discounts</h1>
      <CreateDiscountModal disabled={isFetching} eventId={eventId} refetch={refetch} />
      <DiscountTables discounts={response?.data} isFetching={isFetching} />
    </section>
  );
};

const AdminEventDiscountsPage = () => {
  return <AdminEventDiscounts />;
};

export default AdminEventDiscountsPage;
