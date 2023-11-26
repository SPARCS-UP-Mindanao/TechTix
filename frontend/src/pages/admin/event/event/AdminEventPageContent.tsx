import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { getEvent } from '@/api/events';
import { useApi } from '@/hooks/useApi';
import AdminEventDiscounts from './AdminEventDiscounts';
import AdminEventInfo from './AdminEventInfo';
import AdminEventRegistrations from './AdminEventRegistrations';

const AdminEventPageContent = () => {
  const { eventId } = useParams();
  const { data: response, isFetching } = useApi(getEvent(eventId!));

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

  const event = response.data;
  return (
    <Tabs defaultValue="dashboard" className="max-w-5xl w-full">
      <TabsList className="grid px-4 grid-cols-5">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="eventInfo">Info</TabsTrigger>
        <TabsTrigger value="registration">Registrations</TabsTrigger>
        <TabsTrigger value="discounts">Discounts</TabsTrigger>
        <TabsTrigger value="evaluations">Evaluations</TabsTrigger>
      </TabsList>

      <TabsContent value="dashboard">
        <h1>Dashboard</h1>
      </TabsContent>

      <TabsContent value="eventInfo">
        <AdminEventInfo event={event} />
      </TabsContent>

      <TabsContent value="registration">
        <AdminEventRegistrations eventId={event.entryId} />
      </TabsContent>

      <TabsContent value="discounts">
        <AdminEventDiscounts eventId={event.entryId} />
      </TabsContent>

      <TabsContent value="evaluations">
        <h1>Evaluations</h1>
      </TabsContent>
    </Tabs>
  );
};

export default AdminEventPageContent;
