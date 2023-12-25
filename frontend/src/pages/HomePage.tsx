import moment from 'moment';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { getAllEvents } from '@/api/events';
import { Event } from '@/model/events';
import { useApiQuery } from '@/hooks/useApi';
import Logo from '../assets/logos/techtix-logo.png';
import TitleBlack from '../assets/logos/techtix-title-black.png';
import MakeEvent from '../assets/make-event.png';
import Robot from '../assets/robot.svg';

function Header() {
  return (
    <header className="fixed z-20 h-20 md:h-28 md:px-10 flex items-center">
      <div className="scale-75">
        <img src={Logo} alt="Techtix Logo" className="inline" />
        <img src={TitleBlack} alt="Techtix Title" className="inline" />
      </div>
    </header>
  );
}

function EventCardList() {
  const { data: response, isFetching } = useApiQuery(getAllEvents());
  if (isFetching) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!response || (response && !response.data)) {
    return (
      <div className="py-10">
        <h1>Events not found</h1>
      </div>
    );
  }

  if (response.status === 200 && !response.data.length) {
    return (
      <div>
        <h1>There are currently no events</h1>
      </div>
    );
  }

  const eventInfos: Event[] = response.data;
  return (
    <section className="bg-white md:p-20 py-20 flex flex-col items-center">
      <h1 className="text-center !text-primary-700">Upcoming Events</h1>
      <div className="grid grid-cols-2 p-10 gap-5">
        {eventInfos.map((eventInfo) => (
          <Card
            key={eventInfo.eventId}
            cardDescription={<span className="inline-block w-full text-center ">{eventInfo.description}</span>}
            className="flex flex-col items-center justify-between"
          >
            <p>
              {moment(eventInfo.startDate).format('MMMM D YYYY hh:mm A')} - {moment(eventInfo.endDate).format('MMM D YYYY hh:mm A')}
            </p>
            <div>Ticket Price: ₱{eventInfo.price}</div>
          </Card>
        ))}
      </div>
      <Button className="py-8 px-14 rounded-full w-56" variant={'outline'}>
        Load More
      </Button>
    </section>
  );
}

function Hero() {
  return (
    <section className={`w-full bg-[url('../assets/logos/hero-bg.png')] bg-no-repeat bg-cover bg-right relative`}>
      <div className="absolute h-full w-full bg-white opacity-80 z-0"></div>
      <div className="pt-20 relative z-10 min-h-screen md:px-28 grid grid-rows-5 md:grid-rows-none md:grid-cols-6 md:justify-center w-full">
        <div className="relative md:absolute md:right-0 md:w-1/2 max-w-3xl row-span-2 w-full md:h-full">
          <img
            src={Robot}
            alt="Robot"
            className="absolute bottom-[-1rem] md:bottom-1/2 left-1/2 transform -translate-x-1/2 md:translate-y-1/2 h-full md:pr-32"
          />
        </div>
        <div className="pb-10 row-span-3 md:col-span-4 flex flex-col justify-start md:justify-center gap-10 items-center md:items-start md:gap-20 w-full z-20">
          <div className="px-2">
            <p className="text-primary-700 font-subjectivity text-6xl md:text-8xl font-bold text-center md:text-start">Discover Davao’s Tech Tribes</p>
            <p className="text-black  text-center md:text-start md:w-3/5">
              Seamlessly find, follow, and buy tickets for tech events hosted by Davao's vibrant tech communities.
            </p>
          </div>
          <Button variant={'primaryGradient'} className="text-lg w-48 p-8 rounded-2xl">
            Join Events
          </Button>
        </div>
      </div>
    </section>
  );
}

function MakeYourOwnEvent() {
  return (
    <section className="bg-primary-700 flex flex-col md:flex-row items-center md:items-start md:justify-center md:gap-10 px-5 pt-52 md:pt-16 md:pb-16 pb-10 relative">
      <div className="md:relative w-full h-full max-w-sm md:max-w-md md:min-w-[20rem]">
        <img
          src={MakeEvent}
          alt="Make Event"
          className="absolute top-[-4rem] md:top-[-6rem] left-1/2 transform -translate-x-1/2 md:-translate-x-0 md:left-0 w-full max-w-sm md:max-w-none"
        />
      </div>
      <div className="flex flex-col items-center md:items-start gap-4 w-full md:w-fit">
        <h2 className="text-center md:text-left">Make your own Event</h2>
        <p className="text-center md:text-left">Apply as a Tech Community in Davao City.</p>
        <Button variant={'primaryGradient'} className="py-6 px-14 w-56 rounded-2xl">
          Create Events
        </Button>
      </div>
    </section>
  );
}

function HomePageComponent() {
  return (
    <>
      <main>
        <Header />
        <Hero />
        <EventCardList />
        <MakeYourOwnEvent />
      </main>
    </>
  );
}

function HomePage() {
  return (
    <>
      <HomePageComponent />
    </>
  );
}

export default HomePage;
