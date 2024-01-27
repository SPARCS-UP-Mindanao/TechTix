import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios, { AxiosError, AxiosResponse } from 'axios';
import logoTitleBorder from '@/assets/logos/techtix-border-logo-title.png';
import MakeEvent from '@/assets/make-event.png';
import Robot from '@/assets/robot.svg';
import Button from '@/components/Button';
import { useMetaData } from '@/hooks/useMetaData';
import EventCardList from '@/pages/landingPage/EventCardList';
import Footer from './Footer';

const Header = () => {
  return (
    <header className="fixed z-20 py-4 md:py-6 h-20 md:h-28 px-5 md:px-24 flex items-center">
      <Link to={'#hero'} className="inline h-full w-auto">
        <img src={logoTitleBorder} alt="Techtix Logo" className="inline h-full w-auto" />
      </Link>
    </header>
  );
};

const Hero = () => {
  return (
    <section id="hero" className={`w-full bg-[url('../assets/logos/hero-bg.png')] bg-no-repeat bg-cover bg-right relative`}>
      <div className="absolute h-full w-full bg-white opacity-80 z-0" />
      <div className="pt-20 relative z-10 min-h-screen md:px-28 grid grid-rows-5 md:grid-rows-none md:grid-cols-6 md:justify-center w-full">
        <div className="relative md:absolute md:right-0 md:w-1/2 max-w-3xl row-span-2 w-full md:h-full">
          <img
            src={Robot}
            alt="Robot"
            className="absolute bottom-[-1rem] md:bottom-1/2 left-1/2 transform -translate-x-1/2 md:translate-y-1/2 h-[90%] md:pr-32"
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
            <Button variant="primaryGradient" className="text-lg w-48 p-6 rounded-2xl">
              Join Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const MakeYourOwnEvent = () => {
  return (
    <section className="bg-primary-700 flex flex-col md:flex-row items-center md:items-start md:justify-center md:gap-16 px-5 pt-52 md:pt-16 md:pb-16 pb-10 relative">
      <div className="md:relative w-full h-full max-w-sm md:max-w-md md:min-w-[20rem]">
        <img
          src={MakeEvent}
          alt="Make Event"
          className="absolute top-[-4rem] md:top-[-6rem] left-1/2 transform -translate-x-1/2 md:-translate-x-0 md:left-0 w-full max-w-sm md:max-w-none"
        />
      </div>
      <div className="flex flex-col text-primary-foreground text-center items-center md:text-left md:items-start gap-4 w-full md:w-fit">
        <h2 className="text-primary-foreground">Make your own Event</h2>
        <p>Apply as a Tech Community in Davao City.</p>
        <Button variant={'primaryGradient'} className="p-6 w-56 rounded-2xl">
          Create Events
        </Button>
      </div>
    </section>
  );
};

const AuthTest = () => {
  const [code, setCode] = useState('');
  const baseURL = 'https://techtix.auth.ap-southeast-1.amazoncognito.com';
  const clientId = '58hijha2ki9ms7a20nosfsgt5h';
  const clientSecret = '61g2so9jg31cguaik9tmp4lvoh66uoboj31u7jgi2crgo2ll0q6';
  const authorizationHeader = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

  const googleLogin = () => {
    const currentUrl = window.location.origin;
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: currentUrl,
      identity_provider: 'Google',
      scope: 'profile email openid'
    });
    const authUrl = `${baseURL}/oauth2/authorize?${queryParams.toString()}`;
    window.location.href = authUrl;
  };

  const microsoftLogin = () => {
    const currentUrl = window.location.origin;
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: currentUrl,
      identity_provider: 'MicrosoftOIDC',
      scope: 'profile email openid'
    });
    const authUrl = `${baseURL}/oauth2/authorize?${queryParams.toString()}`;
    window.location.href = authUrl;
  }

  const getQueryParams = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    console.log('Code:', code);

    if (code) {
      setCode(code);

      const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code: code,
        redirect_uri: `${window.location.origin}`
      });

      const response = await axios.post(`${baseURL}/oauth2/token`, requestBody.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: authorizationHeader
        }
      });

      console.log('Tokens:', response.data);
    }
  };

  useEffect(() => {
    getQueryParams();
  }, [code]);

  return (
    <>
      <Button onClick={googleLogin}>Google</Button>
      <Button onClick={microsoftLogin}>Microsoft</Button>
    </>
  );
};

const HomePageComponent = () => {
  useMetaData({});
  const location = useLocation();
  const initCount = 4;

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
    <main>
      <AuthTest />
      {/* <Header />
      <Hero />
      <section className="bg-white px-5 py-20 flex flex-col items-center">
        <h1 className="text-center !text-primary-700">Upcoming Events</h1>
        <EventCardList isLoadAll={false} initialCount={initCount} />
      </section>
      <MakeYourOwnEvent />
      <Footer />
      <div id="contact" /> */}
    </main>
  );
};

const HomePage = () => {
  return <HomePageComponent />;
};

export default HomePage;
