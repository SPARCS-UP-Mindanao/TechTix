import { FC, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getAllDiscounts } from '@/api/discounts';
import { Discount } from '@/model/discount';
import { useApiQuery } from '@/hooks/useApi';
import { useDiscountForm } from '@/hooks/useDiscountForm';
import { discountColumns } from './DiscountColumns';

interface CreateDiscountModalProps {
  eventId: string;
  refetch: () => void;
}
const CreateDiscountModal = ({ eventId, refetch }: CreateDiscountModalProps) => {
  const [discountResponse, setDiscountResponse] = useState<Discount[]>([]);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setFormResponse = (discounts: Discount[]) => {
    setDiscountResponse(discounts);
    setIsInfoModalOpen(true);
  };
  const { form, submit } = useDiscountForm(eventId, setFormResponse);

  const handleSubmit = async () => {
    await submit();
  };
  const handleClose = async () => {
    setIsInfoModalOpen(false);
    setIsModalOpen(false);
    await refetch();
  };

  return (
    <div className="px-4">
      <Modal
        modalTitle="Create Discount"
        trigger={<Button>Create Discount</Button>}
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

interface Props {
  eventId?: string;
}
const AdminEventDiscounts: FC<Props> = ({ eventId }) => {
  const { data: response, isFetching, refetch } = useApiQuery(getAllDiscounts(eventId!));

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
        <h1>No Discounts found</h1>
      </div>
    );
  }

  const eventDiscounts = response.data;

  return (
    <section className="flex flex-col gap-5 items-center py-10">
      <h1>Discounts</h1>
      <CreateDiscountModal eventId={eventId} refetch={refetch} />
      {eventDiscounts.map((discount) => {
        return (
          <div key={discount.organizationId} className="w-full">
            <h3>
              Recipient: <span>{discount.organizationId}</span>{' '}
            </h3>
            <DataTable columns={discountColumns} data={discount.discounts} />
          </div>
        );
      })}
    </section>
  );
};

export default AdminEventDiscounts;
