import { Globe } from 'lucide-react';
import Button from '@/components/Button';
import diceLogo from '../assets/logos/DICE_Lockup_Colored_Horizontal_Dark.svg';
import sparcsLogo from '../assets/logos/icon-192x192.png';
import iconFb from '../assets/logos/icon-fb.svg';
import iconIg from '../assets/logos/icon-ig.svg';
import iconLinkedin from '../assets/logos/icon-linkedin.svg';
import location from '../assets/logos/icon-loc.svg';
import logoTitleWhite from '../assets/logos/techtix-white-logo-title.png';
import Input from './Input';

function Footer() {
  const isSubscribingDisabled = true;
  return (
    <>
      <footer className="bg-primary-700 w-full grid md:grid-cols-3 grid-cols-1 gap-10 md:gap-5 lg:gap-10 text-white font-raleway font-light p-12 md:px-10 lg:px-32">
        <div className="flex flex-col md:items-center">
          <div className="flex flex-col gap-5">
            <div className="flex md:items-center gap-2 w-full max-w-[15rem]">
              <img src={logoTitleWhite} alt="SPARCS UP Min Logo" className="inline" />
            </div>
            <p>Seamlessly find, follow, and buy tickets for tech events hosted by Davao's vibrant tech communities.</p>
            <div className="flex flex-col gap-2 items-start">
              <p className="font-bold text-lg">In Collaboration with:</p>
              <img src={diceLogo} alt="DICE Logo" className="h-9" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:items-center">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 items-start">
              <p className="font-bold text-lg">Brought To You By:</p>
              <div className="flex md:items-center gap-1">
                <img src={sparcsLogo} alt="SPARCS UP Min Logo" className="w-16 h-16" />
                <div className="flex flex-col">
                  <p className="font-raleway">UP Mindanao</p>
                  <p className="font-arca font-bold text-3xl">SPARCS</p>
                </div>
              </div>
            </div>
            <div className="flex md:items-center gap-5">
              <img src={location} alt="Location Icon" />
              <p>University of the Philippines Mindanao, Tugbok District, Mintal, Davao City, Philippines 8000</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Globe />
                <a target="_blank" className="hover:underline" href="https://www.sparcsup.com/">
                  sparcsup.com
                </a>
              </div>
              <div className="flex gap-2">
                <img src={iconFb} alt="Facebook" />
                <a target="_blank" className="hover:underline" href="https://www.facebook.com/SPARCSUPMin/">
                  /SparcsUPMin
                </a>
              </div>
              <div className="flex gap-2">
                <img src={iconLinkedin} alt="LinkedIn" />
                <a target="_blank" className="hover:underline" href="https://www.linkedin.com/company/sparcsup/">
                  /sparcs_upmin
                </a>
              </div>
              <div className="flex gap-2">
                <img src={iconIg} alt="Instagram" />
                <a target="_blank" className="hover:underline" href="https://www.instagram.com/sparcs_upmin/">
                  /sparcs_upmin
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:items-center">
          <div className="flex flex-col gap-5">
            <p className="font-bold text-lg">Stay in the loop</p>
            <p>Join our mailing list to stay in the loop with our newest for Tech Events and meetups.</p>
            <div className="group w-full flex max-w-xs relative" aria-disabled={isSubscribingDisabled}>
              <Input
                type="email"
                placeholder="Enter your email address"
                className="light text-xs font-semibold pr-[6.5rem] rounded-full w-full focus-visible:ring-0 border-none"
                disabled={isSubscribingDisabled}
              />
              <Button variant="primaryGradient" className="rounded-full absolute right-0" disabled={isSubscribingDisabled}>
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </footer>
      <p className="text-black bg-white text-center text-xs py-2">Copyright © 2024 UP Mindanao SPARCS</p>
    </>
  );
}

export default Footer;
