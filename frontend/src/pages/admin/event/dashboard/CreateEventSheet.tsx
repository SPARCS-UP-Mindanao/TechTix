import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DatePicker from '@/components/DatePicker';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import RichTextEditor from '@/components/RichTextEditor';
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
  const { watch, setValue } = form;
  const watchPayedEvent = watch('payedEvent', false);
  const watchDescription = watch('description', '');

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
    <Sheet side="right" onOpenChange={setCreateEventOpen} visible={isCreateEventOpen} className="pt-12 space-y-4" footer={footer}>
      <h3>Create event</h3>
      <FormProvider {...form}>
        <CreateEventForm payedEvent={watchPayedEvent} description={watchDescription} setValue={setValue} />
      </FormProvider>
    </Sheet>
  );
};

interface CreateEventFormProps {
  payedEvent: boolean;
  description: string;
  setValue(key: any, value: any): void;
}

const CreateEventForm = ({ payedEvent, description, setValue }: CreateEventFormProps) => {
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
        {({}) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Description</FormLabel>
            <RichTextEditor
              description={description}
              setDescription={(value: string) => {
                setValue('description', value);
              }}
            />
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
      <FormItem name="payedEvent">
        {({ field }) => (
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              <FormLabel>Is this a Payed Event?</FormLabel>
              <Checkbox id="isPayedEvent" value="isPayedEvent" checked={field.value} onCheckedChange={field.onChange} />
            </div>
            <FormError />
          </div>
        )}
      </FormItem>
      {payedEvent && (
        <FormItem name="price">
          {({ field }) => (
            <div className="flex flex-col">
              <FormLabel>Price</FormLabel>
              <Input type="number" className="" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      )}
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
