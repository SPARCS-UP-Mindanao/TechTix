import Skeleton from '@/components/Skeleton';

const RegisterFormSubmittingSkeleton = () => {
  return (
    <section className="flex flex-col items-center px-4">
      <div className="w-full space-y-4 mb-12">
        <Skeleton className="w-full h-12 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />
        <Skeleton className="w-full h-12 rounded-sm" />
      </div>
    </section>
  );
};

export default RegisterFormSubmittingSkeleton;
