import { FC } from 'react';
import Separator from '@/components/Separator';
import Skeleton from '@/components/Skeleton';

const RegisterFormLoading: FC = () => {
  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-full h-56 rounded-md my-8" />
        <Skeleton className="w-full h-8 rounded-sm mb-4" />
        <Skeleton className="w-full h-5 rounded-sm my-2" />
        <Skeleton className="w-full h-6 rounded-sm mt-2 mb-4" />
        <Separator className="mb-12" />

        <div className="w-full">
          <div className="space-y-4 mb-12">
            <Skeleton className="w-28 h-4 rounded-sm" />
            <Skeleton className="w-full h-12 rounded-sm" />
            <Skeleton className="w-full h-12 rounded-sm" />
          </div>

          <div className="flex w-full justify-around my-4">
            <Skeleton className="w-28 h-12 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterFormLoading;
