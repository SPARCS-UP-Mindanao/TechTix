import AdminEventForm from '../AdminEventForm';

const CreateEventContent = () => (
  <div className="space-y-4">
    <header>
      <h2>Create an Event</h2>
      <p className="text-muted-foreground">Upon creating an event, its status will be draft. You can add event banners after you have drafted an event.</p>
    </header>

    <AdminEventForm />
  </div>
);

const CreateEventPage = () => {
  return <CreateEventContent />;
};

export const Component = CreateEventPage;

export default CreateEventPage;
