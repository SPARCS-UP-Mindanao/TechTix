import { Outlet as AdminEventRoute } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import { Textarea } from '@/components/TextArea';
import { getEvent } from '@/api/events';
import { useEventForm } from '@/hooks/useAdminEventForm';
import { useApi } from '@/hooks/useApi';
import { EVENT_STATUSES, EVENT_UPLOAD_TYPE, EVENT_OBJECT_KEY_MAP } from '@/model/events';

const AdminEventPageContent = () => {
  const { eventId } = useParams();
  const { data: response, isFetching } = useApi(getEvent(eventId!));
  const { form, submit } = useEventForm({ eventId });
  const { setValue } = form;

  const handleSubmit = async () => {
    await submit();
  };

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
      <div>
        <h1>Event not found</h1>
      </div>
    );
  }

  const eventInfo = response.data;

  return (
    <section className="p-10">
      <div className="flex flex-col gap-3 items-center justify-center w-full">
        <h1>Update {eventInfo.name}</h1>
        <FormProvider {...form}>
          <main className="w-full">
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
            <FormItem name="status">
              {({ field }) => (
                <div className="flex flex-col w-full">
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
            <FormItem name="bannerLink">
              {({ field }) => (
                <div className="flex flex-col gap-3">
                  <FormLabel>Event Banner</FormLabel>
                  <FileUpload
                    entryId={eventId!}
                    uploadType={EVENT_UPLOAD_TYPE.LOGO}
                    originalImage={eventInfo.bannerUrl}
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
                    originalImage={eventInfo.logoUrl}
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
                    originalImage={eventInfo.certificateTemplateUrl}
                    setObjectKeyValue={(value: string) => {
                      setValue(EVENT_OBJECT_KEY_MAP.CERTIFICATE_TEMPLATE, value);
                    }}
                    {...field}
                  />
                  <FormError />
                </div>
              )}
            </FormItem>
            <Button onClick={handleSubmit} type="submit">
              Submit
            </Button>
          </main>
        </FormProvider>
      </div>
      <AdminEventRoute />
    </section>
  );
};

export default AdminEventPageContent;
