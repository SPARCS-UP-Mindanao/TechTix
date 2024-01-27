import { FC } from 'react';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import RichTextEditor from '@/components/RichContent/RichTextEditor';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import { EVENT_STATUSES, EVENT_UPLOAD_TYPE, EVENT_OBJECT_KEY_MAP, Event } from '@/model/events';
import { useAdminEventForm } from '@/hooks/useAdminEventForm';

interface Props {
  event?: Event;
}

const AdminEventForm: FC<Props> = ({ event }) => {
  const eventId = event?.eventId;
  const { form, submit, cancel } = useAdminEventForm({ event });
  const { setValue, getValues } = form;
  const paidEvent = getValues('payedEvent');
  const { isSubmitting, isDirty } = form.formState;
  console.log(form.formState);

  const handleSubmit = async () => await submit();

  return (
    <FormProvider {...form}>
      <main className="w-full flex flex-wrap gap-y-2">
        <FormItem name="name">
          {({ field }) => (
            <div className="space-y-2 w-full px-2">
              <FormLabel>Event Name</FormLabel>
              <Input type="text" className="" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="description">
          {({ field: { value, onChange } }) => (
            <div className="space-y-2 w-full px-2">
              <FormLabel>Description</FormLabel>
              <RichTextEditor content={value} setContent={onChange} placeholder="Describe your event" />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="email">
          {({ field }) => (
            <div className="space-y-2 w-full px-2 md:max-w-[50%]">
              <FormLabel>Email</FormLabel>
              <Input type="email" className="" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="venue">
          {({ field }) => (
            <div className="space-y-2 w-full px-2 md:max-w-[50%]">
              <FormLabel>Venue</FormLabel>
              <Input type="text" className="" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="payedEvent">
          {({ field }) => (
            <div className="space-y-2 w-full px-2">
              <div className="flex flex-row gap-2">
                <FormLabel>Is this a paid event?</FormLabel>
                <Checkbox id="isPayedEvent" checked={field.value} onCheckedChange={field.onChange} />
              </div>
              <FormError />
            </div>
          )}
        </FormItem>
        {paidEvent && (
          <>
            <FormItem name="price">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
                  <FormLabel>Price</FormLabel>
                  <Input type="number" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>

            <div className="md:max-w-[50%]" />
            <FormItem name="gcashName">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
                  <FormLabel>GCash Name</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>

            <FormItem name="gcashNumber">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
                  <FormLabel>GCash Number</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>

            <FormItem name="gcashQRCode">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
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
                </div>
              )}
            </FormItem>
            <div className="md:max-w-[50%]" />
          </>
        )}

        {event && (
          <FormItem name="status">
            {({ field }) => (
              <>
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
                  <FormLabel>Status</FormLabel>
                  <Select {...field} onValueChange={field.onChange}>
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
                </div>
                <div className="md:max-w-[50%]" />
              </>
            )}
          </FormItem>
        )}

        <FormItem name="startDate">
          {({ field: { value, onChange } }) => (
            <div className="space-y-2 w-full px-2 md:max-w-[50%]">
              <FormLabel>Event Start Date</FormLabel>
              <DatePicker value={value} onChange={onChange} includeTime />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="endDate">
          {({ field: { value, onChange } }) => (
            <div className="space-y-2 w-full px-2 md:max-w-[50%]">
              <FormLabel>Event End Date</FormLabel>
              <DatePicker value={value} onChange={onChange} includeTime />
              <FormError />
            </div>
          )}
        </FormItem>
        {event && (
          <>
            <FormItem name="bannerLink">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
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
                </div>
              )}
            </FormItem>

            <FormItem name="logoLink">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
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
                </div>
              )}
            </FormItem>

            <FormItem name="certificateTemplate">
              {({ field }) => (
                <div className="space-y-2 w-full px-2 md:max-w-[50%]">
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
                </div>
              )}
            </FormItem>
          </>
        )}

        <div className="w-full flex justify-end space-x-2">
          <Button icon="X" variant="ghost" onClick={cancel}>
            Cancel
          </Button>
          <Button icon="Save" disabled={!isDirty} loading={isSubmitting} onClick={handleSubmit} type="submit" variant="primaryGradient">
            Save
          </Button>
        </div>
      </main>
    </FormProvider>
  );
};

export default AdminEventForm;
