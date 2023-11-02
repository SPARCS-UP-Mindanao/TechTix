import { Outlet as AdminEventRoute } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import { Textarea } from '@/components/TextArea';
import { getEvent } from '@/api/events';
import { useEventForm } from '@/hooks/useAdminEventForm';
import { useApi } from '@/hooks/useApi';

const AdminEventPageContent = () => {
  const eventId = useParams().eventId;
  const { data: response, isFetching } = useApi(getEvent(eventId!));
  const { form, submit } = useEventForm(eventId!);
  console.log(form.formState);

  const valueLabel = [
    {
      value: 'draft',
      label: 'Draft'
    },
    {
      value: 'open',
      label: 'Open'
    },
    {
      value: 'cancelled',
      label: 'Cancelled'
    },
    {
      value: 'closed',
      label: 'Closed'
    },
    {
      value: 'completed',
      label: 'Completed'
    }
  ];

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
    <section>
      <h1>Update Event {eventInfo.name}</h1>
      <div className="flex flex-col items-center justify-center w-full">
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
                  <FormLabel>Last Name</FormLabel>
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
                <div className="flex flex-col">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an Event Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Event Status</SelectLabel>
                        {valueLabel.map((item) => (
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
              {({ field }) => (
                <div className="flex flex-col">
                  <FormLabel>Event Start Date</FormLabel>
                  <input type="datetime-local" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="endDate">
              {({ field }) => (
                <div className="flex flex-col">
                  <FormLabel>Event End Date</FormLabel>
                  <input type="datetime-local" {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="autoConfirm">
              {({ field }) => (
                <div className="flex flex-col">
                  <FormLabel>Auto Confirm Registrations?</FormLabel>
                  <Checkbox {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <FormItem name="payedEvent">
              {({ field }) => (
                <div className="flex flex-col">
                  <FormLabel>Is this a Payed Event?</FormLabel>
                  <Checkbox {...field} />
                  <FormError />
                </div>
              )}
            </FormItem>
            <Button onClick={submit} type="submit">
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
