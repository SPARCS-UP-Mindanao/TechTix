import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/Button';
import EventCardList from '@/components/EventCardList';
import Footer from '@/components/Footer';
import Sheet from '@/components/Sheet';
import logoTitleBorder from '../assets/logos/techtix-border-logo-title.png';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full bg-primary-700 fixed top-0 z-20 py-2 h-16 px-5 md:px-24 flex items-center justify-around">
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
      <Sheet className="light pt-12" closeIconClassName="text-primary-700" visible={isOpen} onOpenChange={setIsOpen}>
        <div className="text-primary-700 font-bold h-full flex flex-col gap-5">
          <Link to="../#hero" preventScrollReset={false}>
            Home
          </Link>
          <Link relative="path" to="/#contact">
            Contact
          </Link>
          <Link relative="path" to="/#contact">
            Create Event
          </Link>
        </div>
      </Sheet>
      <div className="md:flex gap-10 items-center hidden">
        <Link to="../#hero" preventScrollReset={false}>
          Home
        </Link>
        <Link relative="path" to="/#contact">
          Contact
        </Link>
        <Link relative="path" to="/#contact" className="border-white border rounded-full py-1 px-2">
          Create Event
        </Link>
      </div>
    </header>
  );
}

function EventsPageComponent() {
  return (
    <main>
      <Header />
      <section className="mt-16 py-10 px-5 bg-white flex flex-col items-center">
        <h1 className="!text-primary-700 self-start">Upcoming Events</h1>
        <EventCardList isLoadAll={false} />
      </section>
      <Footer />
    </main>
  );
}

function EventsPage() {
  return <EventsPageComponent />;
}

export default EventsPage;
