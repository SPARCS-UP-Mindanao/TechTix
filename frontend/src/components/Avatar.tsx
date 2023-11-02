import * as React from 'react';
import { cn } from '@/utils/classes';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

const AvatarContainer = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn('relative flex shrink-0 overflow-hidden rounded-full', className)} {...props} />
  )
);
AvatarContainer.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(
  ({ className, ...props }, ref) => <AvatarPrimitive.Image ref={ref} className={cn('aspect-square h-full w-full', className)} {...props} />
);
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)} {...props} />
  )
);
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { AvatarContainer, AvatarImage, AvatarFallback };

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  children?: React.ReactNode;
  src?: string;
  fallback: string;
}

const Avatar = ({ children, src, fallback, ...props }: AvatarProps) => {
  return (
    <AvatarContainer {...props}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
      {children}
    </AvatarContainer>
  );
};

export default Avatar;
