import { FC, useState } from 'react';
import { FormProvider, useFormContext } from 'react-hook-form';
import Button from '@/components/Button';
import { DataTable } from '@/components/DataTable';
import { FormItem, FormLabel, FormError, FormDescription } from '@/components/Form';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import Switch from '@/components/Switch';
import Tooltip from '@/components/Tooltip';
import { getAllDiscounts } from '@/api/discounts';
import { Discount, OrganizationDiscount, enabledDiscountStatus } from '@/model/discount';
import { Event, EventStatus } from '@/model/events';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useApiQuery } from '@/hooks/useApi';
import { DiscountFormValues, useDiscountForm } from '@/hooks/useDiscountForm';
import { discountColumns } from './DiscountColumns';

const CreateDiscountFormItems = () => {
  const { watch } = useFormContext<DiscountFormValues>();
  const isReusable = watch('isReusable');

  return (
    <>
      <FormItem name="organizationName">
        {({ field }) => (
          <div className="flex flex-col space-y-2">
            <FormLabel>Organization name</FormLabel>
            <Input type="text" {...field} />
            <FormDescription>Enter the organization you want to give discounts to</FormDescription>
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="discountPercentage">
        {({ field }) => (
          <div className="flex flex-col space-y-2">
            <FormLabel>Discount Percentage (%)</FormLabel>
            <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="quantity">
        {({ field }) => (
          <div className="flex flex-col space-y-2">
            <FormLabel>Quantity</FormLabel>
            <Input type="number" min="1" step="1" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} disabled={isReusable} />
            <FormDescription>Enter the number of discounts you want to give</FormDescription>
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="isReusable">
        {({ field }) => (
          <div className="flex space-y-6">
            <div className="flex gap-10 items-center">
              <FormLabel>Is reusable</FormLabel>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </div>
            <FormError />
          </div>
        )}
      </FormItem>

      {isReusable && (
        <div className="flex flex-col">
          <FormItem name="discountName">
            {({ field }) => (
              <div className="flex flex-col space-y-2">
                <FormLabel>Discount code</FormLabel>
                <Input type="text" {...field} />
                <FormDescription>Enter the codename for this reusable discount</FormDescription>
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="maxDiscountUses">
            {({ field }) => (
              <div className="flex flex-col space-y-2">
                <FormLabel>Maximum Uses</FormLabel>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value) || 0)} />
                <FormDescription>Maximum number of times this discount can be used</FormDescription>
                <FormError />
              </div>
            )}
          </FormItem>
        </div>
      )}
    </>
  );
};

interface DiscountCodeListProps {
  discountCodes: string[];
}

const copyDiscountCodes = (discountCodes: string[]) => navigator.clipboard.writeText(discountCodes.join('\n'));

const DiscountCodeList = ({ discountCodes }: DiscountCodeListProps) => {
  return (
    <div>
      <ul>
        {discountCodes.map((code) => {
          return (
            <li key={code} className="w-full">
              {code}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface CreateDiscountModalProps {
  eventId: string;
  disabled: boolean;
  refetch: () => void;
}
const CreateDiscountModal = ({ eventId, disabled, refetch }: CreateDiscountModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopyClicked, setIsCopyClicked] = useState(false);
  const { form, submit, discountCodes, showDiscountCodes, setShowDiscountCodes } = useDiscountForm(eventId);

  const handleSubmit = async () => await submit();
  const handleClose = () => {
    setIsModalOpen(false);
    setShowDiscountCodes(false);
    setIsCopyClicked(false);
    form.reset();
    refetch();
  };

  const successButton = () => {
    if (showDiscountCodes) {
      const onClick = () => {
        setIsCopyClicked(true);
        copyDiscountCodes(discountCodes);
      };
      return (
        <Button onClick={onClick} type="submit" icon={isCopyClicked ? 'Check' : 'Copy'}>
          {isCopyClicked ? 'Copied to clipboard' : ' Copy discount codes'}
        </Button>
      );
    }

    return (
      <Button loading={form.formState.isSubmitting} onClick={handleSubmit} type="submit">
        Create
      </Button>
    );
  };

  const footer = (
    <div className="flex space-x-2">
      <Button variant="ghost" onClick={handleClose} disabled={form.formState.isSubmitting}>
        {showDiscountCodes ? 'Close' : 'Cancel'}
      </Button>
      {successButton()}
    </div>
  );

  return (
    <div className="px-4">
      <Modal
        modalTitle="Create Discount"
        trigger={<Button disabled={disabled}>Create Discount</Button>}
        modalFooter={footer}
        showCloseButton={!form.formState.isSubmitting && !showDiscountCodes}
        visible={isModalOpen}
        onOpenChange={setIsModalOpen}
      >
        {showDiscountCodes ? (
          <DiscountCodeList discountCodes={discountCodes} />
        ) : (
          <FormProvider {...form}>
            <main className="w-full">
              <CreateDiscountFormItems />
            </main>
          </FormProvider>
        )}
      </Modal>
    </div>
  );
};

interface DiscountHeaderProps {
  organization: OrganizationDiscount;
}

const DiscountHeader: FC<DiscountHeaderProps> = ({ organization }) => {
  return (
    <div className="inline-flex justify-center items-center">
      <h3>{`Organization: ${organization.organizationId}`}</h3>
      <Tooltip toolTipContent="Copy discount codes" side="right">
        <Button size="icon" icon="Copy" variant="ghost" className="ml-4" onClick={() => copyDiscountCodes(organization.discounts.map((x) => x.entryId))} />
      </Tooltip>
    </div>
  );
};

interface DiscountTablesProps {
  organizations: OrganizationDiscount[];
  status: EventStatus;
  isPaidEvent: boolean;
  isPending: boolean;
}

const DiscountTables = ({ organizations, status, isPaidEvent, isPending }: DiscountTablesProps) => {
  if (isPending || !organizations.length) {
    const getNoDataText = () => {
      if (isPaidEvent) {
        return 'No discounts found';
      }

      if (isPaidEvent && !enabledDiscountStatus.includes(status)) {
        return `Discounts are disabled for events in ${status} status`;
      }

      return 'Discounts are disabled for free events';
    };

    return <DataTable columns={discountColumns} data={[]} loading={isPending} noDataText={getNoDataText()} />;
  }

  return (
    <>
      {organizations.map((organization) => (
        <div key={organization.organizationId} className="w-full">
          <DiscountHeader organization={organization} />
          <DataTable columns={discountColumns} data={organization.discounts} />
        </div>
      ))}
    </>
  );
};

const AdminEventDiscounts: FC = () => {
  const {
    event: { eventId, paidEvent, status }
  } = useAdminEvent();
  const { data: response, isPending, refetch } = useApiQuery(getAllDiscounts(eventId));

  const discountsDisabled = isPending || !paidEvent || !enabledDiscountStatus.includes(status);

  return (
    <section className="flex flex-col gap-6 items-center">
      <div className="inline-flex justify-center items-center space-x-4">
        <h2>Discounts</h2>
        <Tooltip toolTipContent="Refresh discounts" side="right">
          <Button variant="outline" disabled={!paidEvent} loading={isPending} size="icon" icon="RotateCw" onClick={() => refetch()} />
        </Tooltip>
      </div>
      <CreateDiscountModal disabled={discountsDisabled} eventId={eventId} refetch={refetch} />
      <DiscountTables organizations={response?.data || []} status={status} isPaidEvent={paidEvent} isPending={isPending} />
    </section>
  );
};

const AdminEventDiscountsPage = () => {
  return <AdminEventDiscounts />;
};

export const Component = AdminEventDiscountsPage;

export default AdminEventDiscountsPage;
