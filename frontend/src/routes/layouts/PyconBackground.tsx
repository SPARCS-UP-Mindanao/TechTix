import { FC, PropsWithChildren, useEffect } from 'react';
import background1 from '@/assets/pycon/background-1.png';
import background2 from '@/assets/pycon/background-2.png';

const PyconBackground: FC = () => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.classList.add('relative');
    }
  }, []);

  return (
    <div className="h-full">
      <img src={background2} className="absolute bottom-0 left-0 w-full h-auto lg:-bottom-60 xl:-bottom-[30%] -z-19 object-contain opacity-60" alt="" />
      <img src={background1} className="absolute bottom-0 left-0 w-full h-auto lg:-bottom-60 xl:-bottom-[30%] -z-20 object-contain opacity-60" alt="" />
    </div>
  );
};

export default PyconBackground;
