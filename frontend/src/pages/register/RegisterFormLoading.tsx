import React from 'react';
import Skeleton from '@/components/Skeleton';

const RegisterFormLoading: React.FC = () => {
  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full max-w-2xl flex flex-col items-center">
        <Skeleton className="w-12 h-12 rounded-full mb-4"></Skeleton>
        <Skeleton className="w-full h-56 rounded-md mb-4"></Skeleton>
        <Skeleton className="w-full h-8 rounded-sm mb-2"></Skeleton>
        <Skeleton className="w-full h-5 rounded-sm my-2"></Skeleton>
        <Skeleton className="w-full h-6 rounded-sm mt-2 mb-20"></Skeleton>

        <div className="w-full">
          <div className="space-y-4 mb-12">
            <Skeleton className="w-28 h-4 rounded-sm"></Skeleton>
            <Skeleton className="w-full h-12 rounded-sm"></Skeleton>
            <Skeleton className="w-full h-12 rounded-sm"></Skeleton>
          </div>

          <div className="flex w-full justify-around my-4">
            <div className="w-28 h-12 rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterFormLoading;
