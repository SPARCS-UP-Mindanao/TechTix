import { FC } from 'react';
import { FormProvider, useFormState, useWatch } from 'react-hook-form';
import AlertModal from '@/components/AlertModal';
import BlockNavigateModal from '@/components/BlockNavigateModal/BlockNavigateModal';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import RichTextEditor from '@/components/RichContent/RichTextEditor';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import Separator from '@/components/Separator';
import Switch from '@/components/Switch';
import { EVENT_STATUSES, EVENT_UPLOAD_TYPE, Event } from '@/model/events';
import { cn } from '@/utils/classes';
import { useAdminEventForm } from '@/hooks/useAdminEventForm';

interface Props {
  event?: Event;
}

interface AdminEventFormItemProps {
  halfSpace?: boolean;
  children: React.ReactNode;
}

const AdminEventFormItem: FC<AdminEventFormItemProps> = ({ halfSpace = false, children }) => {
  return <div className={cn('space-y-2 w-full px-2', halfSpace && 'md:w-1/2')}>{children}</div>;
};

const AdminEventFormSpacer: FC = () => {
  return (
    <div className="md:max-w-[50%]">
      <pre> </pre>
    </div>
  );
};

const AdminEventForm: FC<Props> = ({ event }) => {
  const eventId = event?.eventId;
  const { form, submit, cancel } = useAdminEventForm(event);
  const paidEvent = useWatch({ name: 'paidEvent', control: form.control });
  const isLimitedSlot = useWatch({ name: 'isLimitedSlot', control: form.control });
  const { isSubmitting, isDirty } = useFormState({ control: form.control });

  const handleSubmit = async () => await submit();

  return (
    <FormProvider {...form}>
      <BlockNavigateModal condition={isDirty} />
      <main className="w-full flex flex-wrap gap-y-2">
        <FormItem name="name">
          {({ field: { value, onChange } }) => (
            <AdminEventFormItem>
              <FormLabel>Event Name</FormLabel>
              <Input type="text" value={value} onChange={onChange} />
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        <FormItem name="description">
          {({ field: { value, onChange } }) => (
            <AdminEventFormItem>
              <FormLabel>Description</FormLabel>
              <RichTextEditor content={value} setContent={onChange} placeholder="Describe your event" />
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        <FormItem name="email">
          {({ field }) => (
            <AdminEventFormItem halfSpace>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        <FormItem name="venue">
          {({ field }) => (
            <AdminEventFormItem halfSpace>
              <FormLabel>Venue</FormLabel>
              <Input type="text" {...field} />
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        <Separator className="my-4" />

        <FormItem name="paidEvent">
          {({ field }) => (
            <AdminEventFormItem halfSpace>
              <div className="flex flex-row gap-2">
                <FormLabel>Is this a paid event?</FormLabel>
                <Switch id="isPaidEvent" checked={field.value} onCheckedChange={field.onChange} />
              </div>
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        {paidEvent && (
          <FormItem name="price">
            {({ field }) => (
              <AdminEventFormItem halfSpace>
                <FormLabel>Price</FormLabel>
                <Input type="number" {...field} />
                <FormError />
              </AdminEventFormItem>
            )}
          </FormItem>
        )}

        <Separator className="my-4" />

        <FormItem name="isLimitedSlot">
          {({ field }) => (
            <AdminEventFormItem halfSpace>
              <div className="flex flex-row gap-2">
                <FormLabel>Are slots limited?</FormLabel>
                <Switch id="isLimitedSlot" checked={field.value} onCheckedChange={field.onChange} />
              </div>
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        {isLimitedSlot && (
          <FormItem name="maximumSlots">
            {({ field }) => (
              <AdminEventFormItem halfSpace>
                <FormLabel>Maximum Slots</FormLabel>
                <Input type="number" {...field} />
                <FormError />
              </AdminEventFormItem>
            )}
          </FormItem>
        )}

        <Separator className="my-4" />

        {event && (
          <FormItem name="status">
            {({ field: { value, onChange } }) => (
              <>
                <AdminEventFormItem halfSpace>
                  <FormLabel>Status</FormLabel>
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an Event Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Event Status</SelectLabel>
                        {EVENT_STATUSES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormError />
                </AdminEventFormItem>
                <AdminEventFormSpacer />
              </>
            )}
          </FormItem>
        )}

        <FormItem name="startDate">
          {({ field: { value, onChange } }) => (
            <AdminEventFormItem halfSpace>
              <FormLabel>Event Start Date</FormLabel>
              <DatePicker value={value} onChange={onChange} includeTime />
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        <FormItem name="endDate">
          {({ field: { value, onChange } }) => (
            <AdminEventFormItem halfSpace>
              <FormLabel>Event End Date</FormLabel>
              <DatePicker value={value} onChange={onChange} includeTime />
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        <Separator className="my-4" />

        {event && (
          <>
            <FormItem name="bannerLink">
              {({ field: { name, value, onChange } }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Event Banner</FormLabel>
                  <FileUpload name={name} eventId={eventId!} uploadType={EVENT_UPLOAD_TYPE.BANNER} value={value} onChange={onChange} />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <FormItem name="logoLink">
              {({ field: { name, value, onChange } }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Event Logo</FormLabel>
                  <FileUpload name={name} eventId={eventId!} uploadType={EVENT_UPLOAD_TYPE.LOGO} value={value} onChange={onChange} />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <FormItem name="certificateTemplate">
              {({ field: { name, value, onChange } }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Event Certificate Template</FormLabel>
                  <FileUpload name={name} eventId={eventId!} uploadType={EVENT_UPLOAD_TYPE.CERTIFICATE_TEMPLATE} value={value} onChange={onChange} />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>
            <Separator className="my-4" />
          </>
        )}

        <div className="w-full flex justify-end space-x-2">
          {event ? (
            <AlertModal
              alertModalTitle="Are you sure you want to discard all changes?"
              alertModalDescription="Discarding all changes may result in data loss."
              confirmVariant="negative"
              onCompleteAction={cancel}
              trigger={
                <Button icon="X" disabled={isSubmitting || (event && !isDirty)} variant="ghost">
                  Discard changes
                </Button>
              }
            />
          ) : (
            <Button icon="X" disabled={isSubmitting || (event && !isDirty)} variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          )}

          <Button icon="Save" disabled={!isDirty} loading={isSubmitting} onClick={handleSubmit} type="submit" variant="primaryGradient">
            Save
          </Button>
        </div>
      </main>
    </FormProvider>
  );
};

export default AdminEventForm;
