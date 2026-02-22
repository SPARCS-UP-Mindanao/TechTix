import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoTitleBorder from '@/assets/logos/techtix-border-logo-title.png';
import Button from '@/components/Button';
import Sheet from '@/components/Sheet';
import { Toaster } from '@/components/Toast/Toaster';
import { getAllEvents } from '@/api/events';
import { useApiQuery } from '@/hooks/useApi';
import { useMetaData } from '@/hooks/useMetaData';
import EventCardList from '@/pages/landingPage/EventCardList';
import Footer from './Footer';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const NavbarOptions = () => (
    <>
      <Link to="../#hero" preventScrollReset={false}>
        <Button variant="ghost" className="w-full justify-start">
          Home
        </Button>
      </Link>
      <Link relative="path" to="/#contact">
        <Button variant="ghost" className="w-full justify-start">
          Contact
        </Button>
      </Link>
      <Link relative="path" to="/#contact">
        <Button variant="primaryGradient" className="w-full justify-start">
          Create Event
        </Button>
      </Link>
    </>
  );

  return (
    <header className="w-full text-primary-foreground bg-primary-700 py-2 h-16 px-5 md:px-24 flex items-center justify-around">
      <Link to="../" preventScrollReset={false} className="inline h-full w-auto">
        <img src={logoTitleBorder} alt="Techtix Logo" className="inline h-full w-auto" />
      </Link>
      <Button
        variant="ghost"
        className="md:hidden text-primary-foreground absolute left-2"
        size="icon"
        icon="List"
        onClick={() => setIsOpen(true)}
        iconClassname="w-6 h-6"
      />
      <Sheet className="light pt-12 w-64" closeIconClassName="text-primary-700" visible={isOpen} onOpenChange={setIsOpen}>
        <div className="text-primary-700 font-bold flex flex-col space-y-4">
          <NavbarOptions />
        </div>
      </Sheet>
      <div className="md:flex gap-10 items-center hidden">
        <NavbarOptions />
      </div>
    </header>
  );
};

const EventsPageComponent = () => {
  const setMetaData = useMetaData();
  setMetaData({});
  const { data: response, isPending } = useApiQuery(getAllEvents());

  return (
    <main className="flex flex-col h-full light">
      <Header />
      <div className="max-h-full overflow-auto">
        <section className="p-8 md:p-10 bg-white items-center">
          <h1 className="text-primary-700! pl-0 md:p-6 self-start">Upcoming Events</h1>
          <EventCardList allEvents={response?.data} isPending={isPending} />
        </section>
        <Footer />
      </div>
    </main>
  );
};

const EventsPage = () => {
  return (
    <>
      <EventsPageComponent />
      <Toaster />
    </>
  );
};

export const Component = EventsPage;

export default EventsPage;
