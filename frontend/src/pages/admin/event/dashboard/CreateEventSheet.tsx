import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import Sheet from '@/components/Sheet';
import { Textarea } from '@/components/TextArea';
import { useAdminEventForm } from '@/hooks/useAdminEventForm';

interface CreateEventSheetProps {
  isCreateEventOpen: boolean;
  setCreateEventOpen: (open: boolean) => void;
  refetch: () => void;
}

const CreateEventSheet: FC<CreateEventSheetProps> = ({ isCreateEventOpen, setCreateEventOpen, refetch }) => {
  const { form, submit } = useAdminEventForm({ refetch, setCreateEventOpen });

  const handleSubmit = async () => await submit();

  const handleCancel = () => {
    form.reset();
    setCreateEventOpen(false);
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <Button variant="ghost" onClick={handleCancel}>
        Cancel
      </Button>
      <Button type="submit" loading={form.formState.isSubmitting} variant="primaryGradient" onClick={handleSubmit}>
        Create event
      </Button>
    </div>
  );

  return (
    <Sheet side="right" onOpenChange={setCreateEventOpen} visible={isCreateEventOpen} className="space-y-4" footer={footer}>
      <h3>Create event</h3>
      <FormProvider {...form}>
        <CreateEventForm />
      </FormProvider>
    </Sheet>
  );
};

const CreateEventForm: FC = () => {
  return (
    <main className="w-full space-y-2">
      <FormItem name="name">
        {({ field }) => (
          <div className="flex flex-col">
            <FormLabel>Event Name</FormLabel>
            <Input type="text" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="description">
        {({ field }) => (
          <div className="flex flex-col">
            <FormLabel>Description</FormLabel>
            <Textarea placeholder="Type your message here." {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="email">
        {({ field }) => (
          <div className="flex flex-col">
            <FormLabel>Email</FormLabel>
            <Input type="email" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="venue">
        {({ field }) => (
          <div className="flex flex-col">
            <FormLabel>Venue</FormLabel>
            <Input type="text" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="price">
        {({ field }) => (
          <div className="flex flex-col">
            <FormLabel>Price</FormLabel>
            <Input type="number" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="startDate">
        {({ field: { value, onChange } }) => (
          <div className="flex flex-col">
            <FormLabel>Event Start Date</FormLabel>
            <DatePicker value={value} onChange={onChange} includeTime />
            <FormError />
          </div>
        )}
      </FormItem>
      <FormItem name="endDate">
        {({ field: { value, onChange } }) => (
          <div className="flex flex-col">
            <FormLabel>Event End Date</FormLabel>
            <DatePicker value={value} onChange={onChange} includeTime />
            <FormError />
          </div>
        )}
      </FormItem>
    </main>
  );
};

export default CreateEventSheet;
