import { cn } from '@/utils/classes';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-primary-200 dark:bg-neutral-100', className)} {...props} />;
}

export default Skeleton;
