import { FC } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import RichTextEditor from '@/components/RichTextEditor';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import { EVENT_STATUSES, EVENT_UPLOAD_TYPE, EVENT_OBJECT_KEY_MAP, Event } from '@/model/events';
import { useAdminEventForm } from '@/hooks/useAdminEventForm';

const AdminEventInfo: FC = () => {
  const event = useOutletContext<Event>();
  const { eventId } = event;
  const { form, submit } = useAdminEventForm({ eventId });
  const { setValue, watch } = form;
  const watchPayedEvent = watch('payedEvent', false);
  const watchDescription = watch('description', '');

  const handleSubmit = async () => {
    await submit();
  };

  const redirectToRegistration = () => {
    window.open(`/${eventId}/register`, '_blank');
  };

  return (
    <section className="p-10">
      <div className="flex flex-col gap-3 items-center justify-center w-full">
        <h1>{event.name}</h1>
        <Button onClick={redirectToRegistration}>Go to Event Registration</Button>
        <FormProvider {...form}>
          <main className="w-full flex flex-col">
            <FormItem name="name">
              {({ field }) => (
                <div className="flex flex-col gap-1">
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
                    description={watchDescription}
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
                <div className="flex flex-col gap-1">
                  <FormLabel>Email</FormLabel>
                  <Input type="email" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="venue">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Venue</FormLabel>
                  <Input type="text" className="" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="payedEvent">
              {({ field }) => (
                <div className="flex flex-col gap-1">
                  <div className="flex flex-row gap-2">
                    <FormLabel>Is this a Payed Event?</FormLabel>
                    <Checkbox id="isPayedEvent" value="isPayedEvent" checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                  <FormError />
                </div>
              )}
            </FormItem>
            {watchPayedEvent && (
              <>
                <FormItem name="price">
                  {({ field }) => (
                    <div className="flex flex-col gap-1">
                      <FormLabel>Price</FormLabel>
                      <Input type="number" className="" {...field} />
                      <FormError />
                    </div>
                  )}
                </FormItem>
                <FormItem name="gcashName">
                  {({ field }) => (
                    <div className="flex flex-col gap-1">
                      <FormLabel>GCash Name</FormLabel>
                      <Input type="text" className="" {...field} />
                      <FormError />
                    </div>
                  )}
                </FormItem>
                <FormItem name="gcashNumber">
                  {({ field }) => (
                    <div className="flex flex-col gap-1">
                      <FormLabel>GCash Number</FormLabel>
                      <Input type="text" className="" {...field} />
                      <FormError />
                    </div>
                  )}
                </FormItem>
                <FormItem name="gcashQRCode">
                  {({ field }) => (
                    <div className="flex flex-col gap-3">
                      <FormLabel>GCash QR Code</FormLabel>
                      <FileUpload
                        entryId={eventId!}
                        uploadType={EVENT_UPLOAD_TYPE.GCASH_QR}
                        originalImage={event.gcashQRCode}
                        setObjectKeyValue={(value: string) => {
                          setValue(EVENT_OBJECT_KEY_MAP.GCASH_QR, value);
                        }}
                        {...field}
                      />
                      <FormError />
                    </div>
                  )}
                </FormItem>
              </>
            )}
            <FormItem name="status">
              {({ field }) => (
                <div className="flex flex-col gap-1 w-full">
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
              )}
            </FormItem>
            <FormItem name="startDate">
              {({ field: { value, onChange } }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Event Start Date</FormLabel>
                  <DatePicker value={value} onChange={onChange} includeTime />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="endDate">
              {({ field: { value, onChange } }) => (
                <div className="flex flex-col gap-1">
                  <FormLabel>Event End Date</FormLabel>
                  <DatePicker value={value} onChange={onChange} includeTime />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="bannerLink">
              {({ field }) => (
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
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
            <Button onClick={handleSubmit} type="submit" variant={'primaryGradient'} className="self-center">
              Submit
            </Button>
          </main>
        </FormProvider>
      </div>
    </section>
  );
};

const AdminEventInfoPage = () => {
  return <AdminEventInfo />;
};

export default AdminEventInfoPage;
