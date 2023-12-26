import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from '@/components/Button';
import EventCardList from '@/components/EventCardList';
import Footer from '@/components/Footer';
import logoTitleBorder from '../assets/logos/techtix-border-logo-title.png';
import MakeEvent from '../assets/make-event.png';
import Robot from '../assets/robot.svg';

function Header() {
  return (
    <header className="fixed z-20 py-4 md:py-6 h-20 md:h-28 px-5 md:px-24 flex items-center">
      <Link to={'#hero'} className="inline h-full w-auto">
        <img src={logoTitleBorder} alt="Techtix Logo" className="inline h-full w-auto" />
      </Link>
    </header>
  );
}

function Hero() {
  return (
    <section id="hero" className={`w-full bg-[url('../assets/logos/hero-bg.png')] bg-no-repeat bg-cover bg-right relative`}>
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
          <Link to="./events">
            <Button variant={'primaryGradient'} className="text-lg w-48 p-8 rounded-2xl">
              Join Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function MakeYourOwnEvent() {
  return (
    <section className="bg-primary-700 flex flex-col md:flex-row items-center md:items-start md:justify-center md:gap-16 px-5 pt-52 md:pt-16 md:pb-16 pb-10 relative">
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
  const location = useLocation();
  useEffect(() => {
    const anchorId = location.hash.replace('#', '');
    if (anchorId) {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView();
      }
    }
  }, [location.hash]);

  return (
    <>
      <main>
        <Header />
        <Hero />
        <section className="bg-white md:p-20 px-5 py-20 flex flex-col items-center">
          <h1 className="text-center !text-primary-700">Upcoming Events</h1>
          <EventCardList />
          <Button className="py-8 px-14 rounded-full w-56" variant={'outline'}>
            Load More
          </Button>
        </section>
        <MakeYourOwnEvent />
        <Footer />
        <div id="contact"></div>
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
