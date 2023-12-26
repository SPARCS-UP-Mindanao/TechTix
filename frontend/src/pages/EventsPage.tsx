import { Link } from 'react-router-dom';
import EventCardList from '@/components/EventCardList';
import Footer from '@/components/Footer';
import logoTitleBorder from '../assets/logos/techtix-border-logo-title.png';

function Header() {
  return (
    <header className="w-full bg-primary-700 fixed top-0 z-20 py-2 h-16 px-5 md:px-24 flex items-center justify-around">
      <Link to="../" preventScrollReset={false} className="inline h-full w-auto">
        <img src={logoTitleBorder} alt="Techtix Logo" className="inline h-full w-auto" />
      </Link>
      <div className="flex gap-5 items-center">
        <Link to="../" preventScrollReset={false}>
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
      <section className="mt-16 py-10 px-5 md:px-20 bg-white">
        <h1 className="!text-primary-700">Upcoming Events</h1>
        <EventCardList />
      </section>
      <Footer />
    </main>
  );
}

function EventsPage() {
  return <EventsPageComponent />;
}

export default EventsPage;
