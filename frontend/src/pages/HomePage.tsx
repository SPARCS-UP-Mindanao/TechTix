import Button from '@/components/Button';
import Logo from '../assets/logos/techtix-logo.png';
import TitleBlack from '../assets/logos/techtix-title-black.png';
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

function HomePageComponent() {
  return (
    <>
      <main>
        <Header />
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
            <div className="pb-10 row-span-3 md:col-span-4 flex flex-col justify-start md:justify-center gap-10 items-center md:items-start w-full z-20">
              <p className="text-primary-700 font-subjectivity text-6xl md:text-8xl font-bold text-center md:text-start">Discover Davao’s Tech Tribes</p>
              <p className="text-black  text-center md:text-start md:w-3/5">
                Seamlessly find, follow, and buy tickets for tech events hosted by Davao's vibrant tech communities.
              </p>
              <Button variant={'primaryGradient'} className="text-lg w-48 p-8 rounded-2xl">
                Join Events
              </Button>
            </div>
          </div>
        </section>
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
