import Button from '@/components/Button';
import Logo from '../assets/logos/techtix-logo.png';
import TitleBlack from '../assets/logos/techtix-title-black.png';
import Robot from '../assets/robot.svg';

function Header() {
  return (
    <header className="fixed z-20 h-20 flex items-center">
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
      <Header />
      <main>
        <section className={`w-full h-screen bg-[url('../assets/logos/hero-bg.png')] bg-no-repeat bg-cover bg-right relative`}>
          <div className="absolute h-full w-full bg-white opacity-80 z-0"></div>
          <div className="pt-20 relative z-10 h-screen md:px-32 grid grid-rows-5 w-full">
            <div className="relative row-span-2 w-full">
              <img src={Robot} alt="Robot" className="absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2  h-full" />
            </div>
            <div className="row-span-3 flex flex-col justify-start gap-10 items-center w-full z-20">
              <p className="text-primary-700 font-subjectivity text-6xl md:text-7xl font-bold text-center">Discover Davao’s Tech Tribes</p>
              <p className="text-black text-center">Seamlessly find, follow, and buy tickets for tech events hosted by Davao's vibrant tech communities.</p>
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
