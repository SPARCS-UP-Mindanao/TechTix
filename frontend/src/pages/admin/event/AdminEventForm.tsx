import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import AlertModal from '@/components/AlertModal';
import BlockNavigateModal from '@/components/BlockNavigateModal/BlockNavigateModal';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import RichTextEditor from '@/components/RichContent/RichTextEditor';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import { EVENT_STATUSES, EVENT_UPLOAD_TYPE, EVENT_OBJECT_KEY_MAP, Event } from '@/model/events';
import { cn } from '@/utils/classes';
import { isEmpty } from '@/utils/functions';
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
  const { form, submit, cancel } = useAdminEventForm({ event });
  const { setValue, getValues, formState } = form;
  const paidEvent = getValues('payedEvent');
  const { isSubmitting, dirtyFields } = formState;
  const isFormClean = isEmpty(dirtyFields);

  const handleSubmit = async () => await submit();

  return (
    <FormProvider {...form}>
      <BlockNavigateModal condition={!isFormClean} />
      <main className="w-full flex flex-wrap gap-y-2">
        <FormItem name="name">
          {({ field }) => (
            <AdminEventFormItem>
              <FormLabel>Event Name</FormLabel>
              <Input type="text" {...field} />
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

        <FormItem name="payedEvent">
          {({ field }) => (
            <AdminEventFormItem>
              <div className="flex flex-row gap-2">
                <FormLabel>Is this a paid event?</FormLabel>
                <Checkbox id="isPayedEvent" checked={field.value} onCheckedChange={field.onChange} />
              </div>
              <FormError />
            </AdminEventFormItem>
          )}
        </FormItem>

        {paidEvent && (
          <>
            <FormItem name="price">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Price</FormLabel>
                  <Input type="number" {...field} />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <AdminEventFormSpacer />
            <FormItem name="gcashName">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>GCash Name</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <FormItem name="gcashNumber">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>GCash Number</FormLabel>
                  <Input type="text" {...field} />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <FormItem name="gcashQRCode">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>GCash QR Code</FormLabel>
                  <FileUpload
                    entryId={eventId!}
                    uploadType={EVENT_UPLOAD_TYPE.GCASH_QR}
                    originalImage={event ? event.gcashQRCode : null}
                    setObjectKeyValue={(value: string) => {
                      setValue(EVENT_OBJECT_KEY_MAP.GCASH_QR, value);
                    }}
                    {...field}
                  />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>
            <AdminEventFormSpacer />
          </>
        )}

        {event && (
          <FormItem name="status">
            {({ field }) => (
              <>
                <AdminEventFormItem halfSpace>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
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

        {event && (
          <>
            <FormItem name="bannerLink">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Event Banner</FormLabel>
                  <FileUpload
                    entryId={eventId!}
                    uploadType={EVENT_UPLOAD_TYPE.BANNER}
                    originalImage={event.bannerLink}
                    setObjectKeyValue={(value: string) => {
                      setValue(EVENT_OBJECT_KEY_MAP.BANNER, value);
                    }}
                    {...field}
                  />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <FormItem name="logoLink">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Event Logo</FormLabel>
                  <FileUpload
                    entryId={eventId!}
                    uploadType={EVENT_UPLOAD_TYPE.LOGO}
                    originalImage={event.logoLink}
                    setObjectKeyValue={(value: string) => {
                      setValue(EVENT_OBJECT_KEY_MAP.LOGO, value);
                    }}
                    {...field}
                  />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>

            <FormItem name="certificateTemplate">
              {({ field }) => (
                <AdminEventFormItem halfSpace>
                  <FormLabel>Event Certificate Template</FormLabel>
                  <FileUpload
                    entryId={eventId!}
                    uploadType={EVENT_UPLOAD_TYPE.CERTIFICATE_TEMPLATE}
                    originalImage={event.certificateTemplate}
                    setObjectKeyValue={(value: string) => {
                      setValue(EVENT_OBJECT_KEY_MAP.CERTIFICATE_TEMPLATE, value);
                    }}
                    {...field}
                  />
                  <FormError />
                </AdminEventFormItem>
              )}
            </FormItem>
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
                <Button icon="X" disabled={isSubmitting || (event && isFormClean)} variant="ghost">
                  Discard changes
                </Button>
              }
            />
          ) : (
            <Button icon="X" disabled={isSubmitting || (event && isFormClean)} variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          )}

          <Button icon="Save" disabled={isFormClean} loading={isSubmitting} onClick={handleSubmit} type="submit" variant="primaryGradient">
            Save
          </Button>
        </div>
      </main>
    </FormProvider>
  );
};

export default AdminEventForm;
